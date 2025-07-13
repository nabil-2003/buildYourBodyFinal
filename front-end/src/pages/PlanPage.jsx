import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
// import anime from 'animejs';
import Header from '../components/Header';
import { useSelector, useDispatch } from 'react-redux';
import useAI from '../hooks/useAI';
import { setPlan } from '../reducers/PlanReducer';
import usePlan from '../hooks/usePlan';

const PlanPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { plan } = useSelector(state => state.planReducer);
  const {loadingPlan, saved} = useSelector(state => state.planReducer)
  const { user } = useSelector(state => state.userReducer)
   

  const { SendPromtToAi } = useAI();
  const {  savePlan , archivePlan } = usePlan();
  const [completedDays, setCompletedDays] = useState([]);
  const [completedExercises, setCompletedExercises] = useState([]);
  const [foodEntries, setFoodEntries] = useState([]);
  const [currentFoodInputs, setCurrentFoodInputs] = useState([]);

  // Load plan from localStorage
  useEffect(() => {
    const savedPlan = localStorage.getItem('plan');
    if (savedPlan) {
      dispatch(setPlan({ plan: JSON.parse(savedPlan) }));
    }
  }, [dispatch]);

  // Sync states when plan is updated
  useEffect(() => {
    if (plan?.workOut) {
      setCompletedDays(
        plan.workOut.map((day, i) => ({
          dayName: day[`day${i + 1}`],
          completed: day.completed || false,
        }))
      );

      setCompletedExercises(
        plan.workOut.map(day =>
          day.exercices?.map(exercise => ({
            exName: exercise.exerciceName,
            completed: exercise.completed || false,
          }))
        )
      );

      setFoodEntries(plan.workOut.map(day => day.foodEntries || []));
      setCurrentFoodInputs(plan.workOut.map(() => ''));
    }
  }, [plan]);

  const getDayName = (dayObj) => {
    return Object.keys(dayObj).find(key => key.startsWith('day'));
  };

  const updatePlan = (newExercises, newDays, newFoodEntries) => {
    const updatedPlan = {
      ...plan,
      workOut: plan.workOut.map((day, dayIndex) => ({
        ...day,
        completed: newDays[dayIndex]?.completed,
        exercices: day.exercices.map((exercise, exerciseIndex) => ({
          ...exercise,
          completed: newExercises[dayIndex]?.[exerciseIndex]?.completed || false,
        })),
        foodEntries: newFoodEntries[dayIndex] || [],
      })),
    };
    dispatch(setPlan({ plan: updatedPlan }));
  };

  const toggleExercise = (dayIndex, exerciseIndex) => {
    if (!completedExercises?.[dayIndex]?.[exerciseIndex]) return;
    const newCompleted = [...completedExercises];
    newCompleted[dayIndex][exerciseIndex].completed =
      !newCompleted[dayIndex][exerciseIndex].completed;
    setCompletedExercises(newCompleted);
    updatePlan(newCompleted, completedDays, foodEntries);
  };

  const toggleDay = (dayIndex) => {
    const newCompletedDays = [...completedDays];
    const newCompletedExercises = [...completedExercises];

    const isCompleted = !newCompletedDays[dayIndex]?.completed;
    newCompletedDays[dayIndex].completed = isCompleted;

    newCompletedExercises[dayIndex] = newCompletedExercises[dayIndex]?.map(ex => ({
      ...ex,
      completed: isCompleted,
    })) || [];

    setCompletedDays(newCompletedDays);
    setCompletedExercises(newCompletedExercises);
    updatePlan(newCompletedExercises, newCompletedDays, foodEntries);
  };

  const addFoodEntry = (dayIndex) => {
    const trimmedInput = currentFoodInputs[dayIndex]?.trim();
    if (trimmedInput) {
      const newEntries = [...foodEntries];
      newEntries[dayIndex] = [
        ...(newEntries[dayIndex] || []),
        {
          id: Date.now(),
          description: trimmedInput,
          logged: false,
        },
      ];
      setFoodEntries(newEntries);

      const newInputs = [...currentFoodInputs];
      newInputs[dayIndex] = '';
      setCurrentFoodInputs(newInputs);

      SendPromtToAi(
        { id: dayIndex, propmt: newEntries[dayIndex].map(entry => entry.description).join(', ') },
        "nutrationCalcPromt"
      );

      updatePlan(completedExercises, completedDays, newEntries);
    }
  };

  const toggleFoodEntry = (dayIndex, entryIndex) => {
    const newEntries = [...foodEntries];
    newEntries[dayIndex][entryIndex].logged = !newEntries[dayIndex][entryIndex].logged;
    setFoodEntries(newEntries);
    updatePlan(completedExercises, completedDays, newEntries);
  };

  const createTrainingPlan = () => {
    navigate('/plan-builder');
  };

  const save = () => {
       savePlan(plan)
  };

  const allDaysCompleted = completedDays.every(day => day.completed);

  // Animation effects
  useEffect(() => {
    // Set initial opacity for scroll-triggered elements
    document.querySelectorAll('.workout-day, .exercise-item, .nutrition-section').forEach(el => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(50px)';
    });

    // Page title animation
    setTimeout(() => {
      document.querySelectorAll('.plan-hero-title').forEach(el => {
        el.style.opacity = '1';
        el.style.transform = 'translateY(0)';
      });
    }, 100);

    setTimeout(() => {
      document.querySelectorAll('.plan-hero-subtitle').forEach(el => {
        el.style.opacity = '1';
        el.style.transform = 'translateY(0)';
      });
    }, 300);

    setTimeout(() => {
      document.querySelectorAll('.progress-overview').forEach(el => {
        el.style.opacity = '1';
        el.style.transform = 'scale(1)';
      });
    }, 500);

    // Scroll-triggered animations for workout days
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const target = entry.target;
          
          if (target.classList.contains('workout-day') || 
              target.classList.contains('exercise-item') || 
              target.classList.contains('nutrition-section')) {
            target.style.opacity = '1';
            target.style.transform = 'translateY(0)';
          }
          
          observer.unobserve(target);
        }
      });
    }, observerOptions);

    // Observe elements for scroll animations
    document.querySelectorAll('.workout-day, .exercise-item, .nutrition-section').forEach(el => {
      observer.observe(el);
    });

    return () => observer.disconnect();
  }, [plan]); // Re-run when plan changes

  // Animation for state changes
  useEffect(() => {
    // Simple animations for completed items
    document.querySelectorAll('.exercise-item.completed').forEach(el => {
      el.style.transform = 'scale(1.02)';
      setTimeout(() => {
        el.style.transform = 'scale(1)';
      }, 300);
    });

    document.querySelectorAll('.workout-day.completed').forEach(el => {
      el.style.transform = 'scale(1.01)';
      setTimeout(() => {
        el.style.transform = 'scale(1)';
      }, 300);
    });

    document.querySelectorAll('.nutrition-progress').forEach(el => {
      el.style.transform = 'scale(1.05)';
      setTimeout(() => {
        el.style.transform = 'scale(1)';
      }, 200);
    });
  }, [completedExercises, completedDays, foodEntries]); // Re-run when states change

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black pt-20 pb-12 px-4 sm:px-6 lg:px-8">
        {plan?.workOut ? (
          <>
            {/* Header Section */}
            <div className="max-w-7xl mx-auto mb-12">
              <div className="text-center">
                <h1 className="plan-hero-title text-4xl sm:text-5xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-orange-500 mb-4">
                  {plan.planName}
                </h1>
                <p className="plan-hero-subtitle text-gray-300 text-lg sm:text-xl max-w-2xl mx-auto">
                  Your personalized muscle gain journey - track your progress and stay motivated
                </p>
                
                {/* Progress Overview */}
                <div className="mt-8 flex justify-center">
                  <div className="progress-overview bg-gray-800/50 backdrop-blur-lg border border-gray-700/50 rounded-2xl p-6 shadow-xl">
                    <div className="flex items-center space-x-8">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-white">{completedDays.filter(day => day.completed).length}</div>
                        <div className="text-gray-400 text-sm">Days Completed</div>
                      </div>
                      <div className="w-px h-12 bg-gray-600"></div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-white">{plan.workOut.length}</div>
                        <div className="text-gray-400 text-sm">Total Days</div>
                      </div>
                      <div className="w-px h-12 bg-gray-600"></div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-green-400">
                          {Math.round((completedDays.filter(day => day.completed).length / plan.workOut.length) * 100)}%
                        </div>
                        <div className="text-gray-400 text-sm">Progress</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Workout Days Grid */}
            <div className="max-w-7xl mx-auto">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {plan.workOut.map((day, dayIndex) => {
                  const dayName = getDayName(day);
                  const nurtationProgressDay = day.nurtationProgress?.[0] || {};
                  const isDayCompleted = completedDays?.[dayIndex]?.completed;
                  
                  return (
                    <div
                      key={dayIndex}
                      className={`workout-day ${isDayCompleted ? 'completed' : ''} bg-gray-800/90 backdrop-blur-lg border rounded-2xl p-6 shadow-2xl transition-all duration-300 hover:shadow-3xl ${
                        isDayCompleted
                          ? 'border-green-500/50 shadow-green-500/20'
                          : 'border-gray-700/50 hover:border-orange-500/30'
                      }`}
                    >
                      {/* Day Header */}
                      <div className="flex justify-between items-center mb-6">
                        <div>
                          <h2 className="text-2xl font-bold text-white mb-1">
                            {day[dayName]}
                          </h2>
                          <div className="flex items-center space-x-2">
                            <div className={`w-3 h-3 rounded-full ${isDayCompleted ? 'bg-green-400' : 'bg-gray-500'}`}></div>
                            <span className={`text-sm font-medium ${isDayCompleted ? 'text-green-400' : 'text-gray-400'}`}>
                              {isDayCompleted ? 'Completed' : 'In Progress'}
                            </span>
                          </div>
                        </div>
                        <button
                          onClick={() => toggleDay(dayIndex)}
                          className={`px-6 py-3 rounded-xl text-sm font-semibold transition-all duration-300 transform hover:scale-105 ${
                            isDayCompleted
                              ? 'bg-green-500/20 text-green-300 border border-green-500/30 hover:bg-green-500/30'
                              : 'bg-orange-500/20 text-orange-300 border border-orange-500/30 hover:bg-orange-500/30'
                          }`}
                        >
                          {isDayCompleted ? '✓ Day Complete' : 'Complete Day'}
                        </button>
                      </div>

                      {/* Exercises Section */}
                      <div className="space-y-4 mb-8">
                        <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                          <span className="w-6 h-6 bg-gradient-to-r from-red-500 to-orange-500 rounded-lg flex items-center justify-center mr-3 text-white text-sm">💪</span>
                          Exercises
                        </h3>
                        {day.exercices.map((exercise, exerciseIndex) => {
                          const isExerciseCompleted = completedExercises?.[dayIndex]?.[exerciseIndex]?.completed;
                          return (
                            <div
                              key={exerciseIndex}
                              className={`exercise-item ${isExerciseCompleted ? 'completed' : ''} p-4 rounded-xl border transition-all duration-300 ${
                                isExerciseCompleted
                                  ? 'border-green-400/40 bg-green-500/10'
                                  : 'border-gray-600/50 bg-gray-700/30 hover:bg-gray-700/50'
                              }`}
                            >
                              <div className="flex items-start justify-between">
                                <div className="flex-1">
                                  <h4 className="text-white font-semibold mb-2">
                                    {exercise.exerciceName}
                                  </h4>
                                  <div className="grid grid-cols-2 gap-4 text-sm">
                                    <div className="bg-gray-600/30 rounded-lg p-2">
                                      <span className="text-gray-400">Sets:</span>
                                      <span className="text-white font-medium ml-1">{exercise.sets}</span>
                                    </div>
                                    <div className="bg-gray-600/30 rounded-lg p-2">
                                      <span className="text-gray-400">Rest:</span>
                                      <span className="text-white font-medium ml-1">{exercise.reset.betweenSetes}</span>
                                    </div>
                                  </div>
                                </div>
                                <button
                                  onClick={() => toggleExercise(dayIndex, exerciseIndex)}
                                  className={`ml-4 p-3 rounded-full transition-all duration-300 transform hover:scale-110 ${
                                    isExerciseCompleted
                                      ? 'bg-green-500/20 text-green-400 hover:bg-green-500/30'
                                      : 'bg-gray-600/50 text-gray-400 hover:bg-gray-500/50'
                                  }`}
                                >
                                  {isExerciseCompleted ? '✓' : '○'}
                                </button>
                              </div>
                            </div>
                          );
                        })}
                      </div>

                      {/* Nutrition Section */}
                      <div className="nutrition-section space-y-6">
                        <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                          <span className="w-6 h-6 bg-gradient-to-r from-green-500 to-blue-500 rounded-lg flex items-center justify-center mr-3 text-white text-sm">🥗</span>
                          Nutrition Goals
                        </h3>
                        
                        {/* Nutrition Stats */}
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                          {Object.entries(day.nurtationNeeds?.[0] || {}).map(([key, value]) => {
                            if(key !== "_id" ){
                              const progress = +nurtationProgressDay[key] || 0;
                              const percentage = Math.min((progress / value) * 100, 100);
                              return (
                                <div key={key} className="nutrition-progress bg-gray-700/60 rounded-xl p-3 text-center">
                                  <p className="text-xs text-gray-400 capitalize mb-1">{key}</p>
                                  <p className="font-bold text-white text-sm mb-1">
                                    {progress}/{value}
                                    {key === 'calories' ? '' : 'g'}
                                  </p>
                                  <div className="w-full bg-gray-600 rounded-full h-1.5">
                                    <div 
                                      className={`h-1.5 rounded-full transition-all duration-300 ${
                                        percentage >= 100 ? 'bg-green-500' : 'bg-orange-500'
                                      }`}
                                      style={{ width: `${percentage}%` }}
                                    ></div>
                                  </div>
                                </div>
                              );
                            }
                          })}
                        </div>

                        {/* Food Tracking */}
                        <div className="space-y-4">
                          <h4 className="text-white font-semibold mb-3">Food Intake</h4>
                          <div className="flex flex-col sm:flex-row gap-3">
                            <input
                              type="text"
                              value={currentFoodInputs?.[dayIndex] || ''}
                              onChange={(e) => {
                                const newInputs = [...currentFoodInputs];
                                newInputs[dayIndex] = e.target.value;
                                setCurrentFoodInputs(newInputs);
                              }}
                              placeholder="What did you eat today?"
                              className="flex-1 px-4 py-3 bg-gray-700/50 border border-gray-600/50 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-orange-500/50 focus:ring-2 focus:ring-orange-500/20 transition-all duration-300"
                            />
                            <button
                              onClick={() => addFoodEntry(dayIndex)}
                              className="bg-gradient-to-r from-red-500 to-orange-500 text-white font-semibold px-6 py-3 rounded-xl hover:from-red-600 hover:to-orange-600 transition-all duration-300 transform hover:scale-105 shadow-lg"
                            >
                              Add
                            </button>
                          </div>
                          
                          {/* Food Entries List */}
                          <div className="space-y-2 max-h-32 overflow-y-auto">
                            {foodEntries?.[dayIndex]?.map((entry, entryIndex) => (
                              <div key={entry.id} className="flex items-center gap-3 p-2 rounded-lg bg-gray-700/30">
                                <button
                                  onClick={() => toggleFoodEntry(dayIndex, entryIndex)}
                                  className={`p-1.5 rounded-full transition-all duration-300 ${
                                    entry.logged 
                                      ? 'bg-green-500/20 text-green-400' 
                                      : 'bg-gray-600/50 text-gray-400 hover:bg-gray-500/50'
                                  }`}
                                >
                                  {entry.logged ? '✓' : '○'}
                                </button>
                                <span
                                  className={`flex-1 text-sm transition-all duration-300 ${
                                    entry.logged
                                      ? 'line-through text-gray-500'
                                      : 'text-white'
                                  }`}
                                >
                                  {entry.description}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="max-w-7xl mx-auto mt-12 text-center">
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <button
                  disabled={!allDaysCompleted}
                  className={`px-8 py-4 rounded-xl font-semibold text-white transition-all duration-300 transform hover:scale-105 ${
                    allDaysCompleted
                      ? 'bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 shadow-lg shadow-green-500/25'
                      : 'bg-gray-600 cursor-not-allowed opacity-50'
                  }`}
                  onClick={() => {archivePlan(user)}}
                >
                  {allDaysCompleted ? '🎉 Complete the Week' : 'Complete All Days First'}
                </button>
                
                <button
                  onClick={createTrainingPlan}
                  className="px-8 py-4 rounded-xl font-semibold text-white bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg shadow-blue-500/25"
                >
                  🚀 Create New Plan
                </button>
                
                <button
                  onClick={save}
                  className={`px-8 py-4 rounded-xl font-semibold text-white transition-all duration-300 transform hover:scale-105 ${
                    loadingPlan 
                      ? 'bg-gray-600 cursor-not-allowed' 
                      : saved 
                        ? 'bg-green-500 shadow-lg shadow-green-500/25' 
                        : 'bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 shadow-lg shadow-orange-500/25'
                  }`}
                >
                  {loadingPlan ? '⏳ Saving...' : saved ? '✓ Saved!' : '💾 Save Progress'}
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="max-w-4xl mx-auto text-center pt-20">
            <div className="bg-gray-800/50 backdrop-blur-lg border border-gray-700/50 rounded-2xl p-12 shadow-2xl">
              <div className="w-24 h-24 bg-gradient-to-r from-red-500 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-white text-3xl">💪</span>
              </div>
              <h2 className="text-3xl font-bold text-white mb-4">No Training Plan Found</h2>
              <p className="text-gray-300 text-lg mb-8 max-w-md mx-auto">
                Start your fitness journey by creating a personalized training plan tailored to your goals.
              </p>
              <button
                onClick={createTrainingPlan}
                className="bg-gradient-to-r from-red-500 to-orange-500 text-white font-semibold px-8 py-4 rounded-xl hover:from-red-600 hover:to-orange-600 transition-all duration-300 transform hover:scale-105 shadow-lg"
              >
                🚀 Create Your First Plan
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default PlanPage;
