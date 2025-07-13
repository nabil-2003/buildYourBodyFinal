import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Header from "../components/Header";
import useAI from "../hooks/useAI";
import { useSelector } from "react-redux";

const PlanBuilderModal = () => {
  const [step, setStep] = useState(1);
  const [planType, setPlanType] = useState("");
  const [formData, setFormData] = useState({
    age: "",
    height: "",
    weight: "",
    targetWeight: "",
    sex: "",
    goal: "",
    activity: "",
    equipment: [],
    workoutDays: [],
    notes: "",
  });
  const {loadingPlan , AiErrorVal} = useSelector(state => state.planReducer);
  const {SendPromtToAi} = useAI()
const handleSubmit = ()=>{
   
        SendPromtToAi(formData , "generatePlanPromt")
}
  const handleNext = () => setStep((prev) => prev + 1);
  const handlePrev = () => setStep((prev) => prev - 1);
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleToggle = (key, value) => {
    setFormData((prev) => ({
      ...prev,
      [key]: prev[key].includes(value)
        ? prev[key].filter((v) => v !== value)
        : [...prev[key], value],
    }));
  };
  const progress = Math.round((step / 3) * 100);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-gradient-to-br from-gray-900 via-gray-800 to-black">
      <Header />
      <div className="min-h-screen flex items-center justify-center pt-20 pb-12 px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="w-full max-w-4xl"
        >
          <div className="bg-black/10 backdrop-blur-lg rounded-3xl shadow-2xl border border-gray-700/30 overflow-hidden">
            {/* Progress Bar */}
            <div className="px-8 pt-8 pb-4">
              <div className="w-full h-2 rounded-full bg-gray-700 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-red-500 to-orange-500 transition-all"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <p className="text-center text-gray-400 mt-2 text-sm">
                Step {step} of 3
              </p>
            </div>

            {/* Content Area */}
            <div className="p-8 md:p-12">
              <AnimatePresence mode="wait">
                {/* Step 1 */}
                {step === 1 && (
                  <motion.div
                    key="step1"
                    initial={{ x: 50, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: -50, opacity: 0 }}
                    transition={{ duration: 0.4 }}
                    className="space-y-8"
                  >
                    <h2 className="text-3xl md:text-4xl font-extrabold text-white text-center">
                      Choose Your Plan
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {["Home", "Gym"].map((type) => (
                        <button
                          key={type}
                          onClick={() => setPlanType(type)}
                          className={`p-8 rounded-2xl text-2xl font-bold shadow-lg transition-all duration-300 ${
                            planType === type
                              ? "bg-gradient-to-tr from-red-500 to-orange-500 text-white scale-[1.02]"
                              : "bg-gray-800 hover:bg-gray-700 text-gray-300"
                          }`}
                        >
                          <span className="text-3xl mr-2">
                            {type === "Home" ? "🏠" : "🏋️‍♂️"}
                          </span>
                          {type}
                        </button>
                      ))}
                    </div>
                    <div className="flex justify-center pt-4">
                      <button
                        disabled={!planType}
                        onClick={handleNext}
                        className={`px-10 py-3 rounded-full font-bold text-lg transition-colors ${
                          planType
                            ? "bg-red-500 hover:bg-red-600 text-white"
                            : "bg-gray-600 text-gray-400 cursor-not-allowed"
                        }`}
                      >
                        Next
                      </button>
                    </div>
                  </motion.div>
                )}

                {/* Step 2 */}
                {step === 2 && (
                  <motion.div
                    key="step2"
                    initial={{ x: 50, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: -50, opacity: 0 }}
                    transition={{ duration: 0.4 }}
                    className="space-y-6"
                  >
                    <h2 className="text-3xl md:text-4xl font-extrabold text-white text-center">
                      Tell Us About You
                    </h2>
                    
                    {/* Personal Info */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {[
                        { name: "age", placeholder: "Age" },
                        { name: "height", placeholder: "Height (cm)" },
                        { name: "weight", placeholder: "Weight (kg)" },
                        { name: "targetWeight", placeholder: "Target Weight (kg)" }
                      ].map(({ name, placeholder }) => (
                        <div key={name} className="space-y-1">
                          <label className="text-gray-300 text-sm">{placeholder}</label>
                          <input
                            name={name}
                            value={formData[name]}
                            onChange={handleChange}
                            className="w-full p-3 rounded-lg bg-gray-800 text-white placeholder-gray-400 focus:ring-2 focus:ring-orange-500 border border-gray-700"
                          />
                        </div>
                      ))}
                    </div>

                    {/* Dropdowns */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {[
                        { name: "sex", label: "Sex", options: ["Men", "Women"] },
                        { name: "goal", label: "Goal", options: ["Gain Muscle", "Lose Fat", "General Fitness"] },
                        { name: "activity", label: "Activity", options: ["Sedentary", "Lightly Active", "Active", "Very Active"] }
                      ].map(({ name, label, options }) => (
                        <div key={name} className="space-y-1">
                          <label className="text-gray-300 text-sm">{label}</label>
                          <select
                            name={name}
                            value={formData[name]}
                            onChange={handleChange}
                            className="w-full p-3 rounded-lg bg-gray-800 text-white focus:ring-2 focus:ring-orange-500 border border-gray-700"
                          >
                            <option value="">Select {label}</option>
                            {options.map((option) => (
                              <option key={option} value={option}>{option}</option>
                            ))}
                          </select>
                        </div>
                      ))}
                    </div>

                    {/* Equipment */}
                    <div className="space-y-2">
                      <p className="text-gray-300">Equipment:</p>
                      <div className="flex flex-wrap gap-2">
                        {["Dumbbells", "Mat", "Bands", "Bodyweight"].map((eq) => (
                          <button
                            key={eq}
                            onClick={() => handleToggle("equipment", eq)}
                            className={`px-4 py-2 rounded-full text-sm transition-colors ${
                              formData.equipment.includes(eq)
                                ? "bg-orange-500 text-white border-orange-400"
                                : "bg-gray-800 text-gray-300 border-gray-700 hover:bg-gray-700"
                            } border`}
                          >
                            {eq}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Workout Days */}
                    <div className="space-y-2">
                      <p className="text-gray-300">Workout Days:</p>
                      <div className="flex flex-wrap gap-2">
                        {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => (
                          <button
                            key={day}
                            onClick={() => handleToggle("workoutDays", day)}
                            className={`px-3 py-1 rounded-full text-xs transition-colors ${
                              formData.workoutDays.includes(day)
                                ? "bg-orange-500 text-white border-orange-400"
                                : "bg-gray-800 text-gray-300 border-gray-700 hover:bg-gray-700"
                            } border`}
                          >
                            {day}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Notes */}
                    <div className="space-y-2">
                      <p className="text-gray-300">Special Notes:</p>
                      <textarea
                        name="notes"
                        value={formData.notes}
                        onChange={handleChange}
                        placeholder="Any special considerations..."
                        className="w-full p-3 rounded-lg bg-gray-800 text-white placeholder-gray-400 focus:ring-2 focus:ring-orange-500 border border-gray-700"
                        rows={3}
                      />
                    </div>

                    {/* Navigation Buttons */}
                    <div className="flex justify-between pt-6">
                      <button
                        onClick={handlePrev}
                        className="px-6 py-3 rounded-full bg-gray-700 text-white hover:bg-gray-600 transition-colors"
                      >
                        Back
                      </button>
                      <button
                        onClick={handleSubmit}
                        className="px-6 py-3 rounded-full bg-orange-500 hover:bg-orange-600 text-white font-bold transition-colors"
                      >
                       { loadingPlan ? "Loading..." : "Submit Plan"}
                       
                      </button>
                    </div>
                    <div className="error">
                      {AiErrorVal && (
                        <p className="text-red-500 text-sm mt-2">
                          {AiErrorVal}
                        </p>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default PlanBuilderModal;