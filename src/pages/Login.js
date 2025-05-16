// import React, { useState } from "react";
// import axios from "axios";

// function Login() {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [error, setError] = useState("");

//   const handleLogin = async (e) => {
//     e.preventDefault();
//     setError("");

//     try {
//       await axios.get("http://localhost:8000/sanctum/csrf-cookie", {
//         withCredentials: true,
//       });

//       await axios.post(
//         "http://localhost:8000/login",
//         { email, password },
//         {
//           withCredentials: true,
//         }
//       );

//       window.location.href = "/dashboard";
//     } catch (err) {
//       console.error(err);
//       setError("Échec de la connexion");
//     }
//   };

//   return (
//     <div>
//       <h2>Connexion</h2>
//       <form onSubmit={handleLogin}>
//         <input
//           type="email"
//           value={email}
//           onChange={(e) => setEmail(e.target.value)}
//           placeholder="Email"
//         />
//         <input
//           type="password"
//           value={password}
//           onChange={(e) => setPassword(e.target.value)}
//           placeholder="Mot de passe"
//         />
//         <button type="submit">Se connecter</button>
//       </form>
//       {error && <p>{error}</p>}
//     </div>
//   );
// }

// export default Login;
// import React, { useState } from "react";
// import axios from "axios";

// function Login() {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [error, setError] = useState("");

//   const handleLogin = async (e) => {
//     e.preventDefault();
//     setError("");

//     try {
//       // 1. Get CSRF Cookie
//       await axios.get("http://localhost:8000/sanctum/csrf-cookie", {
//         withCredentials: true,
//       });
      

//       // 2. Send login to /login not /api/login (VERY IMPORTANT!)
//       const res = await axios.post(
//         "http://localhost:8000/login",
//         { email, password },
//         {
//           headers: {
//             "X-XSRF-TOKEN": decodeURIComponent(
//               document.cookie
//                 .split("; ")
//                 .find((row) => row.startsWith("XSRF-TOKEN="))
//                 ?.split("=")[1] || ""
//             ),
//           },
//           withCredentials: true,
//         }
//       );

//       // 3. Redirect to dashboard
//       window.location.replace("/dashboard");
//     } catch (err) {
//       console.error(err);
//       setError("Échec de la connexion");
//     }
//   };

//   return (
//     <div style={{ padding: "50px", maxWidth: "400px", margin: "auto" }}>
//       <h2>Connexion Admin</h2>
//       <form onSubmit={handleLogin}>
//         <input
//           type="email"
//           placeholder="Adresse email"
//           value={email}
//           onChange={(e) => setEmail(e.target.value)}
//           required
//           style={{ display: "block", margin: "10px 0", width: "100%" }}
//         />
//         <input
//           type="password"
//           placeholder="Mot de passe"
//           value={password}
//           onChange={(e) => setPassword(e.target.value)}
//           required
//           style={{ display: "block", margin: "10px 0", width: "100%" }}
//         />
//         <button type="submit" style={{ padding: "10px 20px" }}>
//           Se connecter
//         </button>
//       </form>
//       {error && <p style={{ color: "red" }}>{error}</p>}
//     </div>
//   );
// }

// export default Login;

import React, { useState } from "react";
import axios from "axios";
import { ShieldCheck, Lock, Mail } from "lucide-react";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      await axios.get("http://localhost:8000/sanctum/csrf-cookie", {
        withCredentials: true,
      });

      const res = await axios.post(
        "http://localhost:8000/login",
        { email, password },
        {
          headers: {
            "X-XSRF-TOKEN": decodeURIComponent(
              document.cookie
                .split("; ")
                .find((row) => row.startsWith("XSRF-TOKEN="))
                ?.split("=")[1] || ""
            ),
          },
          withCredentials: true,
        }
      );

      window.location.replace("/dashboard");
    } catch (err) {
      console.error(err);
      setError("Échec de la connexion");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-100 to-cyan-200 flex items-center justify-center p-4">
      <div className="bg-white shadow-2xl rounded-2xl p-8 max-w-md w-full relative border border-green-300">
        <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-white p-3 rounded-full shadow-md border border-green-400">
          <ShieldCheck size={36} className="text-green-500" />
        </div>

        <h2 className="text-2xl font-bold text-center mb-6 text-green-700 mt-6">
          Connexion Administrateur
        </h2>

        <form onSubmit={handleLogin} className="space-y-4">
          <div className="flex items-center border px-3 py-2 rounded-md shadow-sm bg-gray-50">
            <Mail className="text-green-500 mr-2" size={18} />
            <input
              type="email"
              placeholder="Adresse email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full outline-none bg-transparent text-sm"
            />
          </div>

          <div className="flex items-center border px-3 py-2 rounded-md shadow-sm bg-gray-50">
            <Lock className="text-green-500 mr-2" size={18} />
            <input
              type="password"
              placeholder="Mot de passe"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full outline-none bg-transparent text-sm"
            />
          </div>

          {error && (
            <p className="text-red-500 text-sm text-center font-medium">
              {error}
            </p>
          )}

          <button
            type="submit"
            className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 rounded-md shadow-md transition"
          >
            Se connecter
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;



