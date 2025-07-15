const express = require('express');
const router = express.Router();
const { getPublicPlans, getPublicPlanById } = require('../controller/plansController');


router.get('/public', getPublicPlans);
router.get('/public/:planId', getPublicPlanById);

module.exports = router;