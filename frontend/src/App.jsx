import {
  BrowserRouter,
  Routes,
  Route,
  useNavigate,
  Navigate,
  useLocation,
} from "react-router";

import { useEffect, useState } from "react";

// Auth components
import LoginForm from "./features/auth/components/LoginForm.jsx";
import RegisterForm from "./features/auth/components/RegisterForm.jsx";
import VerifyEmail from "./features/auth/components/VerifyEmail.jsx";
import ProfilePage from "./features/auth/pages/ProfilePage.jsx";
import ForgotPasswordForm from "./features/auth/components/ForgotPasswordForm.jsx";
import ResetPasswordForm from "./features/auth/components/ResetPasswordForm.jsx";
import { AuthProvider, useAuth } from "./features/auth/context/AuthContext.jsx";

// UI components
import Toast from "./components/ui/Toast.jsx";
import Header from "./components/layout/Header.jsx";
import AppShell from "./components/layout/AppShell.jsx";
import Footer from "./components/layout/Footer.jsx";
import ScrollToTop from "./components/layout/ScrollToTop.jsx";
import NotFoundPage from "./components/layout/NotFoundPage.jsx";

// Todo components
import TodoForm from "./features/todos/components/TodoForm.jsx";
import TodoList from "./features/todos/components/TodoList.jsx";

// Contact component
import ContactForm from "./features/contact/components/ContactForm.jsx";

// Hooks
import { useTodos } from "./features/todos/hooks/useTodos.js";

function HomePage() {
  const navigate = useNavigate();
  const location = useLocation();

  const [toast, setToast] = useState(null);

  // Handle registration and login status received through navigation state.
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
    } else if (state.loginSuccess) {
      setToast({
        type: "success",
        message: state.message || "Login successful. Welcome back!",
      });
    }

    // Clear navigation state after reading it.
    navigate("/", {
      replace: true,
      state: null,
    });
  }, [location.state, navigate]);

  // Automatically hide success and error toasts after 5 seconds.
  // Keep pending toast visible until the API responds.
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
    selectedTodoIds,
    toggleTodoSelection,
    selectAllTodos,
    deleteSelectedTodos,
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
              selectedTodoIds={selectedTodoIds}
              onToggleTodoSelection={toggleTodoSelection}
              onSelectAllTodos={selectAllTodos}
              onDeleteSelectedTodos={deleteSelectedTodos}
              // Existing props
              onToggleTodo={toggleTodo}
              onDeleteTodo={deleteTodo}
              onEditTodo={startEditingTodo}
              editingTodoId={editingTodoId}
              onSaveTodo={saveTodo}
              onCancelEdit={cancelEditingTodo}
              onToggleAll={toggleAllTodos}
              onDeleteAll={deleteAllTodos}
            />
          )}
        </section>

        <ContactForm />
      </AppShell>

      {/* Registration and login status toast */}
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

// Shared layout for authentication pages.
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

// Protect routes that require authentication.
function ProtectedRoute({ children }) {
  const { isAuthenticated, isLoading } = useAuth();

  // Wait until authentication status is restored.
  if (isLoading) {
    return (
      <main className="app-shell">
        <p role="status">Checking your session...</p>
      </main>
    );
  }

  // Redirect unauthenticated users to login.
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Homepage */}
          <Route path="/" element={<HomePage />} />

          {/* Login */}
          <Route
            path="/login"
            element={
              <AuthPage>
                <LoginForm />
              </AuthPage>
            }
          />

          {/* Forgot Password */}
          <Route
            path="/forgot-password"
            element={
              <AuthPage>
                <ForgotPasswordForm />
              </AuthPage>
            }
          />

          <Route
            path="/reset-password/:token"
            element={
              <AuthPage>
                <ResetPasswordForm />
              </AuthPage>
            }
          />

          {/* Registration */}
          <Route
            path="/register"
            element={
              <AuthPage>
                <RegisterForm />
              </AuthPage>
            }
          />

          {/* Email verification */}
          <Route
            path="/verify-email/:token"
            element={
              <AuthPage>
                <VerifyEmail />
              </AuthPage>
            }
          />

          {/* Protected user profile */}
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <AuthPage>
                  <ProfilePage />
                </AuthPage>
              </ProtectedRoute>
            }
          />

          {/* 404 */}
          <Route
            path="*"
            element={
              <AuthPage>
                <NotFoundPage />
              </AuthPage>
            }
          />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
