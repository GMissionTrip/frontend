import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Sidebar.css";
import { FaSignInAlt, FaSuitcaseRolling, FaMapMarkedAlt, FaTimes, FaUser } from "react-icons/fa";
import useUser from "@/hooks/useUser.mjs";

export const Sidebar = ({ onClose, isLoggedIn = false }) => {
  const navigate = useNavigate();
  const user = useUser();

  const [isClosing, setIsClosing] = useState(false);
  const handleNavigate = (path) => {
    navigate(path);
    onClose();
  };

  const handleClose = () => {
    setIsClosing(true);
  };

  useEffect(() => {
    if (isClosing) {
      const timeout = setTimeout(() => {
        onClose();
      }, 400);
      return () => clearTimeout(timeout);
    }
  }, [isClosing, onClose]);

  return (
    <div className={`sidebar ${isClosing ? "slide-out" : "slide-in"}`}>
      <button className="close-btn" onClick={handleClose}>
        <FaTimes />
      </button>
      <nav className="menu">
        {user ? (
          <>
            <button onClick={() => handleNavigate("/my-page")}>
              <FaUser style={{ marginRight: 8 }} />
              마이페이지
            </button>
            <button onClick={() => handleNavigate(isLoggedIn ? "/my-trip" : "/login")}>
              <FaSuitcaseRolling style={{ marginRight: 8 }} />내 여행
            </button>
            <button onClick={() => handleNavigate("/places")}>
              <FaMapMarkedAlt style={{ marginRight: 8 }} />
              관광지 둘러보기
            </button>
          </>
        ) : (
          <button onClick={() => handleNavigate("/login")}>
            <FaSignInAlt style={{ marginRight: 8 }} />
            로그인/회원가입
          </button>
        )}
      </nav>
    </div>
  );
};
