import { createSlice } from "@reduxjs/toolkit";

const chatBotReducer = createSlice({
  name: "chatBotReducer",
  initialState: {
    loadingAI: false,
    response: "",
    oldMessages: [
      {
        id: 1,
        type: 'ai',
        content:
          "Hello! I'm your AI fitness coach. I'm here to help you with workout plans, nutrition advice, and fitness guidance. What would you like to know today?",
        timestamp: new Date().toLocaleTimeString(),
      },
    ],
    chatError: "",
  },
  reducers: {
    setLoadingAI: (state, action) => {
      state.loadingAI = action.payload.loading;
    },
    setMessage: (state, action) => {
      state.response = action.payload.message;
    },
    setOldMessages: (state, action) => {
      state.oldMessages = [...action.payload.messages];
    },
    chatError: (state, action) => {
      state.chatError = action.payload.chatError;
    },
  },
});

export const {
  setLoadingAI,
  setMessage,
  setOldMessages,
  chatError,
} = chatBotReducer.actions;

export const selectChatBot = (state) => state.chatBotReducer;

export default chatBotReducer.reducer;
