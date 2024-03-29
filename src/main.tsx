import React from "react";
import ReactDOM from "react-dom/client";
import { App } from "./App";
import store from "./store/index.ts";
import { Provider } from "react-redux";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Provider store={store}>
      <App title="App" />
    </Provider>
  </React.StrictMode>
);
