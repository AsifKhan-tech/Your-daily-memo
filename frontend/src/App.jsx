import {
  BrowserRouter,
  Routes,
  Route,
  useNavigate,
  useLocation,
} from "react-router";

import { useEffect, useState } from "react";

import LoginForm from "./features/auth/components/LoginForm.jsx";
import RegisterForm from "./features/auth/components/RegisterForm.jsx";
import Toast from "./components/ui/Toast.jsx";

// Components
import Header from "./components/layout/Header.jsx";
import AppShell from "./components/layout/AppShell.jsx";
import TodoForm from "./features/todos/components/TodoForm.jsx";
import TodoList from "./features/todos/components/TodoList.jsx";
import ContactForm from "./features/contact/components/ContactForm.jsx";
import Footer from "./components/layout/Footer.jsx";
import ScrollToTop from "./components/layout/ScrollToTop.jsx";

// Hooks
import { useTodos } from "./features/todos/hooks/useTodos.js";

function HomePage() {
  const navigate = useNavigate();
  const location = useLocation();

  const [toast, setToast] = useState(null);

  // Handle registration status received from RegisterForm.
  useEffect(() => {
    const state = location.state;

    if (!state) return;

    if (state.registrationPending) {
      setToast({
        type: "pending",
        message: "Creating your account...",
      });
    } else if (state.registrationSuccess) {
      setToast({
        type: "success",
        message: state.message,
      });
    } else if (state.registrationError) {
      setToast({
        type: "error",
        message: state.message,
      });
    }

    // Clear navigation state after reading it.
    navigate("/", {
      replace: true,
      state: null,
    });
  }, [location.state, navigate]);

  // Hide success and error toasts after 5 seconds.
  // Keep the pending toast visible until the API responds.
  useEffect(() => {
    if (!toast || toast.type === "pending") return;

    const timer = setTimeout(() => {
      setToast(null);
    }, 5000);

    return () => clearTimeout(timer);
  }, [toast]);

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
      <Header
        onLoginClick={() => navigate("/login")}
        onRegisterClick={() => navigate("/register")}
      />

      <AppShell>
        <section className="todo-container" aria-labelledby="memo-title">
          <p className="eyebrow">Daily memo</p>
          <h1 id="memo-title">What's on your mind?</h1>
          <p className="intro">Capture a task before it slips away.</p>

          <TodoForm onAddTodo={addTodo} />

          {/* Loading and error states */}

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

      {/* Registration status toast */}
      {toast && (
        <Toast
          type={toast.type}
          message={toast.message}
          onClose={() => setToast(null)}
        />
      )}

      <Footer />
      <ScrollToTop />
    </>
  );
}

function AuthPage({ children }) {
  const navigate = useNavigate();

  return (
    <>
      <Header
        onLoginClick={() => navigate("/login")}
        onRegisterClick={() => navigate("/register")}
      />

      <main className="app-shell">{children}</main>

      <Footer />
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />

        <Route
          path="/login"
          element={
            <AuthPage>
              <LoginForm />
            </AuthPage>
          }
        />

        <Route
          path="/register"
          element={
            <AuthPage>
              <RegisterForm />
            </AuthPage>
          }
        />

        <Route
          path="*"
          element={
            <main className="app-shell">
              <h1>Page not found</h1>
              <p>The page you are looking for does not exist.</p>
              <a href="/">Back to Daily Memo</a>
            </main>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
