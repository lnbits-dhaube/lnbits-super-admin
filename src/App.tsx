import { ChakraProvider, Box } from "@chakra-ui/react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import UserDetails from "./pages/UserDetails";
import AddUser from "./pages/AddUser";
import EditUser from "./pages/EditUser";
import ChangePin from "./pages/ChangePin";
import ChangePassword from "./pages/ChangePassword";
import UserTransactions from "./pages/UserTransactions";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <ChakraProvider>
      <Box width="100vw" height="100vh">
        <Router>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/users/:id"
              element={
                <ProtectedRoute>
                  <UserDetails />
                </ProtectedRoute>
              }
            />
            <Route
              path="/users/:id/edit"
              element={
                <ProtectedRoute>
                  <EditUser />
                </ProtectedRoute>
              }
            />
            <Route
              path="/users/:id/pin"
              element={
                <ProtectedRoute>
                  <ChangePin />
                </ProtectedRoute>
              }
            />
            <Route
              path="/users/:id/password"
              element={
                <ProtectedRoute>
                  <ChangePassword />
                </ProtectedRoute>
              }
            />
            <Route
              path="/users/:id/transactions"
              element={
                <ProtectedRoute>
                  <UserTransactions />
                </ProtectedRoute>
              }
            />
            <Route
              path="/users/add"
              element={
                <ProtectedRoute>
                  <AddUser />
                </ProtectedRoute>
              }
            />
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </Router>
      </Box>
    </ChakraProvider>
  );
}

export default App;
