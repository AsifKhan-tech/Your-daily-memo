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

//  Components
import Header from "./components/layout/Header.jsx";
import AppShell from "./components/layout/AppShell.jsx";
import TodoForm from "./features/todos/components/TodoForm.jsx";
import TodoList from "./features/todos/components/TodoList.jsx";

//Hooks
import { useTodos } from "./features/todos/hooks/useTodos.js";

function App() {
  const { todos, addTodo, toggleTodo, deleteTodo } = useTodos();

  return (
    <>
      <Header />

      <AppShell>
        <section className="todo-container" aria-labelledby="memo-title">
          <p className="eyebrow">Daily memo</p>
          <h1 id="memo-title">What's on your mind?</h1>
          <p className="intro">Capture a task before it slips away.</p>

          <TodoForm onAddTodo={addTodo} />
          <TodoList
            todos={todos}
            onToggleTodo={toggleTodo}
            onDeleteTodo={deleteTodo}
          />
        </section>
      </AppShell>
    </>
  );
}

export default App;
