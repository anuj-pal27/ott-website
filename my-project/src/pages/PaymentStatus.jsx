import React, { useEffect, useState, Suspense } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import paymentService from '../services/paymentService';
const Footer = React.lazy(() => import('../components/Footer'));

const PaymentStatus = () => {
    const [payment, setPayment] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [verifying, setVerifying] = useState(false);
    const [verifyMsg, setVerifyMsg] = useState('');
    const navigate = useNavigate();
    const location = useLocation();
    const [redirectCountdown, setRedirectCountdown] = useState(3);

    const fetchPayment = async (paymentId) => {
        setLoading(true);
        setError(null);
        try {
            const data = await paymentService.getPaymentDetails(paymentId);
            setPayment(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const paymentId = params.get('paymentId');
        if (!paymentId) {
            setError('Missing payment ID');
            setLoading(false);
            return;
        }
        fetchPayment(paymentId);
    }, [location.search]);

    // Auto-verify if payment is pending after fetching payment details
    useEffect(() => {
        if (payment && payment.paymentStatus === 'pending' && !verifying) {
            handleVerifyPayment();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [payment]);

    // Show countdown and redirect for failed/cancelled payments
    useEffect(() => {
        if (payment && payment.paymentStatus && payment.paymentStatus !== 'pending' && payment.paymentStatus !== 'success') {
            setRedirectCountdown(3);
            const interval = setInterval(() => {
                setRedirectCountdown((prev) => {
                    if (prev <= 1) {
                        clearInterval(interval);
                        navigate('/');
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
            return () => clearInterval(interval);
        }
    }, [payment, navigate]);

    const handleVerifyPayment = async () => {
        setVerifying(true);
        setVerifyMsg('');
        setError(null);
        const params = new URLSearchParams(location.search);
        const paymentId = params.get('paymentId');
        try {
            const result = await paymentService.verifyPayment(paymentId);
            console.log('📥 Verify result:', result);
            setVerifyMsg(result.message || 'Payment verified!');
            // Refresh payment details
            await fetchPayment(paymentId);
        } catch (err) {
            setError(err.message);
        } finally {
            setVerifying(false);
        }
    };

    if (loading) return <div className="dashboard-theme min-h-screen flex items-center justify-center"><div>Loading payment status...</div></div>;
    if (error && (!payment || !payment.paymentStatus || payment.paymentStatus === 'pending')) {
        return <div className="dashboard-theme min-h-screen flex items-center justify-center text-red-500">{error}</div>;
    }
    if (!payment) return <div className="dashboard-theme min-h-screen flex items-center justify-center">No payment details found.</div>;

    const { paymentStatus, paymentAmount, paymentMethod, paymentDate, order } = payment;
    console.log('📥 Payment status:', paymentStatus);
    console.log('📥 Payment:', payment);
    const isFailed = paymentStatus && paymentStatus !== 'pending' && paymentStatus !== 'success';
    console.log('📥 Is failed:', isFailed);
    return (
        <div className="dashboard-theme min-h-screen flex flex-col items-center justify-center p-4">
            <button
                className="absolute top-4 left-4 z-20 dashboard-button-secondary px-4 py-2 rounded-xl font-semibold text-base shadow-md hover:bg-secondary hover:text-white transition-all"
                onClick={() => navigate('/')}
                style={{ minWidth: 0, width: 'auto' }}
            >
                ← Go to Dashboard
            </button>
            <div className="dashboard-card max-w-lg w-full p-8 text-center">
                <h1 className="dashboard-heading mb-4">Payment Status</h1>
                <div className={`text-2xl font-bold mb-2 ${paymentStatus === 'success' ? 'text-green-500' : paymentStatus === 'pending' ? 'text-yellow-500' : 'text-red-500'}`}>{paymentStatus?.toUpperCase()}</div>
                {isFailed && (
                    <div className="bg-red-100 text-red-700 rounded-xl p-4 mb-4 border border-red-300">
                        <div className="text-lg font-semibold mb-2">Payment Failed or Cancelled</div>
                        <div className="mb-2">You will be redirected to the dashboard in <span className="font-bold">{redirectCountdown}</span> second{redirectCountdown !== 1 ? 's' : ''}.</div>
                        <div>If you believe this is a mistake, please try again or contact support.</div>
                    </div>
                )}
                <div className="mb-4 text-gray-700">Amount Paid: <span className="font-semibold text-gray-900">₹{paymentAmount}</span></div>
                <div className="mb-4 text-gray-700">Payment Method: <span className="font-semibold text-gray-900">{paymentMethod}</span></div>
                {paymentDate && <div className="mb-4 text-gray-700">Payment Date: <span className="font-semibold text-gray-900">{new Date(paymentDate).toLocaleString()}</span></div>}
                {order && (
                    <div className="bg-gray-50 rounded-xl p-4 mt-4 border border-gray-200">
                        <div className="font-semibold mb-2 text-gray-900">Order Details</div>
                        <div className="text-gray-700">Order ID: <span className="font-semibold text-gray-900">{order._id}</span></div>
                        <div className="text-gray-700">Subscription: <span className="font-semibold text-gray-900">{order.subscriptionId?.serviceName || 'N/A'}</span></div>
                        <div className="text-gray-700">Duration: <span className="font-semibold text-gray-900">{order.selectedDuration?.duration || 'N/A'}</span></div>
                        <div className="text-gray-700">Start Date: <span className="font-semibold text-gray-900">{order.startDate ? new Date(order.startDate).toLocaleDateString() : 'N/A'}</span></div>
                        {order.endDate && <div className="text-gray-700">End Date: <span className="font-semibold text-gray-900">{new Date(order.endDate).toLocaleDateString()}</span></div>}
                    </div>
                )}
                {paymentStatus === 'pending' && (
                    <div className="dashboard-button-primary w-full mt-6 opacity-50 cursor-not-allowed">Verifying Payment...</div>
                )}
                {verifyMsg && <div className="dashboard-success mt-4">{verifyMsg}</div>}
            </div>
            
            {/* Footer */}
            <Suspense fallback={<div className="dashboard-loading">Loading footer...</div>}>
                <Footer />
            </Suspense>
        </div>
    );
}

export default PaymentStatus;