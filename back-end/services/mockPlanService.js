function generateMockPlan(userInfo) {
  return `Mock Plan: 3x Full Body, 2x Cardio, 2x Rest for ${userInfo.name || 'user'}`;
}
module.exports = { generateMockPlan }; 