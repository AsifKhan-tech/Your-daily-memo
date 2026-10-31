// import { useEffect, useState } from "react";
// import { Link, useParams } from "react-router";

// import { verifyEmail } from "../services/authService";

// function VerifyEmail() {
//   const { token } = useParams();

//   const [status, setStatus] = useState("loading");
//   const [message, setMessage] = useState("Verifying your email...");

//   useEffect(() => {
//     let isMounted = true;

//     async function handleVerification() {
//       if (!token) {
//         setStatus("error");
//         setMessage("Verification token is missing.");
//         return;
//       }

//       try {
//         const response = await verifyEmail(token);

//         if (!isMounted) return;

//         setStatus("success");
//         setMessage(
//           response.message || "Your email has been verified successfully.",
//         );
//       } catch (error) {
//         if (!isMounted) return;

//         setStatus("error");
//         setMessage(
//           error.message || "Email verification failed. Please try again.",
//         );
//       }
//     }

//     handleVerification();

//     return () => {
//       isMounted = false;
//     };
//   }, [token]);

//   return (
//     <section className="todo-container auth-container">
//       <div className="verify-email-content">
//         {status === "loading" && (
//           <>
//             <h1>Verifying Email</h1>
//             <p>{message}</p>
//           </>
//         )}

//         {status === "success" && (
//           <>
//             <h1>Email Verified!</h1>
//             <p>{message}</p>
//             <Link to="/login" className="add-todo">
//               Continue to Login
//             </Link>
//           </>
//         )}

//         {status === "error" && (
//           <>
//             <h1>Verification Failed</h1>
//             <p>{message}</p>
//             <Link to="/login" className="add-todo">
//               Go to Login
//             </Link>
//           </>
//         )}
//       </div>
//     </section>
//   );
// }

// export default VerifyEmail;

import { useEffect, useState } from "react";
import { Link, useParams } from "react-router";

import { verifyEmail } from "../services/authService";
import Toast from "../../../components/ui/Toast";

function VerifyEmail() {
  const { token } = useParams();

  const [status, setStatus] = useState("loading");
  const [message, setMessage] = useState("Verifying your email...");
  const [toast, setToast] = useState(null);

  useEffect(() => {
    async function handleVerification() {
      if (!token) {
        setStatus("error");
        setMessage("Verification token is missing.");

        setToast({
          type: "error",
          message: "Verification token is missing.",
        });

        return;
      }

      try {
        const response = await verifyEmail(token);

        const successMessage =
          response.message || "Email verified successfully.";

        setStatus("success");
        setMessage(successMessage);

        setToast({
          type: "success",
          message: successMessage,
        });
      } catch (error) {
        const errorMessage =
          error.message || "Email verification failed. Please try again.";

        setStatus("error");
        setMessage(errorMessage);

        setToast({
          type: "error",
          message: errorMessage,
        });
      }
    }

    handleVerification();
  }, [token]);

  // Automatically hide toast after 5 seconds.
  useEffect(() => {
    if (!toast) return;

    const timer = setTimeout(() => {
      setToast(null);
    }, 5000);

    return () => clearTimeout(timer);
  }, [toast]);

  return (
    <>
      <section className="verify-email-container">
        <div className="verify-email-content">
          {status === "loading" && (
            <>
              <div className="verify-spinner" aria-hidden="true" />

              <h1>Verifying Email</h1>
              <p>{message}</p>
            </>
          )}

          {status === "success" && (
            <>
              <h1>Email Verified!</h1>

              <p>{message}</p>

              <Link to="/login" className="verify-email-action">
                Continue to Login
              </Link>
            </>
          )}

          {status === "error" && (
            <>
              <h1>Verification Failed</h1>

              <p>{message}</p>

              <Link to="/login" className="verify-email-action">
                Go to Login
              </Link>
            </>
          )}
        </div>
      </section>

      {toast && (
        <Toast
          type={toast.type}
          message={toast.message}
          onClose={() => setToast(null)}
        />
      )}
    </>
  );
}

export default VerifyEmail;
