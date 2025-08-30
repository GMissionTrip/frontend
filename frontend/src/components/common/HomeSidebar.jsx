import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./HomeSidebar.css";
import { FaTimes, FaSearch, FaHome, FaArchive } from "react-icons/fa";
import { IoPersonSharp } from "react-icons/io5";

export const HomeSidebar = ({ onClose, isLoggedIn = false }) => {
  const [isClosing, setIsClosing] = useState(false);
  const navigate = useNavigate();

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
        <button onClick={() => handleNavigate("/main")}>
          <FaHome style={{ marginRight: 8 }} />홈
        </button>

        <button onClick={() => handleNavigate(isLoggedIn ? "/my-trip" : "/login")}>
          <FaSearch style={{ marginRight: 8 }} />
          전체 아카이브 둘러보기
        </button>

        <button onClick={() => handleNavigate("/my-archive")}>
          <FaArchive style={{ marginRight: 8 }} />내 아카이브
        </button>

        <button onClick={() => handleNavigate("/places")}>
          <IoPersonSharp style={{ marginRight: 8 }} /> 마이페이지
        </button>
      </nav>
    </div>
  );
};
