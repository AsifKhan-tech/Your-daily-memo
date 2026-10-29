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

import Header from "./components/layout/Header";

export default function App() {
  return (
    <>
      <Header />
    </>
  );
}
