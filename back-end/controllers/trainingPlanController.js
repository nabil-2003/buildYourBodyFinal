const TrainingPlan = require('../models/TrainingPlan');

// @desc Save or update the user's single plan
// @route POST /api/plans
// @access Private
exports.savePlan = async (req, res) => {
  try {
    const { plan } = req.body;
    const userId = req.user.id;
          
    if (!plan || !plan.planName || !Array.isArray(plan.workOut)) {
      console.error('Invalid plan format:', plan.planName, plan.workOut, plan.data);
      return res.status(400).json({ message: 'Invalid plan format' });
    }
   

      let existingPlan = await TrainingPlan.findOne({ userId, status: 'active' });

    if (existingPlan) {
      existingPlan.plan = plan;
      existingPlan.updatedAt = new Date();
      await existingPlan.save();
      return res.status(200).json({ message: 'Plan updated successfully', plan: existingPlan });
    }

    const newPlan = new TrainingPlan({
      userId,
      plan , 
      
    });

    await newPlan.save();
    res.status(201).json({ message: 'Plan created successfully', plan: newPlan });
  } catch (error) {
    console.error('savePlan error:', error);
    res.status(500).json({ message: 'Server error while saving the plan' });
  }
};


exports.getMyPlan = async (req, res) => {
  try {
    const userId = req.user.id;
    console.log("Fetching plan for user:", userId);
    const plan = await TrainingPlan.findOne({ userId, status: "active"});

    if (!plan) {
      return res.status(404).json({ message: 'No plan found for this user' });
    }

    res.status(200).json({ plan });
  } catch (error) {
    console.error('Error loading plan:', error);
    res.status(500).json({ message: 'Server error while loading the plan' });
  }
};

exports.updatePlan = async (req, res) => {
  try {
    const userId = req.user.id;
    console.log("Updating plan for user:", userId);
    

      let existingPlan = await TrainingPlan.findOne({ userId, status: 'active' });
         console.log("Existing plan found:", existingPlan.status);
    if (existingPlan) {
      existingPlan.status = 'archived'; // Archive the old plan
      existingPlan.updatedAt = new Date();
      await existingPlan.save();
      console.log("Archived existing plan:", existingPlan.status);
      return res.status(200).json({ message: 'Plan updated successfully' });
    }

  } catch (error) {
    console.error('savePlan error:', error);
    res.status(500).json({ message: 'Server error while saving the plan' });
  }
};

