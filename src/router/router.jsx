import { createBrowserRouter, Navigate } from "react-router-dom";
import Login from "../pages/Login/Login";
import Home from "../pages/Home/Home";
import QuizDetails from "../pages/QuizDetails/QuizDetails";
import EditQuiz from "../pages/EditQuiz/EditQuiz";
import CreateQuiz from "../pages/CreateQuiz/CreateQuiz";
import CreateQues from "../pages/CreateQues/CreateQues";
import App from "../App";
import UserApp from "../UserApp";
import SubmitQuiz from "../pages/SubmitQuiz/SubmitQuiz";
import Register from "../pages/Register/Register";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Login />,
  },
  {
    path: "/register",
    element: <Register />,
  },
  {
    path: "/admin",
    element: <App />, // Wrapper cho Admin
    children: [
      { path: "home", element: <Home /> },
      {
        path: "quizzes",
        children: [
          { path: "details/:id", element: <QuizDetails /> },
          { path: "edit/:id", element: <EditQuiz /> },
          { path: "create", element: <CreateQuiz /> },
        ],
      },
      { path: "questions/create/:id", element: <CreateQues /> },
    ],
  },

  {
    path: "/home",
    element: <UserApp />,
    children: [
      { index: true, element: <Home /> },
      { path: "quiz/submit/:id", element: <SubmitQuiz /> },
    ],
  },
  {
    path: "*",
    element: <Navigate to="/" />,
  },
]);

export default router;
