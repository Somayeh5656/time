// src/components/LogoutButton.jsx
import { useNavigate } from "react-router-dom";

const LogOut = ({ className = "btn logout", children = "Log Out" }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/signIn");
  };

  return (
    <span onClick={handleLogout} className={className}>
      {children}
    </span>
  );
};

export default LogOut;
