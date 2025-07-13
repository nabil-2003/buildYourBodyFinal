import { combineReducers } from 'redux';
import userReducer from './userReducer';
import PlanReducer from './PlanReducer'; // Assuming Plan is a slice created with createSlice
import chatBotReducer from './chatBotReducer'; // Importing chatBotReducer
const rootReducer = combineReducers({
  userReducer : userReducer , 
  planReducer: PlanReducer, // Assuming Plan is a slice created with createSlice
  chatBotReducer: chatBotReducer// Importing chatBotReducer

})
export default rootReducer;