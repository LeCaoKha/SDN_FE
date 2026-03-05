import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

const Register = () => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    admin: false, // Mặc định là người dùng thường
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const baseURL = import.meta.env.VITE_API_URL;

  // Xử lý thay đổi input text/password
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Xử lý thay đổi checkbox cho quyền Admin
  const handleCheckboxChange = (e) => {
    setFormData({
      ...formData,
      admin: e.target.checked,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const response = await axios.post(`${baseURL}/auth/register`, {
        username: formData.username,
        password: formData.password,
        admin: formData.admin,
      });

      setSuccess("Đăng ký tài khoản thành công! Đang chuyển hướng...");

      // Chuyển hướng về trang đăng nhập sau 2 giây
      setTimeout(() => {
        navigate("/");
      }, 2000);
    } catch (err) {
      const errorMsg =
        err.response?.data?.message || "Đăng ký thất bại. Vui lòng thử lại!";
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-800">Tạo Tài Khoản</h2>
          <p className="text-gray-500 mt-2 text-sm">
            Tham gia hệ thống QuizMaster ngay hôm nay
          </p>
        </div>

        {/* Thông báo lỗi */}
        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 text-red-700 px-4 py-3 rounded mb-4 text-sm animate-pulse">
            {error}
          </div>
        )}

        {/* Thông báo thành công */}
        {success && (
          <div className="bg-green-50 border-l-4 border-green-500 text-green-700 px-4 py-3 rounded mb-4 text-sm">
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Username */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Tên đăng nhập
            </label>
            <input
              type="text"
              name="username"
              required
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
              placeholder="Nhập username mong muốn"
              value={formData.username}
              onChange={handleChange}
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Mật khẩu
            </label>
            <input
              type="password"
              name="password"
              required
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
              placeholder="••••••••"
              value={formData.password}
              onChange={handleChange}
            />
          </div>

          {/* Quyền Admin (Checkbox) */}
          <div className="flex items-center p-3 bg-gray-50 rounded-xl border border-gray-100 transition-colors hover:bg-gray-100">
            <input
              id="admin-checkbox"
              type="checkbox"
              className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500 cursor-pointer"
              checked={formData.admin}
              onChange={handleCheckboxChange}
            />
            <label
              htmlFor="admin-checkbox"
              className="ml-3 text-sm font-medium text-gray-700 cursor-pointer select-none"
            >
              Đăng ký với quyền{" "}
              <span className="text-blue-600 font-bold">
                Quản trị viên (Admin)
              </span>
            </label>
          </div>

          {/* Nút đăng ký */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 px-4 rounded-xl text-white font-bold text-lg shadow-md transition-all ${
              loading
                ? "bg-blue-300 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700 active:scale-95"
            }`}
          >
            {loading ? "Đang xử lý..." : "Đăng Ký Ngay"}
          </button>
        </form>

        <div className="mt-8 text-center border-t border-gray-100 pt-6">
          <p className="text-sm text-gray-600">
            Bạn đã có tài khoản rồi?{" "}
            <Link
              to="/"
              className="font-bold text-blue-600 hover:text-blue-500 transition-colors"
            >
              Đăng nhập tại đây
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
