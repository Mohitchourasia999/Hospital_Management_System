import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

import DashboardLayout from "./layouts/DashboardLayout";

import Dashboard from "./pages/Dashboard";

import Appointments from "./pages/Appointments";

import Doctors from "./pages/Doctors";

import Patients from "./pages/Patients";

import Inventory from "./pages/Inventory";

import Messages from "./pages/Messages";

import Login from "./pages/Login";

import ProtectedRoute from "./components/ProtectedRoute";

import { ToastContainer } from "react-toastify";

import "react-toastify/dist/ReactToastify.css";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* LOGIN */}

        <Route
          path="/login"
          element={<Login />}
        />

        {/* PROTECTED ROUTES */}

        <Route
          path="/*"
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <Routes>
                  <Route
                    path="/"
                    element={
                      <Dashboard />
                    }
                  />

                  <Route
                    path="/appointments"
                    element={
                      <Appointments />
                    }
                  />

                  <Route
                    path="/doctors"
                    element={
                      <Doctors />
                    }
                  />

                  <Route
                    path="/patients"
                    element={
                      <Patients />
                    }
                  />

                  <Route
                    path="/inventory"
                    element={
                      <Inventory />
                    }
                  />

                  <Route
                    path="/messages"
                    element={
                      <Messages />
                    }
                  />
                </Routes>
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
      </Routes>

      <ToastContainer />
    </BrowserRouter>
  );
};

export default App;