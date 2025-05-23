// import React, { useState } from "react";
// import axios from "axios";

// const ResetPassword = () => {
//   const [code, setCode] = useState("");
//   const [email, setEmail] = useState("");
//   const [newPassword, setNewPassword] = useState("");
//   const [message, setMessage] = useState("");

//   const handleReset = async () => {
//     try {
//       const res = await axios.post(
//         "http://localhost:8000/api/reset-admin-password",
//         {
//           code,
//           email,
//           new_password: newPassword,
//         },
//         {
//           withCredentials: false, // ✅ Add this line
//         }
//       );
      
//       setMessage(res.data.message);
//     } catch (err) {
//       setMessage("Erreur: vérifie code ou email.");
//     }
//   };

//   return (
//     <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded shadow">
//       <h2 className="text-2xl font-bold mb-4">
//         Réinitialisation du mot de passe
//       </h2>
//       <input
//         type="text"
//         placeholder="Code secret"
//         value={code}
//         onChange={(e) => setCode(e.target.value)}
//         className="w-full mb-3 p-2 border rounded"
//       />
//       <input
//         type="email"
//         placeholder="Email de l’admin"
//         value={email}
//         onChange={(e) => setEmail(e.target.value)}
//         className="w-full mb-3 p-2 border rounded"
//       />
//       <input
//         type="password"
//         placeholder="Nouveau mot de passe"
//         value={newPassword}
//         onChange={(e) => setNewPassword(e.target.value)}
//         className="w-full mb-3 p-2 border rounded"
//       />
//       <button
//         onClick={handleReset}
//         className="bg-blue-600 text-white px-4 py-2 rounded"
//       >
//         Réinitialiser
//       </button>
//       {message && <p className="mt-4 text-center">{message}</p>}
//     </div>
//   );
// };

// export default ResetPassword;
import React, { useState } from "react";
import axios from "axios";

const ResetPassword = () => {
  const [code, setCode] = useState("");
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleReset = async () => {
    try {
      const res = await axios.post(
        "http://localhost:8000/api/reset-admin-password",
        {
          code,
          email,
          new_password: newPassword,
        },
        {
          withCredentials: false, // 🔐 MAHMA bzaf
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      setMessage(res.data.message);
    } catch (err) {
      console.error(err);
      setMessage("Erreur: vérifie code ou email.");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-4 text-center">
        Réinitialisation du mot de passe
      </h2>

      <input
        type="text"
        placeholder="Code secret"
        value={code}
        onChange={(e) => setCode(e.target.value)}
        className="w-full mb-3 p-2 border rounded"
      />
      <input
        type="email"
        placeholder="Email admin"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="w-full mb-3 p-2 border rounded"
      />
      <input
        type="password"
        placeholder="Nouveau mot de passe"
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
        className="w-full mb-3 p-2 border rounded"
      />

      <button
        onClick={handleReset}
        className="bg-green-600 text-white px-4 py-2 rounded w-full"
      >
        Réinitialiser
      </button>

      {message && (
        <p className="mt-4 text-center text-sm font-semibold text-gray-700">
          {message}
        </p>
      )}
    </div>
  );
};

export default ResetPassword;
