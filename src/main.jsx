import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import store from "./store/index";
import { AuthProvider } from "./context/AuthContext";
import { Toaster } from "sonner";

import Success_Ic from "./assets/icons/Toast/success_icon.png";
import Error_Ic from "./assets/icons/Toast/error_icon.png";

import App from "./App.jsx";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <AuthProvider>
      <App />
      <Toaster
        toastOptions={{
          className: "my-toast",
        }}
        offset="22px"
        // richColors={true}
        icons={{
          success: <img src={Success_Ic} alt="success" />,
          // info: <InfoIcon />,
          // warning: <WarningIcon />,
          error: <img src={Error_Ic} alt="error" />,
          // loading: <LoadingIcon />,
        }}
      />
    </AuthProvider>
  </Provider>
);
