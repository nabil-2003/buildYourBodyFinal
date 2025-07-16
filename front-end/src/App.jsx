import "./App.css"

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';
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
        <Route path="/calculator" element={
          <ProtectedRoute>
            <Calculator />
          </ProtectedRoute>
        } />
        <Route path="/chat" element={
          <ProtectedRoute>
            <Chat />
          </ProtectedRoute>
        } />
        <Route path="/videos" element={
          <ProtectedRoute>
            <TrainingVideos />
          </ProtectedRoute>
        } />
        <Route path="/myPlan" element={
          <ProtectedRoute>
            <PlanPage />
          </ProtectedRoute>
        } />
        <Route path="/plan-builder" element={
          <ProtectedRoute>
            <PlanBuilderPage />
          </ProtectedRoute>
        } />
        <Route path="/*" element={<PageNotFound />} />
      </Routes>
    </Router>
   </Provider>
  );
}

export default App;
