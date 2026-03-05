import React from "react";
import { useNavigate, Link } from "react-router-dom";

const Header = () => {
  const navigate = useNavigate();

  // Lấy thông tin user từ localStorage để hiển thị tên
  const user = JSON.parse(localStorage.getItem("user"));

  const handleLogout = () => {
    // 1. Xóa token và thông tin user
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    // 2. Chuyển hướng về trang Login (đường dẫn "/" theo router của bạn)
    navigate("/");
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-100 sticky top-0 z-50">
      <div className="container mx-auto px-6 py-4 flex justify-between items-center">
        {/* Logo / Brand */}
        <Link to="/home" className="flex items-center gap-2 group">
          <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-xl group-hover:bg-blue-700 transition-colors">
            Q
          </div>
          <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            QuizMaster
          </span>
        </Link>

        {/* User Info & Logout */}
        <div className="flex items-center gap-6">
          {user && (
            <div className="hidden md:flex flex-col items-end">
              <span className="text-sm font-semibold text-gray-800">
                {user.username}
              </span>
              <span className="text-xs text-green-500 font-medium">
                {user.admin ? "Quản trị viên" : "Người dùng"}
              </span>
            </div>
          )}

          <div className="h-8 w-[1px] bg-gray-200 hidden md:block"></div>

          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-all active:scale-95"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="w-4 h-4"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9"
              />
            </svg>
            Đăng xuất
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
