const express = require('express');
const router = express.Router();
const trainingPlanController = require('../controllers/trainingPlanController');
const { authenticate } = require('../services/authService');

// Test endpoint without authentication


router.get('/:id', authenticate, trainingPlanController.getMyPlan);
router.post('/', authenticate, trainingPlanController.savePlan);
router.put('/:id' , authenticate, trainingPlanController.updatePlan);


module.exports = router; 