import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";
const ProtectedRoute = () => {
  const { user } = useSelector((store) => store.user);
  console.log(user);
  return user ? <Outlet /> : <Navigate to="/login" replace />;
};
export default ProtectedRoute;
