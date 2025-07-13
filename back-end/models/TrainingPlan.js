const mongoose = require('mongoose');

const ExerciseSchema = new mongoose.Schema({
  exerciceName: { type: String, required: true },
  smallImage: { type: String },
  sets: { type: String, required: true },
  reset: {
    betweenSetes: { type: String, default: '60s' },
    afterExercice: { type: String, default: '90s' }
  },
  completed: { type: Boolean, default: false }
});

const FoodEntrySchema = new mongoose.Schema({
  id: { type: Number, required: true },
  description: { type: String, required: true },
  logged: { type: Boolean, default: false }
});

const NutritionDataSchema = new mongoose.Schema({
  calories: { type: Number, default: 0 },
  carbs: { type: Number, default: 0 },
  protein: { type: Number, default: 0 },
  fats: { type: Number, default: 0 }
});

const WorkOutDaySchema = new mongoose.Schema({
  // Flexible key like "day1", "day2"
  day1: { type: String },
  day2: { type: String },
  day3: { type: String },
  exercices: [ExerciseSchema],
  nurtationNeeds: [NutritionDataSchema],
  nurtationProgress: [NutritionDataSchema],
  completed: { type: Boolean, default: false },
  foodEntries: [FoodEntrySchema]
});

const UserDataSchema = new mongoose.Schema({
  age: Number,
  height: Number,
  weight: Number,
  targetWeight: Number,
  sex: { type: String, enum: ['male', 'female', 'other'] },
  goal: String,
  activity: String,
  equipment: [String],
  workoutDays: [String],
  notes: String
});

const PlanSchema = new mongoose.Schema({

  planName: { type: String, required: true },
  workOut: [WorkOutDaySchema],
 data: { type : UserDataSchema , required: false },   
});

const TrainingPlanSchema = new mongoose.Schema({
userId: { type: String, required: true },
  plan: PlanSchema,
  status: { type: String, default: 'active', enum: ['active', 'archived', 'deleted'] },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Auto update updatedAt before saving
TrainingPlanSchema.pre('save', function (next) {
  this.updatedAt = new Date();
  next();
});

module.exports = mongoose.model('TrainingPlan', TrainingPlanSchema);
