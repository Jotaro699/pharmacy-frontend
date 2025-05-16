// import React, { useEffect, useState } from "react";
// import axios from "axios";

// function Dashboard() {
//   const [products, setProducts] = useState([]);
//   const [form, setForm] = useState({
//     name: "",
//     description: "",
//     price: "",
//     image: null,
//   });

//   useEffect(() => {
//     fetchProducts();
//   }, []);

//   const fetchProducts = async () => {
//     try {
//       const res = await axios.get("http://localhost:8000/api/products", {
//         headers: {
//           Authorization: `Bearer ${localStorage.getItem("token")}`,
//         },
//         withCredentials: true, // ✅ ضروري
//       });
//       setProducts(res.data);
//     } catch (err) {
//       console.error("Erreur lors du chargement des produits:", err);
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     const formData = new FormData();
//     Object.entries(form).forEach(([key, val]) => formData.append(key, val));

//     try {
//       await axios.post("http://localhost:8000/api/products", formData, {
//         headers: {
//           "Content-Type": "multipart/form-data",
//           Authorization: `Bearer ${localStorage.getItem("token")}`,
//         },
//         withCredentials: true,
//       });

//       setForm({ name: "", description: "", price: "", image: null });
//       fetchProducts();
//     } catch (err) {
//       console.error("Erreur lors de l'ajout:", err);
//     }
//   };

//   const handleDelete = async (id) => {
//     try {
//       await axios.delete(`http://localhost:8000/api/products/${id}`, {
//         headers: {
//           Authorization: `Bearer ${localStorage.getItem("token")}`,
//         },
//         withCredentials: true,
//       });
//       fetchProducts();
//     } catch (err) {
//       console.error("Erreur lors de la suppression:", err);
//     }
//   };

//   return (
//     <div>
//       <h2>Dashboard Admin</h2>

//       <form onSubmit={handleSubmit}>
//         <input
//           placeholder="Nom"
//           value={form.name}
//           onChange={(e) => setForm({ ...form, name: e.target.value })}
//         />
//         <input
//           placeholder="Description"
//           value={form.description}
//           onChange={(e) => setForm({ ...form, description: e.target.value })}
//         />
//         <input
//           placeholder="Prix"
//           value={form.price}
//           onChange={(e) => setForm({ ...form, price: e.target.value })}
//         />
//         <input
//           type="file"
//           onChange={(e) => setForm({ ...form, image: e.target.files[0] })}
//         />
//         <button type="submit">Ajouter</button>
//       </form>

//       <hr />

//       <ul>
//         {products.map((p) => (
//           <li key={p.id}>
//             <strong>{p.name}</strong> - {p.price} DH
//             <button onClick={() => handleDelete(p.id)}>Supprimer</button>
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
// }
// <button
//   onClick={() => {
//     localStorage.removeItem("token");
//     window.location.href = "/";
//   }}
// >
//   Déconnexion
// </button>;


// export default Dashboard;

// // khdam 100%
// import React, { useEffect, useState } from "react";
// import axios from "axios";

// function Dashboard() {
//   const [products, setProducts] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [form, setForm] = useState({
//     name: "",
//     description: "",
//     price: "",
//     stock: "",
//     promotion_percentage: "",
//     promotion_start: "",
//     promotion_end: "",
//     image: null,
//   });
  
//   const [formVisible, setFormVisible] = useState(false);

//   useEffect(() => {
//     fetchProducts();
//   }, []);

//   const fetchProducts = async () => {
//     setLoading(true);
//     try {
//       const res = await axios.get("http://localhost:8000/api/products", {
//         withCredentials: true,
//       });
//       setProducts(res.data);
//     } catch (err) {
//       console.error("Erreur lors du chargement des produits:", err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const getCsrfToken = () => {
//     return decodeURIComponent(
//       document.cookie
//         .split("; ")
//         .find((row) => row.startsWith("XSRF-TOKEN="))
//         ?.split("=")[1] || ""
//     );
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     const formData = new FormData();
//     formData.append("name", form.name);
//     formData.append("description", form.description);
//     formData.append("price", form.price);
//     formData.append("stock", form.stock);
//     formData.append("promotion_percentage", form.promotion_percentage);
//     formData.append("promotion_start", form.promotion_start);
//     formData.append("promotion_end", form.promotion_end);
//     formData.append("image", form.image);

//     try {
//       await axios.get("http://localhost:8000/sanctum/csrf-cookie", {
//         withCredentials: true,
//       });

//       await axios.post("http://localhost:8000/api/products", formData, {
//         headers: {
//           "Content-Type": "multipart/form-data",
//           "X-XSRF-TOKEN": getCsrfToken(),
//         },
//         withCredentials: true,
//       });

//       setForm({
//         name: "",
//         description: "",
//         price: "",
//         stock: "",
//         promotion_percentage: "",
//         promotion_start: "",
//         promotion_end: "",
//         image: null,
//       });
//       setFormVisible(false);
//       fetchProducts();
//     } catch (err) {
//       console.error("Erreur lors de l'ajout:", err);
//     }
//   };
  

//   const handleDelete = async (id) => {
//     const confirmDelete = window.confirm(
//       "Voulez-vous vraiment supprimer ce produit ?"
//     );
//     if (!confirmDelete) return;

//     try {
//       await axios.get("http://localhost:8000/sanctum/csrf-cookie", {
//         withCredentials: true,
//       });

//       await axios.delete(`http://localhost:8000/api/products/${id}`, {
//         headers: {
//           "X-XSRF-TOKEN": getCsrfToken(),
//         },
//         withCredentials: true,
//       });

//       fetchProducts();
//     } catch (err) {
//       console.error("Erreur lors de la suppression:", err);
//     }
//   };

//   const handleLogout = async () => {
//     try {
//       await axios.get("http://localhost:8000/sanctum/csrf-cookie", {
//         withCredentials: true,
//       });

//       await axios.post(
//         "http://localhost:8000/logout",
//         {},
//         {
//           headers: {
//             "X-XSRF-TOKEN": getCsrfToken(),
//           },
//           withCredentials: true,
//         }
//       );

//       localStorage.removeItem("token");
//       window.location.replace("/");
//     } catch (err) {
//       console.error("Erreur lors de la déconnexion:", err);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gray-50">
//       {/* Header */}
//       <nav className="bg-gradient-to-r from-blue-600 to-indigo-700 shadow-lg">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="flex justify-between h-16 items-center">
//             <div className="flex items-center">
//               <span className="text-white text-2xl font-bold">
//                 Dashboard Admin
//               </span>
//             </div>
//             <button
//               onClick={handleLogout}
//               className="inline-flex items-center bg-blue-800 border border-transparent rounded-md shadow-sm py-2 px-4 text-sm font-medium text-white hover:bg-blue-900 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
//             >
//               <svg
//                 xmlns="http://www.w3.org/2000/svg"
//                 className="h-5 w-5 mr-2"
//                 viewBox="0 0 20 20"
//                 fill="currentColor"
//               >
//                 <path
//                   fillRule="evenodd"
//                   d="M3 3a1 1 0 00-1 1v12a1 1 0 001 1h12a1 1 0 001-1V4a1 1 0 00-1-1H3zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z"
//                   clipRule="evenodd"
//                 />
//               </svg>
//               Déconnexion
//             </button>
//           </div>
//         </div>
//       </nav>

//       {/* Main Content */}
//       <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
//         <div className="px-4 py-6 sm:px-0">
//           <div className="mb-8 flex items-center justify-between">
//             <h1 className="text-2xl font-semibold text-gray-900">
//               Gestion des Produits
//             </h1>
//             <button
//               onClick={() => setFormVisible(!formVisible)}
//               className="flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
//             >
//               {formVisible ? (
//                 <>
//                   <svg
//                     xmlns="http://www.w3.org/2000/svg"
//                     className="h-5 w-5 mr-2"
//                     viewBox="0 0 20 20"
//                     fill="currentColor"
//                   >
//                     <path
//                       fillRule="evenodd"
//                       d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
//                       clipRule="evenodd"
//                     />
//                   </svg>
//                   Masquer le formulaire
//                 </>
//               ) : (
//                 <>
//                   <svg
//                     xmlns="http://www.w3.org/2000/svg"
//                     className="h-5 w-5 mr-2"
//                     viewBox="0 0 20 20"
//                     fill="currentColor"
//                   >
//                     <path
//                       fillRule="evenodd"
//                       d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
//                       clipRule="evenodd"
//                     />
//                   </svg>
//                   Ajouter un produit
//                 </>
//               )}
//             </button>
//           </div>

//           {/* Add Product Form */}
//           {formVisible && (
//             <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-8">
//               <div className="px-4 py-5 sm:p-6">
//                 <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
//                   Nouveau Produit
//                 </h3>
//                 <form onSubmit={handleSubmit} className="space-y-4">
//                   <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
//                     <div className="sm:col-span-3">
//                       <label
//                         htmlFor="name"
//                         className="block text-sm font-medium text-gray-700"
//                       >
//                         Nom
//                       </label>
//                       <div className="mt-1">
//                         <input
//                           type="text"
//                           name="name"
//                           id="name"
//                           value={form.name}
//                           onChange={(e) =>
//                             setForm({ ...form, name: e.target.value })
//                           }
//                           className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
//                           required
//                         />
//                       </div>
//                     </div>

//                     <div className="sm:col-span-3">
//                       <label
//                         htmlFor="price"
//                         className="block text-sm font-medium text-gray-700"
//                       >
//                         Prix (DH)
//                       </label>
//                       <div className="mt-1">
//                         <input
//                           type="number"
//                           name="price"
//                           id="price"
//                           value={form.price}
//                           onChange={(e) =>
//                             setForm({ ...form, price: e.target.value })
//                           }
//                           className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
//                           required
//                         />
//                       </div>
//                     </div>

//                     <div className="sm:col-span-6">
//                       <label
//                         htmlFor="description"
//                         className="block text-sm font-medium text-gray-700"
//                       >
//                         Description
//                       </label>
//                       <div className="mt-1">
//                         <textarea
//                           id="description"
//                           name="description"
//                           rows={3}
//                           value={form.description}
//                           onChange={(e) =>
//                             setForm({ ...form, description: e.target.value })
//                           }
//                           className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
//                           required
//                         />
//                       </div>
//                       <div className="sm:col-span-3">
//                         <label
//                           htmlFor="stock"
//                           className="block text-sm font-medium text-gray-700"
//                         >
//                           Stock
//                         </label>
//                         <div className="mt-1">
//                           <input
//                             type="number"
//                             name="stock"
//                             id="stock"
//                             value={form.stock}
//                             onChange={(e) =>
//                               setForm({ ...form, stock: e.target.value })
//                             }
//                             className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
//                           />
//                         </div>
//                       </div>

//                       <div className="sm:col-span-3">
//                         <label
//                           htmlFor="promotion_percentage"
//                           className="block text-sm font-medium text-gray-700"
//                         >
//                           Promotion (%)
//                         </label>
//                         <div className="mt-1">
//                           <input
//                             type="number"
//                             name="promotion_percentage"
//                             id="promotion_percentage"
//                             value={form.promotion_percentage}
//                             onChange={(e) =>
//                               setForm({
//                                 ...form,
//                                 promotion_percentage: e.target.value,
//                               })
//                             }
//                             className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
//                           />
//                         </div>
//                       </div>

//                       <div className="sm:col-span-3">
//                         <label
//                           htmlFor="promotion_start"
//                           className="block text-sm font-medium text-gray-700"
//                         >
//                           Début promotion
//                         </label>
//                         <div className="mt-1">
//                           <input
//                             type="date"
//                             name="promotion_start"
//                             id="promotion_start"
//                             value={form.promotion_start}
//                             onChange={(e) =>
//                               setForm({
//                                 ...form,
//                                 promotion_start: e.target.value,
//                               })
//                             }
//                             className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
//                           />
//                         </div>
//                       </div>

//                       <div className="sm:col-span-3">
//                         <label
//                           htmlFor="promotion_end"
//                           className="block text-sm font-medium text-gray-700"
//                         >
//                           Fin promotion
//                         </label>
//                         <div className="mt-1">
//                           <input
//                             type="date"
//                             name="promotion_end"
//                             id="promotion_end"
//                             value={form.promotion_end}
//                             onChange={(e) =>
//                               setForm({
//                                 ...form,
//                                 promotion_end: e.target.value,
//                               })
//                             }
//                             className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
//                           />
//                         </div>
//                       </div>
//                     </div>

//                     <div className="sm:col-span-6">
//                       <label
//                         htmlFor="image"
//                         className="block text-sm font-medium text-gray-700"
//                       >
//                         Image
//                       </label>
//                       <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
//                         <div className="space-y-1 text-center">
//                           <svg
//                             className="mx-auto h-12 w-12 text-gray-400"
//                             stroke="currentColor"
//                             fill="none"
//                             viewBox="0 0 48 48"
//                             aria-hidden="true"
//                           >
//                             <path
//                               d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
//                               strokeWidth={2}
//                               strokeLinecap="round"
//                               strokeLinejoin="round"
//                             />
//                           </svg>
//                           <div className="flex text-sm text-gray-600">
//                             <label
//                               htmlFor="file-upload"
//                               className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500"
//                             >
//                               <span>Télécharger une image</span>
//                               <input
//                                 id="file-upload"
//                                 name="file-upload"
//                                 type="file"
//                                 accept="image/*"
//                                 className="sr-only"
//                                 onChange={(e) =>
//                                   setForm({ ...form, image: e.target.files[0] })
//                                 }
//                                 required
//                               />
//                             </label>
//                             <p className="pl-1">ou glisser-déposer</p>
//                           </div>
//                           <p className="text-xs text-gray-500">
//                             PNG, JPG, GIF jusqu'à 10MB
//                           </p>
//                           {form.image && (
//                             <p className="text-sm text-indigo-600">
//                               {form.image.name}
//                             </p>
//                           )}
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                   <div className="pt-5">
//                     <div className="flex justify-end">
//                       <button
//                         type="button"
//                         onClick={() => setFormVisible(false)}
//                         className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
//                       >
//                         Annuler
//                       </button>
//                       <button
//                         type="submit"
//                         className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
//                       >
//                         Enregistrer
//                       </button>
//                     </div>
//                   </div>
//                 </form>
//               </div>
//             </div>
//           )}

//           {/* Products List */}
//           <div className="bg-white shadow overflow-hidden sm:rounded-lg">
//             <div className="px-4 py-5 sm:px-6">
//               <h2 className="text-lg leading-6 font-medium text-gray-900">
//                 Liste des Produits
//               </h2>
//               <p className="mt-1 max-w-2xl text-sm text-gray-500">
//                 {products.length} produit(s) disponible(s)
//               </p>
//             </div>

//             {loading ? (
//               <div className="text-center py-12">
//                 <svg
//                   className="animate-spin mx-auto h-8 w-8 text-indigo-500"
//                   xmlns="http://www.w3.org/2000/svg"
//                   fill="none"
//                   viewBox="0 0 24 24"
//                 >
//                   <circle
//                     className="opacity-25"
//                     cx="12"
//                     cy="12"
//                     r="10"
//                     stroke="currentColor"
//                     strokeWidth="4"
//                   ></circle>
//                   <path
//                     className="opacity-75"
//                     fill="currentColor"
//                     d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
//                   ></path>
//                 </svg>
//                 <p className="mt-2 text-sm text-gray-500">
//                   Chargement des produits...
//                 </p>
//               </div>
//             ) : (
//               <>
//                 {products.length === 0 ? (
//                   <div className="text-center py-12">
//                     <svg
//                       className="mx-auto h-12 w-12 text-gray-400"
//                       fill="none"
//                       viewBox="0 0 24 24"
//                       stroke="currentColor"
//                       aria-hidden="true"
//                     >
//                       <path
//                         strokeLinecap="round"
//                         strokeLinejoin="round"
//                         strokeWidth="2"
//                         d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
//                       />
//                     </svg>
//                     <h3 className="mt-2 text-sm font-medium text-gray-900">
//                       Aucun produit
//                     </h3>
//                     <p className="mt-1 text-sm text-gray-500">
//                       Commencez par créer un nouveau produit.
//                     </p>
//                   </div>
//                 ) : (
//                   <div className="overflow-hidden overflow-x-auto">
//                     <table className="min-w-full divide-y divide-gray-200">
//                       <thead className="bg-gray-50">
//                         <tr>
//                           <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                             Produit
//                           </th>
//                           <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                             Description
//                           </th>
//                           <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                             Prix
//                           </th>
//                           <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                             Stock
//                           </th>
//                           <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                             Promotion
//                           </th>
//                           <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
//                             Actions
//                           </th>
//                         </tr>
//                       </thead>

//                       <tbody className="bg-white divide-y divide-gray-200">
//                         {products.map((product) => (
//                           <tr key={product.id} className="hover:bg-gray-50">
//                             <td className="px-6 py-4 whitespace-nowrap">
//                               <div className="flex items-center">
//                                 <div className="flex-shrink-0 h-10 w-10">
//                                   {product.image_url ? (
//                                     <img
//                                       className="h-10 w-10 rounded-full object-cover"
//                                       src={product.image_url}
//                                       alt={product.name}
//                                     />
//                                   ) : (
//                                     <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
//                                       <svg
//                                         className="h-6 w-6 text-gray-400"
//                                         xmlns="http://www.w3.org/2000/svg"
//                                         fill="none"
//                                         viewBox="0 0 24 24"
//                                         stroke="currentColor"
//                                       >
//                                         <path
//                                           strokeLinecap="round"
//                                           strokeLinejoin="round"
//                                           strokeWidth={2}
//                                           d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
//                                         />
//                                       </svg>
//                                     </div>
//                                   )}
//                                 </div>
//                                 <div className="ml-4">
//                                   <div className="text-sm font-medium text-gray-900">
//                                     {product.name}
//                                   </div>
//                                 </div>
//                               </div>
//                             </td>
//                             <td className="px-6 py-4">
//                               <div className="text-sm text-gray-900 max-w-xs truncate">
//                                 {product.description}
//                               </div>
//                             </td>
//                             <td className="px-6 py-4 whitespace-nowrap">
//                               <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
//                                 {product.price} DH
//                               </span>
//                             </td>
//                             <td className="px-6 py-4 whitespace-nowrap">
//                               <span className="text-sm text-gray-900">
//                                 {product.stock}
//                               </span>
//                             </td>
//                             <td className="px-6 py-4 whitespace-nowrap">
//                               <span className="text-sm text-gray-900">
//                                 {product.promotion_percentage
//                                   ? `${product.promotion_percentage}%`
//                                   : "-"}
//                               </span>
//                             </td>

//                             <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
//                               <button
//                                 onClick={() => handleDelete(product.id)}
//                                 className="text-red-600 hover:text-red-900 focus:outline-none focus:underline"
//                               >
//                                 Supprimer
//                               </button>
//                             </td>
//                           </tr>
//                         ))}
//                       </tbody>
//                     </table>
//                   </div>
//                 )}
//               </>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default Dashboard;
import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Plus,
  Trash2,
  LogOut,
  CalendarCheck,
  Loader,
  Pencil,
} from "lucide-react";
import logo from "../assets/logo.png";

function Dashboard() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formVisible, setFormVisible] = useState(false);
  const [editingProductId, setEditingProductId] = useState(null);
  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    stock: "",
    promotion_percentage: "",
    promotion_start: "",
    promotion_end: "",
    image: null,
  });

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await axios.get(
        `http://localhost:8000/api/products?_=${Date.now()}`,
        {
          withCredentials: true,
        }
      );
      setProducts(res.data);
    } catch (err) {
      console.error("Erreur lors du chargement des produits:", err);
    } finally {
      setLoading(false);
    }
  };

  const getCsrfToken = () => {
    return decodeURIComponent(
      document.cookie
        .split("; ")
        .find((row) => row.startsWith("XSRF-TOKEN="))
        ?.split("=")[1] || ""
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.get("http://localhost:8000/sanctum/csrf-cookie", {
        withCredentials: true,
      });

      const url = editingProductId
        ? `http://localhost:8000/api/products/${editingProductId}`
        : "http://localhost:8000/api/products";

      let payload = new FormData();
      let headers = {
        "X-XSRF-TOKEN": getCsrfToken(),
        "Content-Type": "multipart/form-data",
      };

      if (editingProductId) {
        payload.append("_method", "PUT");
      }

      Object.entries(form).forEach(([key, value]) => {
        if (key === "image") {
          if (value) payload.append("image", value);
        } else {
          payload.append(key, value);
        }
      });

      await axios.post(url, payload, {
        headers,
        withCredentials: true,
      });

      setForm({
        name: "",
        description: "",
        price: "",
        stock: "",
        promotion_percentage: "",
        promotion_start: "",
        promotion_end: "",
        image: null,
      });
      setEditingProductId(null);
      setFormVisible(false);
      fetchProducts();
    } catch (err) {
      console.error("Erreur lors de l'enregistrement:", err);
    }
  };

  const handleEdit = (product) => {
    setForm({
      name: product.name || "",
      description: product.description || "",
      price: product.price || "",
      stock: product.stock || "",
      promotion_percentage: product.promotion_percentage || "",
      promotion_start: product.promotion_start || "",
      promotion_end: product.promotion_end || "",
      image: null,
    });
    setEditingProductId(product.id);
    setFormVisible(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Voulez-vous vraiment supprimer ce produit ?")) return;
    try {
      await axios.get("http://localhost:8000/sanctum/csrf-cookie", {
        withCredentials: true,
      });
      await axios.delete(`http://localhost:8000/api/products/${id}`, {
        headers: { "X-XSRF-TOKEN": getCsrfToken() },
        withCredentials: true,
      });
      fetchProducts();
    } catch (err) {
      console.error("Erreur lors de la suppression:", err);
    }
  };

  const handleLogout = async () => {
    try {
      await axios.get("http://localhost:8000/sanctum/csrf-cookie", {
        withCredentials: true,
      });
      await axios.post(
        "http://localhost:8000/logout",
        {},
        {
          headers: { "X-XSRF-TOKEN": getCsrfToken() },
          withCredentials: true,
        }
      );
      localStorage.removeItem("token");
      window.location.replace("/");
    } catch (err) {
      console.error("Erreur lors de la déconnexion:", err);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-white">
      <nav className="bg-white shadow sticky top-0 z-50 h-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full">
          <div className="flex justify-between items-center h-full">
            <div className="flex items-center gap-4">
              <img src={logo} alt="M3A PHARMA" className="h-14 w-auto" />
              <span className="font-bold text-indigo-700 text-2xl">
                M3A PHARMA
              </span>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 bg-red-500 text-white px-5 py-2 rounded-xl hover:bg-red-600 text-sm"
            >
              <LogOut size={18} />
              <span>Déconnexion</span>
            </button>
          </div>
        </div>
      </nav>

      <main className="p-6 max-w-7xl mx-auto">
        <section className="bg-white p-6 rounded-2xl shadow-md">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-700 flex items-center gap-2">
              <CalendarCheck size={20} /> Liste des Produits ({products.length})
            </h2>
            <button
              onClick={() => {
                setFormVisible(!formVisible);
                setForm({
                  name: "",
                  description: "",
                  price: "",
                  stock: "",
                  promotion_percentage: "",
                  promotion_start: "",
                  promotion_end: "",
                  image: null,
                });
                setEditingProductId(null);
              }}
              className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-xl shadow hover:bg-indigo-700"
            >
              <Plus size={18} /> {formVisible ? "Fermer" : "Ajouter Produit"}
            </button>
          </div>

          {formVisible && (
            <form
              onSubmit={handleSubmit}
              className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 bg-indigo-50 p-4 rounded-xl"
            >
              <input
                type="text"
                placeholder="Nom"
                value={form.name || ""}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
                className="p-3 rounded-lg border"
              />
              <input
                type="number"
                placeholder="Prix"
                value={form.price || ""}
                onChange={(e) => setForm({ ...form, price: e.target.value })}
                required
                className="p-3 rounded-lg border"
              />
              <textarea
                placeholder="Description"
                value={form.description || ""}
                onChange={(e) =>
                  setForm({ ...form, description: e.target.value })
                }
                className="p-3 rounded-lg border col-span-full"
              />
              <input
                type="number"
                placeholder="Stock"
                value={form.stock || ""}
                onChange={(e) => setForm({ ...form, stock: e.target.value })}
                className="p-3 rounded-lg border"
              />
              <input
                type="number"
                placeholder="Promotion (%)"
                value={form.promotion_percentage || ""}
                onChange={(e) =>
                  setForm({ ...form, promotion_percentage: e.target.value })
                }
                className="p-3 rounded-lg border"
              />
              <input
                type="date"
                value={form.promotion_start || ""}
                onChange={(e) =>
                  setForm({ ...form, promotion_start: e.target.value })
                }
                className="p-3 rounded-lg border"
              />
              <input
                type="date"
                value={form.promotion_end || ""}
                onChange={(e) =>
                  setForm({ ...form, promotion_end: e.target.value })
                }
                className="p-3 rounded-lg border"
              />
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setForm({ ...form, image: e.target.files[0] })}
                className="p-3 rounded-lg border col-span-full"
              />
              <button
                type="submit"
                className="col-span-full bg-green-600 text-white py-3 rounded-xl hover:bg-green-700 font-semibold"
              >
                {editingProductId ? "Mettre à jour" : "Enregistrer"}
              </button>
            </form>
          )}

          {loading ? (
            <div className="flex justify-center py-8 text-indigo-600">
              <Loader className="animate-spin" size={32} />
            </div>
          ) : (
            <div className="overflow-x-auto rounded-xl">
              <table className="min-w-full text-sm text-left border">
                <thead className="bg-indigo-100 text-indigo-800">
                  <tr>
                    <th className="p-3">Nom</th>
                    <th className="p-3">Prix</th>
                    <th className="p-3">Stock</th>
                    <th className="p-3">Promotion</th>
                    <th className="p-3">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((p) => (
                    <tr key={p.id} className="border-t hover:bg-indigo-50">
                      <td className="p-3 font-medium text-gray-800">
                        {p.name}
                      </td>
                      <td className="p-3">{p.price} DH</td>
                      <td className="p-3">{p.stock}</td>
                      <td className="p-3">{p.promotion_percentage || "0"}%</td>
                      <td className="p-3 text-right flex gap-3 justify-end">
                        <button
                          onClick={() => handleEdit(p)}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          <Pencil size={18} />
                        </button>
                        <button
                          onClick={() => handleDelete(p.id)}
                          className="text-red-600 hover:text-red-800"
                        >
                          <Trash2 size={18} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

export default Dashboard;




