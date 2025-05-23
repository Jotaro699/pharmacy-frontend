// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { Plus, Trash2, CalendarCheck, Loader, Pencil } from "lucide-react";

// function Dashboard() {
//   const [products, setProducts] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [formVisible, setFormVisible] = useState(false);
//   const [editingProductId, setEditingProductId] = useState(null);
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

//   useEffect(() => {
//     fetchProducts();
//   }, []);

//   const fetchProducts = async () => {
//     setLoading(true);
//     try {
//       const res = await axios.get(
//         `http://localhost:8000/api/products?_=${Date.now()}`,
//         {
//           withCredentials: true,
//         }
//       );
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

//     try {
//       await axios.get("http://localhost:8000/sanctum/csrf-cookie", {
//         withCredentials: true,
//       });

//       const url = editingProductId
//         ? `http://localhost:8000/api/products/${editingProductId}`
//         : "http://localhost:8000/api/products";

//       let payload = new FormData();
//       let headers = {
//         "X-XSRF-TOKEN": getCsrfToken(),
//         "Content-Type": "multipart/form-data",
//       };

//       if (editingProductId) {
//         payload.append("_method", "PUT");
//       }

//       Object.entries(form).forEach(([key, value]) => {
//         if (key === "image") {
//           if (value) payload.append("image", value);
//         } else {
//           payload.append(key, value);
//         }
//       });

//       await axios.post(url, payload, {
//         headers,
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
//       setEditingProductId(null);
//       setFormVisible(false);
//       fetchProducts();
//     } catch (err) {
//       console.error("Erreur lors de l'enregistrement:", err);
//     }
//   };

//   const handleEdit = (product) => {
//     setForm({
//       name: product.name || "",
//       description: product.description || "",
//       price: product.price || "",
//       stock: product.stock || "",
//       promotion_percentage: product.promotion_percentage || "",
//       promotion_start: product.promotion_start || "",
//       promotion_end: product.promotion_end || "",
//       image: null,
//     });
//     setEditingProductId(product.id);
//     setFormVisible(true);
//   };

//   const handleDelete = async (id) => {
//     if (!window.confirm("Voulez-vous vraiment supprimer ce produit ?")) return;
//     try {
//       await axios.get("http://localhost:8000/sanctum/csrf-cookie", {
//         withCredentials: true,
//       });
//       await axios.delete(`http://localhost:8000/api/products/${id}`, {
//         headers: { "X-XSRF-TOKEN": getCsrfToken() },
//         withCredentials: true,
//       });
//       fetchProducts();
//     } catch (err) {
//       console.error("Erreur lors de la suppression:", err);
//     }
//   };

//   return (
//     <div className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white">
//       <main className="p-6 max-w-7xl mx-auto">
//         <section className="bg-white p-6 rounded-2xl shadow-md">
//           <div className="flex justify-between items-center mb-6">
//             <h2 className="text-xl font-semibold text-gray-700 flex items-center gap-2">
//               <CalendarCheck size={20} /> Liste des Produits ({products.length})
//             </h2>
//             <button
//               onClick={() => {
//                 setFormVisible(!formVisible);
//                 setForm({
//                   name: "",
//                   description: "",
//                   price: "",
//                   stock: "",
//                   promotion_percentage: "",
//                   promotion_start: "",
//                   promotion_end: "",
//                   image: null,
//                 });
//                 setEditingProductId(null);
//               }}
//               className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-xl shadow hover:bg-indigo-700">
//               <Plus size={18} /> {formVisible ? "Fermer" : "Ajouter Produit"}
//             </button>
//           </div>

//           {formVisible && (
//             <form
//               onSubmit={handleSubmit}
//               className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 bg-indigo-50 p-4 rounded-xl">
//               <input
//                 type="text"
//                 placeholder="Nom"
//                 value={form.name || ""}
//                 onChange={(e) => setForm({ ...form, name: e.target.value })}
//                 required
//                 className="p-3 rounded-lg border"
//               />
//               <input
//                 type="number"
//                 placeholder="Prix"
//                 value={form.price || ""}
//                 onChange={(e) => setForm({ ...form, price: e.target.value })}
//                 required
//                 className="p-3 rounded-lg border"
//               />
//               <textarea
//                 placeholder="Description"
//                 value={form.description || ""}
//                 onChange={(e) =>
//                   setForm({ ...form, description: e.target.value })
//                 }
//                 className="p-3 rounded-lg border col-span-full"
//               />
//               <input
//                 type="number"
//                 placeholder="Stock"
//                 value={form.stock || ""}
//                 onChange={(e) => setForm({ ...form, stock: e.target.value })}
//                 className="p-3 rounded-lg border"
//               />
//               <input
//                 type="number"
//                 placeholder="Promotion (%)"
//                 value={form.promotion_percentage || ""}
//                 onChange={(e) =>
//                   setForm({ ...form, promotion_percentage: e.target.value })
//                 }
//                 className="p-3 rounded-lg border"
//               />
//               <input
//                 type="date"
//                 value={form.promotion_start || ""}
//                 onChange={(e) =>
//                   setForm({ ...form, promotion_start: e.target.value })
//                 }
//                 className="p-3 rounded-lg border"
//               />
//               <input
//                 type="date"
//                 value={form.promotion_end || ""}
//                 onChange={(e) =>
//                   setForm({ ...form, promotion_end: e.target.value })
//                 }
//                 className="p-3 rounded-lg border"
//               />
//               <input
//                 type="file"
//                 accept="image/*"
//                 onChange={(e) => setForm({ ...form, image: e.target.files[0] })}
//                 className="p-3 rounded-lg border col-span-full"
//               />
//               <button
//                 type="submit"
//                 className="col-span-full bg-green-600 text-white py-3 rounded-xl hover:bg-green-700 font-semibold">
//                 {editingProductId ? "Mettre à jour" : "Enregistrer"}
//               </button>
//             </form>
//           )}

//           {loading ? (
//             <div className="flex justify-center py-8 text-indigo-600">
//               <Loader className="animate-spin" size={32} />
//             </div>
//           ) : (
//             <div className="overflow-x-auto rounded-xl">
//               <table className="min-w-full text-sm text-left border">
//                 <thead className="bg-indigo-100 text-indigo-800">
//                   <tr>
//                     <th className="p-3">Nom</th>
//                     <th className="p-3">Prix</th>
//                     <th className="p-3">Stock</th>
//                     <th className="p-3">Promotion</th>
//                     <th className="p-3">Action</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {products.map((p) => (
//                     <tr key={p.id} className="border-t hover:bg-indigo-50">
//                       <td className="p-3 font-medium text-gray-800">
//                         {p.name}
//                       </td>
//                       <td className="p-3">{p.price} DH</td>
//                       <td className="p-3">{p.stock}</td>
//                       <td className="p-3">{p.promotion_percentage || "0"}%</td>
//                       <td className="p-3 text-right flex gap-3 justify-end">
//                         <button
//                           onClick={() => handleEdit(p)}
//                           className="text-blue-600 hover:text-blue-800">
//                           <Pencil size={18} />
//                         </button>
//                         <button
//                           onClick={() => handleDelete(p.id)}
//                           className="text-red-600 hover:text-red-800">
//                           <Trash2 size={18} />
//                         </button>
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           )}
//         </section>
//       </main>
//     </div>
//   );
// }

// export default Dashboard;

// ✅ Dashboard avec design moderne pour produits (comme les services)
// ✅ Dashboard avec affichage d'image depuis /storage + design moderne
import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Plus,
  Trash2,
  CalendarCheck,
  Loader,
  Pencil,
  DollarSign,
  CheckCircle,
  XCircle,
  Upload,
  Image as ImageIcon,
} from "lucide-react";

const Dashboard = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formVisible, setFormVisible] = useState(false);
  const [editingProductId, setEditingProductId] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);

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

  useEffect(() => { fetchProducts(); }, []);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await axios.get("http://localhost:8000/api/products?_=" + Date.now(), { withCredentials: true });
      setProducts(res.data);
    } catch (err) {
      console.error("Erreur chargement produits:", err);
    } finally {
      setLoading(false);
    }
  };

  const getCsrfToken = () => decodeURIComponent(document.cookie.split("; ").find(row => row.startsWith("XSRF-TOKEN"))?.split("=")[1] || "");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.get("http://localhost:8000/sanctum/csrf-cookie", { withCredentials: true });
      const url = editingProductId ? `http://localhost:8000/api/products/${editingProductId}` : "http://localhost:8000/api/products";
      const headers = { "X-XSRF-TOKEN": getCsrfToken(), "Content-Type": "multipart/form-data" };
      const payload = new FormData();
      if (editingProductId) payload.append("_method", "PUT");
      Object.entries(form).forEach(([k, v]) => { if (k === "image" && v) payload.append("image", v); else if (k !== "image") payload.append(k, v); });

      await axios.post(url, payload, { headers, withCredentials: true });
      setToastMessage({ text: editingProductId ? "Produit mis à jour" : "Produit ajouté", type: "success" });
      setForm({ name: "", description: "", price: "", stock: "", promotion_percentage: "", promotion_start: "", promotion_end: "", image: null });
      setEditingProductId(null);
      setFormVisible(false);
      fetchProducts();
    } catch (err) {
      console.error("Erreur soumission:", err);
      setToastMessage({ text: "Erreur lors de la soumission", type: "error" });
    }
  };

  const handleEdit = (p) => {
    setForm({ name: p.name || "", description: p.description || "", price: p.price || "", stock: p.stock || "", promotion_percentage: p.promotion_percentage || "", promotion_start: p.promotion_start || "", promotion_end: p.promotion_end || "", image: null });
    setEditingProductId(p.id);
    setFormVisible(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Supprimer ce produit ?")) return;
    try {
      await axios.get("http://localhost:8000/sanctum/csrf-cookie", { withCredentials: true });
      await axios.delete(`http://localhost:8000/api/products/${id}`, { headers: { "X-XSRF-TOKEN": getCsrfToken() }, withCredentials: true });
      fetchProducts();
      setToastMessage({ text: "Produit supprimé", type: "success" });
    } catch (err) {
      console.error("Erreur suppression:", err);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-blue-50 to-indigo-100 p-6">
      {toastMessage && (
        <div className={`fixed top-6 right-6 px-6 py-4 rounded-xl shadow-lg z-50 transition-all duration-300 ${toastMessage.type === "success" ? "bg-green-500 text-white" : "bg-red-500 text-white"}`}>
          <div className="flex items-center gap-2">
            {toastMessage.type === "success" ? <CheckCircle size={20} /> : <XCircle size={20} />}
            {toastMessage.text}
          </div>
        </div>
      )}

      <div className="bg-white rounded-xl shadow-lg p-6 max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
            Liste des Produits ({products.length})
          </h2>
          <button onClick={() => { setFormVisible(!formVisible); setForm({ name: "", description: "", price: "", stock: "", promotion_percentage: "", promotion_start: "", promotion_end: "", image: null }); setEditingProductId(null); }}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl shadow hover:opacity-90">
            <Plus size={18} /> {formVisible ? "Fermer" : "Ajouter Produit"}
          </button>
        </div>

        {formVisible && (
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 bg-indigo-50 p-6 rounded-xl">
            <input type="text" placeholder="Nom" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required className="p-3 rounded-lg border" />
            <input type="number" placeholder="Prix" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} required className="p-3 rounded-lg border" />
            <textarea placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="p-3 rounded-lg border col-span-full" />
            <input type="number" placeholder="Stock" value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })} className="p-3 rounded-lg border" />
            <input type="number" placeholder="Promotion (%)" value={form.promotion_percentage} onChange={(e) => setForm({ ...form, promotion_percentage: e.target.value })} className="p-3 rounded-lg border" />
            <input type="date" value={form.promotion_start} onChange={(e) => setForm({ ...form, promotion_start: e.target.value })} className="p-3 rounded-lg border" />
            <input type="date" value={form.promotion_end} onChange={(e) => setForm({ ...form, promotion_end: e.target.value })} className="p-3 rounded-lg border" />
            <div className="border-2 border-dashed border-gray-300 p-4 rounded-xl col-span-full">
              <Upload className="text-gray-400 mb-2 mx-auto" size={28} />
              <input type="file" accept="image/*" onChange={(e) => setForm({ ...form, image: e.target.files[0] })} className="w-full" />
            </div>
            <button type="submit" className="col-span-full bg-green-600 text-white py-3 rounded-xl hover:bg-green-700 font-semibold">
              {editingProductId ? "Mettre à jour" : "Enregistrer"}
            </button>
          </form>
        )}

        {loading ? (
          <div className="flex justify-center py-8 text-indigo-600">
            <Loader className="animate-spin" size={32} />
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((p) => (
              <div key={p.id} className="bg-white border border-gray-100 rounded-xl shadow hover:shadow-lg transition-all duration-300 p-4">
                {p.image ? (
                  <img src={`http://localhost:8000/storage/${p.image}`} alt={p.name} className="w-full h-40 object-cover rounded mb-3" />
                ) : (
                  <div className="w-full h-40 bg-gray-100 flex items-center justify-center rounded mb-3">
                    <ImageIcon className="text-gray-400" size={40} />
                  </div>
                )}
                <h3 className="text-xl font-semibold text-gray-800 mb-1">{p.name}</h3>
                <p className="text-gray-500 text-sm mb-2 line-clamp-2">{p.description}</p>
                <div className="text-green-600 font-bold text-lg mb-1"><DollarSign size={16} className="inline" /> {parseFloat(p.price).toFixed(2)} DH</div>
                <div className="text-sm text-gray-500">Stock: {p.stock}</div>
                <div className="flex justify-end gap-4 mt-4">
                  <button onClick={() => handleEdit(p)} className="text-blue-600 hover:text-blue-800">
                    <Pencil size={18} />
                  </button>
                  <button onClick={() => handleDelete(p.id)} className="text-red-600 hover:text-red-800">
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;




