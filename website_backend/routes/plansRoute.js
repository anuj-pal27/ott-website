const express = require('express');
const router = express.Router();
const { getPublicPlans, getPublicPlanById, getAllCategories } = require('../controller/plansController');


router.get('/public', getPublicPlans);
router.get('/public/:planId', getPublicPlanById);
router.get('/categories', getAllCategories);

module.exports = router;