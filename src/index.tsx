import React from 'react';
import ReactDOM from 'react-dom/client';
import "bootstrap/dist/css/bootstrap.min.css";
import './index.css';
import App from './components/App';
import reportWebVitals from './reportWebVitals';
import {BrowserRouter, Route, Routes} from "react-router-dom";
import FAQ from "./components/FAQ";
import NoPage from "./components/NoPage";

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

const getApiUrl = () => {
    if (process.env.NODE_ENV === "development") {
        return "http://localhost:8888";
    }
    return `https://${window.location.host}/api`;
};

(global as any).apiUrl = getApiUrl();

root.render(
  <React.StrictMode>
      <BrowserRouter>
          <Routes>
              <Route path="/" element={<App />} />
                  <Route path="FAQ" element={<FAQ />} />
                  <Route path="*" element={<NoPage />} />
          </Routes>
      </BrowserRouter>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
