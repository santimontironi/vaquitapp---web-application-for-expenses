import Loader from "./Loader";
import useAuth from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";

const VerifyAuth = ({ children }: { children: React.ReactNode }) => {
  const { user, loadingAuth} = useAuth();

  const navigate = useNavigate();

  if (!user) {
    navigate("/");
  }

  if(loadingAuth.dashboardLoading){
    return <Loader />
  }

  return children;
};

export default VerifyAuth;
