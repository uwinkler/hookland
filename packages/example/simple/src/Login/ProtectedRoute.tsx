import { Navigate, Outlet } from "react-router";
import { useAuthState } from "../useAuthState";

function ProtectedRoute() {
  const { authState } = useAuthState()
  const user = authState.state === 'success'
  return user ? <Outlet /> : <Navigate to="/login" />;
};

export default ProtectedRoute;