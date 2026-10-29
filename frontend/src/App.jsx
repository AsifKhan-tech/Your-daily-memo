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
import ContactForm from "./features/contact/components/ContactForm.jsx";
import Footer from "./components/layout/Footer.jsx";
import ScrollToTop from "./components/layout/ScrollToTop.jsx";

//Hooks
import { useTodos } from "./features/todos/hooks/useTodos.js";

function App() {
  const {
    todos,
    isLoading,
    error,
    retryLoading,
    addTodo,
    toggleTodo,
    deleteTodo,
    toggleAllTodos,
    deleteAllTodos,
    editingTodoId,
    startEditingTodo,
    saveTodo,
    cancelEditingTodo,
  } = useTodos();

  return (
    <>
      <Header />

      <AppShell>
        <section className="todo-container" aria-labelledby="memo-title">
          <p className="eyebrow">Daily memo</p>
          <h1 id="memo-title">What's on your mind?</h1>
          <p className="intro">Capture a task before it slips away.</p>

          <TodoForm onAddTodo={addTodo} />

          {/* Adding loading and error template  */}

          {error && (
            <div className="error-message" role="alert">
              <p>{error}</p>
              <button type="button" onClick={retryLoading}>
                Retry loading
              </button>
            </div>
          )}

          {isLoading ? (
            <p role="status">Loading your memos...</p>
          ) : (
            <TodoList
              todos={todos}
              onToggleTodo={toggleTodo}
              onDeleteTodo={deleteTodo}
              editingTodoId={editingTodoId}
              onEditTodo={startEditingTodo}
              onSaveTodo={saveTodo}
              onCancelEdit={cancelEditingTodo}
              onToggleAll={toggleAllTodos}
              onDeleteAll={deleteAllTodos}
            />
          )}
        </section>
        <ContactForm />
      </AppShell>
      <Footer />
      <ScrollToTop />
    </>
  );
}

export default App;
