import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";

const Home = () => {
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // 1. Lấy thông tin user để kiểm tra quyền admin
  const user = JSON.parse(localStorage.getItem("user"));
  const isAdmin = user?.admin === true;

  useEffect(() => {
    fetchQuizzes();
  }, []);

  const fetchQuizzes = async () => {
    try {
      setLoading(true);
      const response = await api.get("/quizzes");
      setQuizzes(response.data);
    } catch (err) {
      console.error("Lỗi khi lấy dữ liệu:", err);
      setError("Không thể tải danh sách câu đố.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id, title) => {
    const confirmDelete = window.confirm(
      `Bạn có chắc chắn muốn xóa Quiz: "${title}" không?`,
    );
    if (confirmDelete) {
      try {
        await api.delete(`/quizzes/${id}`);
        setQuizzes(quizzes.filter((quiz) => quiz._id !== id));
        alert("Xóa thành công!");
      } catch (err) {
        alert("Xóa thất bại!");
      }
    }
  };

  // 2. Hàm xử lý khi nhấn vào tiêu đề Quiz
  const handleQuizClick = (quizId) => {
    if (isAdmin) {
      navigate(`/admin/quizzes/details/${quizId}`);
    } else {
      navigate(`/home/quiz/submit/${quizId}`);
    }
  };

  if (loading)
    return (
      <div className="p-8 text-center text-gray-500">Đang tải dữ liệu...</div>
    );
  if (error) return <div className="p-8 text-center text-red-500">{error}</div>;

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">
          {isAdmin ? "Quản lý Quiz" : "Danh sách Quiz bài tập"}
        </h1>

        {/* 3. Chỉ hiện nút Tạo mới nếu là Admin */}
        {isAdmin && (
          <button
            onClick={() => navigate("/admin/quizzes/create")}
            className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg shadow-sm transition-all active:scale-95"
          >
            + Tạo Quiz mới
          </button>
        )}
      </div>

      <div className="overflow-x-auto bg-white rounded-xl shadow-sm border border-gray-100">
        <table className="min-w-full table-auto">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-4 text-left text-xs uppercase font-bold text-gray-600 w-16">
                STT
              </th>
              <th className="px-6 py-4 text-left text-xs uppercase font-bold text-gray-600">
                Tiêu đề
              </th>
              <th className="px-6 py-4 text-left text-xs uppercase font-bold text-gray-600">
                Mô tả
              </th>
              <th className="px-6 py-4 text-center text-xs uppercase font-bold text-gray-600">
                Số câu
              </th>

              {/* 4. Chỉ hiện cột Hành động nếu là Admin */}
              {isAdmin && (
                <th className="px-6 py-4 text-center text-xs uppercase font-bold text-gray-600">
                  Hành động
                </th>
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {quizzes.map((quiz, index) => (
              <tr
                key={quiz._id}
                className="hover:bg-blue-50/30 transition-colors"
              >
                <td className="px-6 py-4 text-sm text-gray-500">{index + 1}</td>
                <td
                  className="px-6 py-4 text-sm font-semibold text-blue-600 cursor-pointer hover:underline max-w-xs truncate"
                  onClick={() => handleQuizClick(quiz._id)}
                >
                  {quiz.title}
                </td>
                <td className="px-6 py-4 text-sm text-gray-600 italic">
                  {quiz.description || "Chưa có mô tả"}
                </td>
                <td className="px-6 py-4 text-sm text-center">
                  <span className="bg-indigo-100 text-indigo-700 text-xs font-bold px-2.5 py-1 rounded-md">
                    {quiz.questions?.length || 0}
                  </span>
                </td>

                {/* 5. Render nút Sửa/Xóa dựa trên quyền Admin */}
                {isAdmin && (
                  <td className="px-6 py-4 text-sm text-center">
                    <button
                      onClick={() =>
                        navigate(`/admin/quizzes/edit/${quiz._id}`)
                      }
                      className="text-blue-600 hover:text-blue-800 mr-4 font-medium"
                    >
                      Sửa
                    </button>
                    <button
                      onClick={() => handleDelete(quiz._id, quiz.title)}
                      className="text-red-500 hover:text-red-700 font-medium"
                    >
                      Xóa
                    </button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>

        {quizzes.length === 0 && (
          <div className="p-12 text-center text-gray-400">Danh sách trống.</div>
        )}
      </div>
    </div>
  );
};

export default Home;
