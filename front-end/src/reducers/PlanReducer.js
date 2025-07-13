import { createSlice } from '@reduxjs/toolkit';

const Planreducer = createSlice({
  name: "planReducer",
  initialState: {
    loadingPlan: false,
    plan: null,
    AiErrorVal: null,
    nutrationNeeds: [] , 
    saved : false 
  },
  reducers: {
    setPlan: (state, action) => {
      state.plan = action.payload.plan;
      if(JSON.parse(JSON.stringify(state.plan)) !== null) 
        
      localStorage.setItem('plan', JSON.stringify(state.plan));
    },
    loadingPlan: (state, action) => {
      state.loadingPlan = action.payload.loading;
    },
    AiError: (state, action) => {
      state.AiErrorVal = action.payload.AiError || action.payload.error;
    },
    ProgressCheck: (state, action) => {
      if (state.plan) {
     
        const { id, data } = action.payload;
         let plan =  JSON.parse(JSON.stringify(state.plan))
        plan.workOut[id].nurtationProgress[0] = data.nutrationNeeds || plan.workOut[id].nurtationProgress || [];
        state.plan = plan;
         localStorage.setItem('plan', JSON.stringify(state.plan));

      }
    },
    isSaved: (state, action) => {
      state.saved = action.payload.saved;
    }
  },
    
});

export const { setPlan, loadingPlan, AiError, ProgressCheck  , isSaved} = Planreducer.actions;
export default Planreducer.reducer;
