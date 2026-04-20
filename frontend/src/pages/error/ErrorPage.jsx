import { useNavigate, useLocation } from "react-router-dom";
import StatePlaceholder from "../../components/ui/StatePlaceholder";

const ErrorPage = ({ code: propCode }) => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Ambil code dari prop, atau dari state router, default ke 404
  const code = propCode || location.state?.code || "404";

  const handleAction = () => {
    if (code === "401") {
      navigate("/login");
    } else {
      navigate("/");
    }
  };

  return (
    <StatePlaceholder 
      code={code}
      onAction={handleAction}
    />
  );
};

export default ErrorPage;
