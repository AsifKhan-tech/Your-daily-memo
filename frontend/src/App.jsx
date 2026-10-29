// import { Routes, Route } from "react-router";

// import RegisterPage from "./features/auth/pages/RegisterPage";
// import VerifyEmailPage from "./features/auth/pages/VerifyEmailPage";
// import LoginPage from "./features/auth/pages/LoginPage";

// import MainLayout from "./layouts/MainLayout";
// import HomePage from "./features/home/pages/HomePage";

// import "./App.css";

// function App() {
//   return (
//     <Routes>
//       <Route element={<MainLayout />}>
//         <Route path="/" element={<HomePage />} />
//       </Route>

//       <Route path="/login" element={<LoginPage />} />
//       <Route path="/register" element={<RegisterPage />} />
//       <Route path="/verify-email/:token" element={<VerifyEmailPage />} />
//     </Routes>
//   );
// }

// export default App;

import { useState } from "react";

import Header from "./components/layout/Header.jsx";
import TodoForm from "./features/todos/components/TodoForm.jsx";

export default function App() {
  const [todos, setTodos] = useState([]);

  function handleAddTodo(newTodo) {
    const todo = {
      id: crypto.randomUUID(),
      memo: newTodo.memo,
      dateTime: newTodo.dateTime,
      completed: false,
    };

    setTodos((currentTodos) => [...currentTodos, todo]);
  }

  return (
    <>
      <Header />

      <main className="app-shell" id="home">
        <section className="todo-container" aria-labelledby="memo-title">
          <p className="eyebrow">Daily memo</p>

          <h1 id="memo-title">What's on your mind?</h1>

          <p className="intro">Capture a task before it slips away.</p>

          <TodoForm onAddTodo={handleAddTodo} />

          <section className="todo-list-section" aria-labelledby="list-title">
            <div className="list-heading">
              <h2 id="list-title">All tasks</h2>

              <span className="todo-count">{todos.length}</span>
            </div>

            {todos.length === 0 && (
              <p className="empty-state">Your added tasks will appear here.</p>
            )}
          </section>
        </section>
      </main>
    </>
  );
}
