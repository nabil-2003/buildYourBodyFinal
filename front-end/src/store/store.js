import {configureStore} from '@reduxjs/toolkit';
import rootReducer from "../reducers/reducer";  // Combine all reducers here
  // أو حسب مسار ملفك

const store = configureStore({
  reducer: rootReducer, // Use the combined reducers
});

export default store;