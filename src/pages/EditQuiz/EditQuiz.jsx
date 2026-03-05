import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../api/axios";

const EditQuiz = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
  });

  const [loading, setLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCurrentQuiz = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/quizzes/${id}`);
        setFormData({
          title: response.data.title || "",
          description: response.data.description || "",
        });
      } catch (err) {
        setError("Không thể lấy thông tin Quiz để sửa.");
      } finally {
        setLoading(false);
      }
    };
    fetchCurrentQuiz();
  }, [id]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setIsUpdating(true);
      await api.put(`/quizzes/${id}`, {
        title: formData.title,
        description: formData.description,
      });

      alert("Cập nhật thành công!");
      navigate("/home");
    } catch (err) {
      alert(
        err.message === "Request failed with status code 403"
          ? "Bạn không có quyền thực hiện chức năng này"
          : "",
      );
    } finally {
      setIsUpdating(false);
    }
  };

  if (loading)
    return (
      <div className="p-10 text-center text-gray-500 font-medium">
        Đang tải dữ liệu...
      </div>
    );
  if (error)
    return (
      <div className="p-10 text-center text-red-500 font-medium">{error}</div>
    );

  return (
    <div className="container mx-auto p-6 max-w-2xl">
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold text-gray-800">Chỉnh sửa Quiz</h1>
          <button
            onClick={() => navigate(-1)}
            className="text-sm text-gray-400 hover:text-gray-600 transition-colors"
          >
            Hủy bỏ
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Input Tiêu đề */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Tiêu đề Quiz
            </label>
            <input
              type="text"
              name="title"
              required
              value={formData.title}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
              placeholder="Nhập tiêu đề mới..."
            />
          </div>

          {/* Input Mô tả */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Mô tả chi tiết
            </label>{" "}
            {/* <-- ĐÃ SỬA: Chỗ này trước đó bạn để là </h3> */}
            <textarea
              name="description"
              rows="4"
              value={formData.description}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
              placeholder="Nhập mô tả mới cho quiz..."
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
              disabled={isUpdating}
              className={`flex-1 py-3 px-4 rounded-xl font-bold text-white shadow-md transition-all ${
                isUpdating
                  ? "bg-blue-300 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700 active:scale-95"
              }`}
            >
              {isUpdating ? "Đang lưu..." : "Lưu thay đổi"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditQuiz;
