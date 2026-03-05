import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../api/axios";

const CreateQues = () => {
  const { id } = useParams(); // quizId từ URL
  const navigate = useNavigate();

  const [questions, setQuestions] = useState([
    {
      text: "",
      options: ["", "", "", ""],
      keywords: "",
      correctAnswerIndex: 0,
    },
  ]);
  const [loading, setLoading] = useState(false);

  // Thêm một ô nhập câu hỏi mới
  const addMoreQuestionField = () => {
    setQuestions([
      ...questions,
      {
        text: "",
        options: ["", "", "", ""],
        keywords: "",
        correctAnswerIndex: 0,
      },
    ]);
  };

  const removeQuestionField = (index) => {
    if (questions.length > 1) {
      setQuestions(questions.filter((_, i) => i !== index));
    }
  };

  const handleInputChange = (index, field, value) => {
    const newQuestions = [...questions];
    newQuestions[index][field] = value;
    setQuestions(newQuestions);
  };

  const handleOptionChange = (qIndex, oIndex, value) => {
    const newQuestions = [...questions];
    newQuestions[qIndex].options[oIndex] = value;
    setQuestions(newQuestions);
  };

  // --- HÀM SUBMIT ĐÃ CẬP NHẬT AUTHOR ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // 1. Lấy userId từ localStorage
    const userStorage = localStorage.getItem("user");
    const user = userStorage ? JSON.parse(userStorage) : null;
    const userId = user?.id || user?._id; // Kiểm tra cả id và _id tùy theo backend trả về

    if (!userId) {
      alert("Không tìm thấy thông tin người dùng. Vui lòng đăng nhập lại.");
      setLoading(false);
      return;
    }

    // 2. Chuẩn hóa dữ liệu và thêm trường author
    const formattedData = questions.map((q) => ({
      ...q,
      author: userId, // <-- Thêm author vào đây
      keywords: q.keywords
        .split(",")
        .map((k) => k.trim())
        .filter((k) => k !== ""),
    }));

    try {
      // POST gửi đi một mảng các câu hỏi kèm author
      await api.post(`/quizzes/${id}/questions`, formattedData);
      alert("Thêm câu hỏi thành công!");
      navigate(`/admin/quizzes/details/${id}`);
    } catch (err) {
      console.error(err);
      alert("Có lỗi xảy ra khi lưu câu hỏi.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-gray-800">
          Thêm câu hỏi vào Quiz
        </h1>
        <button
          onClick={() => navigate(-1)}
          className="text-gray-500 hover:text-gray-700"
        >
          Hủy
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-10">
        {questions.map((q, qIndex) => (
          <div
            key={qIndex}
            className="bg-white p-8 rounded-2xl shadow-sm border border-gray-200 relative"
          >
            {questions.length > 1 && (
              <button
                type="button"
                onClick={() => removeQuestionField(qIndex)}
                className="absolute top-4 right-4 text-red-400 hover:text-red-600"
              >
                Xóa câu này
              </button>
            )}

            <div className="mb-6">
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Câu hỏi {qIndex + 1}
              </label>
              <input
                type="text"
                required
                className="w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-indigo-500"
                value={q.text}
                onChange={(e) =>
                  handleInputChange(qIndex, "text", e.target.value)
                }
                placeholder="Nhập nội dung câu hỏi..."
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              {q.options.map((opt, oIndex) => (
                <div key={oIndex} className="flex items-center gap-3">
                  <input
                    type="radio"
                    name={`correct-${qIndex}`}
                    checked={q.correctAnswerIndex === oIndex}
                    onChange={() =>
                      handleInputChange(qIndex, "correctAnswerIndex", oIndex)
                    }
                    className="w-4 h-4 text-indigo-600"
                  />
                  <input
                    type="text"
                    required
                    className="flex-1 px-4 py-2 border rounded-lg text-sm"
                    value={opt}
                    onChange={(e) =>
                      handleOptionChange(qIndex, oIndex, e.target.value)
                    }
                    placeholder={`Đáp án ${String.fromCharCode(65 + oIndex)}`}
                  />
                </div>
              ))}
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase mb-2">
                Keywords
              </label>
              <input
                type="text"
                className="w-full px-4 py-2 border rounded-lg text-sm bg-gray-50"
                value={q.keywords}
                onChange={(e) =>
                  handleInputChange(qIndex, "keywords", e.target.value)
                }
                placeholder="geography, history..."
              />
            </div>
          </div>
        ))}

        <div className="flex flex-col gap-4">
          <button
            type="button"
            onClick={addMoreQuestionField}
            className="w-full py-3 border-2 border-dashed border-gray-300 rounded-2xl text-gray-500 hover:border-indigo-400 transition-all font-medium"
          >
            + Thêm câu hỏi khác
          </button>
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-4 rounded-2xl text-white font-bold shadow-lg transition-all ${
              loading ? "bg-gray-400" : "bg-indigo-600 hover:bg-indigo-700"
            }`}
          >
            {loading
              ? "Đang lưu..."
              : `Lưu tất cả (${questions.length} câu hỏi)`}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateQues;
