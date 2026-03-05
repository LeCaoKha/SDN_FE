import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../api/axios";

const SubmitQuiz = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [quiz, setQuiz] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // State lưu trữ câu trả lời của người dùng (key là index câu hỏi, value là index đáp án)
  const [userAnswers, setUserAnswers] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/quizzes/${id}`);
        setQuiz(response.data);
      } catch (err) {
        setError("Không thể tải nội dung bài kiểm tra.");
      } finally {
        setLoading(false);
      }
    };
    fetchQuiz();
  }, [id]);

  // Xử lý khi người dùng chọn một đáp án
  const handleOptionSelect = (questionIndex, optionIndex) => {
    if (isSubmitted) return; // Không cho sửa sau khi đã nộp
    setUserAnswers({
      ...userAnswers,
      [questionIndex]: optionIndex,
    });
  };

  // Tính điểm và nộp bài
  const handleSubmit = (e) => {
    e.preventDefault();

    let correctCount = 0;
    quiz.questions.forEach((question, index) => {
      if (userAnswers[index] === question.correctAnswerIndex) {
        correctCount++;
      }
    });

    setScore(correctCount);
    setIsSubmitted(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (loading)
    return (
      <div className="p-10 text-center font-medium">
        Đang chuẩn bị bài thi...
      </div>
    );
  if (error)
    return (
      <div className="p-10 text-center text-red-500 font-medium">{error}</div>
    );

  return (
    <div className="container mx-auto p-6 max-w-3xl">
      {/* Header Bài Thi */}
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">{quiz.title}</h1>
        <p className="text-gray-600">{quiz.description}</p>
      </div>

      {/* Hiển thị Kết quả sau khi nộp */}
      {isSubmitted && (
        <div className="mb-8 p-8 bg-white rounded-2xl shadow-xl border-t-8 border-green-500 text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Kết Quả Bài Làm
          </h2>
          <div className="text-5xl font-black text-green-600 mb-4">
            {score} / {quiz.questions.length}
          </div>
          <p className="text-gray-500 mb-6 font-medium">
            Bạn đã trả lời đúng{" "}
            {Math.round((score / quiz.questions.length) * 100)}% câu hỏi.
          </p>
          <button
            onClick={() => navigate("/home")}
            className="bg-gray-800 text-white px-6 py-2 rounded-xl hover:bg-black transition-all"
          >
            Quay lại trang chủ
          </button>
        </div>
      )}

      {/* Danh sách câu hỏi */}
      <form onSubmit={handleSubmit} className="space-y-8">
        {quiz.questions.map((question, qIndex) => (
          <div
            key={question._id}
            className={`bg-white p-6 rounded-2xl shadow-sm border-2 transition-all ${
              isSubmitted
                ? userAnswers[qIndex] === question.correctAnswerIndex
                  ? "border-green-100"
                  : "border-red-100"
                : "border-transparent"
            }`}
          >
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-lg font-bold text-gray-800">
                Câu {qIndex + 1}: {question.text}
              </h3>
              {isSubmitted &&
                (userAnswers[qIndex] === question.correctAnswerIndex ? (
                  <span className="text-green-500 font-bold">✓ Đúng</span>
                ) : (
                  <span className="text-red-500 font-bold">✗ Sai</span>
                ))}
            </div>

            <div className="grid grid-cols-1 gap-3">
              {question.options.map((option, oIndex) => {
                // Logic đổi màu các ô đáp án
                let bgColor = "bg-gray-50 border-gray-100";
                let textColor = "text-gray-700";

                if (isSubmitted) {
                  if (oIndex === question.correctAnswerIndex) {
                    bgColor = "bg-green-100 border-green-300"; // Đáp án đúng
                    textColor = "text-green-800";
                  } else if (userAnswers[qIndex] === oIndex) {
                    bgColor = "bg-red-100 border-red-300"; // Người dùng chọn sai
                    textColor = "text-red-800";
                  }
                } else if (userAnswers[qIndex] === oIndex) {
                  bgColor = "bg-blue-600 border-blue-600"; // Đang chọn
                  textColor = "text-white";
                }

                return (
                  <button
                    key={oIndex}
                    type="button"
                    disabled={isSubmitted}
                    onClick={() => handleOptionSelect(qIndex, oIndex)}
                    className={`p-4 rounded-xl border-2 text-left transition-all flex items-center gap-3 ${bgColor} ${textColor} ${
                      !isSubmitted && "hover:border-blue-400"
                    }`}
                  >
                    <span
                      className={`w-8 h-8 rounded-full flex items-center justify-center font-bold border ${
                        userAnswers[qIndex] === oIndex
                          ? "bg-white/20 border-white/50"
                          : "bg-white border-gray-200"
                      }`}
                    >
                      {String.fromCharCode(65 + oIndex)}
                    </span>
                    <span className="font-medium">{option}</span>
                  </button>
                );
              })}
            </div>

            {/* Giải thích sau khi nộp bài */}
            {isSubmitted &&
              userAnswers[qIndex] !== question.correctAnswerIndex && (
                <div className="mt-4 p-3 bg-blue-50 text-blue-700 rounded-lg text-sm">
                  <strong>Gợi ý:</strong> Đáp án đúng là{" "}
                  <b>{question.options[question.correctAnswerIndex]}</b>.
                </div>
              )}
          </div>
        ))}

        {/* Nút nộp bài */}
        {!isSubmitted && (
          <button
            type="submit"
            className="w-full py-4 bg-blue-600 text-white rounded-2xl font-bold text-xl shadow-lg hover:bg-blue-700 active:scale-[0.98] transition-all"
          >
            Hoàn thành và Nộp bài
          </button>
        )}
      </form>
    </div>
  );
};

export default SubmitQuiz;
