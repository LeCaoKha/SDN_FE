import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../api/axios";

const QuizDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [quiz, setQuiz] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // --- STATE CHO MODAL EDIT ---
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState(null);
  const [editFormData, setEditFormData] = useState({
    text: "",
    options: ["", "", "", ""],
    keywords: "",
    correctAnswerIndex: 0,
  });

  useEffect(() => {
    fetchQuizDetails();
  }, [id]);

  const fetchQuizDetails = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/quizzes/${id}`);
      setQuiz(response.data);
    } catch (err) {
      setError("Không thể tải thông tin câu đố.");
    } finally {
      setLoading(false);
    }
  };

  // --- XỬ LÝ XÓA QUESTION ---
  const handleDeleteQuestion = async (qId) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa câu hỏi này không?")) {
      try {
        await api.delete(`/questions/${qId}`);
        // Cập nhật UI cục bộ
        setQuiz({
          ...quiz,
          questions: quiz.questions.filter((q) => q._id !== qId),
        });
        alert("Xóa câu hỏi thành công!");
      } catch (err) {
        alert("Lỗi khi xóa câu hỏi.");
      }
    }
  };

  // --- MỞ MODAL VÀ ĐỔ DỮ LIỆU ---
  const handleEditClick = (question) => {
    setEditingQuestion(question);
    setEditFormData({
      text: question.text,
      options: [...question.options],
      keywords: question.keywords ? question.keywords.join(", ") : "",
      correctAnswerIndex: question.correctAnswerIndex,
    });
    setIsModalOpen(true);
  };

  // --- CẬP NHẬT QUESTION (PUT) ---
  const handleUpdateQuestion = async (e) => {
    e.preventDefault();
    try {
      const formattedData = {
        ...editFormData,
        keywords: editFormData.keywords
          .split(",")
          .map((k) => k.trim())
          .filter((k) => k !== ""),
      };

      await api.put(`/questions/${editingQuestion._id}`, formattedData);

      alert("Cập nhật câu hỏi thành công!");
      setIsModalOpen(false);
      fetchQuizDetails(); // Tải lại dữ liệu mới nhất
    } catch (err) {
      alert("Lỗi khi cập nhật câu hỏi.");
    }
  };

  if (loading)
    return (
      <div className="p-10 text-center font-medium">Đang tải chi tiết...</div>
    );
  if (error)
    return (
      <div className="p-10 text-center text-red-500 font-medium">{error}</div>
    );
  if (!quiz)
    return <div className="p-10 text-center">Không tìm thấy dữ liệu.</div>;

  return (
    <div className="container mx-auto p-6 max-w-4xl relative">
      <button
        onClick={() => navigate("/admin/home")}
        className="mb-6 text-gray-500 hover:text-blue-600 flex items-center gap-2 transition-colors"
      >
        ← Quay lại trang chủ
      </button>

      {/* Header Quiz */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 mb-8 flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            {quiz.title}
          </h1>
          <p className="text-gray-600 text-lg">{quiz.description}</p>
          <div className="mt-4 flex gap-4">
            <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-semibold">
              {quiz.questions?.length || 0} câu hỏi
            </span>
          </div>
        </div>

        <button
          onClick={() => navigate(`/admin/questions/create/${id}`)}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl font-bold shadow-md transition-all active:scale-95 flex items-center gap-2"
        >
          + Thêm câu hỏi
        </button>
      </div>

      {/* Danh sách câu hỏi */}
      <div className="space-y-6 mb-10">
        <h2 className="text-xl font-bold text-gray-700 ml-2 border-l-4 border-indigo-500 pl-3">
          Nội dung câu hỏi
        </h2>
        {quiz.questions && quiz.questions.length > 0 ? (
          quiz.questions.map((question, qIndex) => (
            <div
              key={question._id}
              className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 group"
            >
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-lg font-semibold text-gray-800">
                  Câu {qIndex + 1}: {question.text}
                </h3>
                {/* NÚT SỬA XÓA */}
                <div className="flex gap-2 opacity-100 transition-opacity">
                  <button
                    onClick={() => handleEditClick(question)}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                    title="Sửa"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                      />
                    </svg>
                  </button>
                  <button
                    onClick={() => handleDeleteQuestion(question._id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                    title="Xóa"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {question.options.map((option, oIndex) => (
                  <div
                    key={oIndex}
                    className={`p-3 rounded-lg border ${oIndex === question.correctAnswerIndex ? "bg-green-50 border-green-200 text-green-700 font-medium" : "bg-gray-50 border-gray-100 text-gray-500"}`}
                  >
                    <span className="mr-2 font-bold">
                      {String.fromCharCode(65 + oIndex)}.
                    </span>
                    {option}
                  </div>
                ))}
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-20 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200 text-gray-400 font-medium">
            Trống. Nhấn "Thêm câu hỏi" để bắt đầu!
          </div>
        )}
      </div>

      {/* MODAL EDIT QUESTION */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-8 shadow-2xl">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">
              Chỉnh sửa câu hỏi
            </h2>
            <form onSubmit={handleUpdateQuestion} className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">
                  Nội dung câu hỏi
                </label>
                <input
                  type="text"
                  required
                  className="w-full border rounded-xl p-3 outline-none focus:ring-2 focus:ring-indigo-500"
                  value={editFormData.text}
                  onChange={(e) =>
                    setEditFormData({ ...editFormData, text: e.target.value })
                  }
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {editFormData.options.map((opt, idx) => (
                  <div key={idx} className="flex flex-col gap-1">
                    <label className="text-xs font-bold text-gray-400">
                      Đáp án {String.fromCharCode(65 + idx)}
                    </label>
                    <input
                      type="text"
                      required
                      className="border rounded-lg p-2 text-sm"
                      value={opt}
                      onChange={(e) => {
                        const newOpts = [...editFormData.options];
                        newOpts[idx] = e.target.value;
                        setEditFormData({ ...editFormData, options: newOpts });
                      }}
                    />
                  </div>
                ))}
              </div>

              <div className="flex gap-10">
                <div className="flex-1">
                  <label className="block text-sm font-bold text-gray-700 mb-1">
                    Đáp án đúng (A-D)
                  </label>
                  <select
                    className="w-full border rounded-lg p-2"
                    value={editFormData.correctAnswerIndex}
                    onChange={(e) =>
                      setEditFormData({
                        ...editFormData,
                        correctAnswerIndex: parseInt(e.target.value),
                      })
                    }
                  >
                    {editFormData.options.map((_, idx) => (
                      <option key={idx} value={idx}>
                        Đáp án {String.fromCharCode(65 + idx)}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-bold text-gray-700 mb-1">
                    Keywords (cách nhau bằng dấu phẩy)
                  </label>
                  <input
                    type="text"
                    className="w-full border rounded-lg p-2"
                    value={editFormData.keywords}
                    onChange={(e) =>
                      setEditFormData({
                        ...editFormData,
                        keywords: e.target.value,
                      })
                    }
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-8">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-6 py-2 rounded-xl text-gray-500 hover:bg-gray-100 font-medium"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 shadow-lg"
                >
                  Lưu thay đổi
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuizDetails;
