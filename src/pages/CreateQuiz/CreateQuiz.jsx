import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios"; // Sử dụng instance đã cấu hình Bearer Token

const CreateQuiz = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
  });

  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState(null);

  // Xử lý thay đổi input
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Gửi yêu cầu tạo mới (POST)
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setIsCreating(true);
      setError(null);

      const response = await api.post("/quizzes", {
        title: formData.title,
        description: formData.description,
      });

      console.log("Tạo thành công:", response.data);
      alert("Tạo Quiz mới thành công!");

      // Sau khi tạo xong, chuyển về trang danh sách
      navigate("/home");
    } catch (err) {
      console.error("Lỗi tạo quiz:", err);
      setError(err.response?.data?.message || "Có lỗi xảy ra khi tạo Quiz.");
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="container mx-auto p-6 max-w-2xl">
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold text-gray-800">Tạo Quiz Mới</h1>
          <button
            onClick={() => navigate(-1)}
            className="text-sm text-gray-400 hover:text-gray-600"
          >
            Hủy bỏ
          </button>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Input Tiêu đề */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Tiêu đề Quiz <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="title"
              required
              value={formData.title}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
              placeholder="Ví dụ: Kiểm tra kiến thức lịch sử"
            />
          </div>

          {/* Input Mô tả */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Mô tả chi tiết
            </label>
            <textarea
              name="description"
              rows="4"
              value={formData.description}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
              placeholder="Nhập vài dòng giới thiệu về bộ câu hỏi này..."
            ></textarea>
          </div>

          {/* Nút hành động */}
          <div className="flex gap-4 pt-4">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="flex-1 py-3 px-4 border border-gray-200 text-gray-600 rounded-xl font-medium hover:bg-gray-50 transition-colors"
            >
              Quay lại
            </button>
            <button
              type="submit"
              disabled={isCreating}
              className={`flex-1 py-3 px-4 rounded-xl font-bold text-white shadow-md transition-all ${
                isCreating
                  ? "bg-blue-300 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700 active:scale-95"
              }`}
            >
              {isCreating ? "Đang xử lý..." : "Tạo Quiz ngay"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateQuiz;
