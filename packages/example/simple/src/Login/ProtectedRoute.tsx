import { Navigate } from "react-router";
import { LayoutWithAppBar } from "../LayoutWithAppBar";
import { useAuthState } from "../useAuthState";

function ProtectedRoute() {
  const { authState } = useAuthState()
  const user = authState.state === 'success'
  return user ? <LayoutWithAppBar /> : <Navigate to="/login" />;
};

export default ProtectedRoute;