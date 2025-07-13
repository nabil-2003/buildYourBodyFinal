import "./App.css"

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Provider } from "react-redux";
import AboutUs from './pages/AboutUs';
import Login from './pages/Login';
import Signup from './pages/Signup';
import PageNotFound from './pages/PageNotFound';
import Dashboard from './pages/Dashboard';
import Calculator from './pages/Calculator';
import Chat from './pages/Chat';
import TrainingVideos from './pages/TrainingVideos';
import store from "./store/store";
import PlanPage from "./pages/PlanPage";
import PlanBuilderPage from "./pages/PlanBuilderModal";

function App() {
  return (
   <Provider store={store}>
     <Router>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/about" element={<AboutUs />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/calculator" element={<Calculator />} />
        <Route path="/chat" element={<Chat />} />
        <Route path="/videos" element={<TrainingVideos />} />
        <Route path="/myPlan" element={<PlanPage />} />
        <Route path="/plan-builder" element={<PlanBuilderPage />} />
        <Route path="/*" element={<PageNotFound />} />
      </Routes>
    </Router>
   </Provider>
  );
}

export default App;
