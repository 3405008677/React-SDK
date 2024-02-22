import { configureStore } from "@reduxjs/toolkit";
import counterReducer from "./features/counterSlice.ts";

export default configureStore({
  reducer: {
    counter: counterReducer,
  },
});
