const express = require('express');
const router = express.Router();
const { getAllPlans } = require('../controller/plansController');

router.get('/get-plans', getAllPlans);







module.exports = router;