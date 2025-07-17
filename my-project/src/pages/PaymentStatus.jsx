import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import paymentService from '../services/paymentService';

const PaymentStatus = () => {
    const [payment, setPayment] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [verifying, setVerifying] = useState(false);
    const [verifyMsg, setVerifyMsg] = useState('');
    const navigate = useNavigate();
    const location = useLocation();

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

    const handleVerifyPayment = async () => {
        setVerifying(true);
        setVerifyMsg('');
        setError(null);
        const params = new URLSearchParams(location.search);
        const paymentId = params.get('paymentId');
        try {
            const result = await paymentService.verifyPayment(paymentId);
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
    if (error) return <div className="dashboard-theme min-h-screen flex items-center justify-center text-red-500">{error}</div>;
    if (!payment) return <div className="dashboard-theme min-h-screen flex items-center justify-center">No payment details found.</div>;

    const { paymentStatus, paymentAmount, paymentMethod, paymentDate, order } = payment;
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
                <div className="mb-4">Amount Paid: <span className="font-semibold">₹{paymentAmount}</span></div>
                <div className="mb-4">Payment Method: <span className="font-semibold">{paymentMethod}</span></div>
                {paymentDate && <div className="mb-4">Payment Date: <span className="font-semibold">{new Date(paymentDate).toLocaleString()}</span></div>}
                {order && (
                    <div className="bg-white/10 rounded-xl p-4 mt-4">
                        <div className="font-semibold mb-2">Order Details</div>
                        <div>Order ID: {order._id}</div>
                        <div>Subscription: {order.subscriptionId?.serviceName || 'N/A'}</div>
                        <div>Duration: {order.selectedDuration?.duration || 'N/A'}</div>
                        <div>Start Date: {order.startDate ? new Date(order.startDate).toLocaleDateString() : 'N/A'}</div>
                        {order.endDate && <div>End Date: {new Date(order.endDate).toLocaleDateString()}</div>}
                    </div>
                )}
                {paymentStatus === 'pending' && (
                    <button
                        className="dashboard-button-primary w-full mt-6"
                        onClick={handleVerifyPayment}
                        disabled={verifying}
                    >
                        {verifying ? 'Verifying...' : 'Verify Payment'}
                    </button>
                )}
                {verifyMsg && <div className="dashboard-success mt-4">{verifyMsg}</div>}
            </div>
        </div>
    );
}

export default PaymentStatus;