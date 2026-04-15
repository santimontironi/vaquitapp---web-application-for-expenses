import Loader from "../ui/Loader";
import useAuth from "../../hooks/useAuth";
import { useNavigate } from "react-router-dom";

const VerifyAuth = ({ children }: { children: React.ReactNode }) => {
  const { user, loadingAuth} = useAuth();

  const navigate = useNavigate();

  if (loadingAuth.dashboardLoading) {
    return <Loader />;
  }

  if (!user) {
    navigate("/");
    return null;
  }

  return children;
};

export default VerifyAuth;
