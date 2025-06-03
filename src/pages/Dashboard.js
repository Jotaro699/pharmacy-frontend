import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Plus,
  Loader,
  Trash2,
  Pencil,
  CheckCircle,
  XCircle,
  Image as ImageIcon,
  Search,
  X,
} from "lucide-react";

const Dashboard = () => {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [formVisible, setFormVisible] = useState(false);
  const [editingProductId, setEditingProductId] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);
  const [existingImage, setExistingImage] = useState("");
  const [showPromotionForm, setShowPromotionForm] = useState(false);

  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    stock: "",
    image: null,
  });

  const [promotionForm, setPromotionForm] = useState({
    percentage: "",
    start: "",
    end: "",
  });

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await axios.get("http://localhost:8000/api/products");
      setProducts(res.data);
    } catch (err) {
      console.error("Erreur chargement produits:", err);
    } finally {
      setLoading(false);
    }
  };

  const getCsrfToken = () =>
    decodeURIComponent(
      document.cookie
        .split("; ")
        .find((row) => row.startsWith("XSRF-TOKEN"))
        ?.split("=")[1] || ""
    );

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.get("http://localhost:8000/sanctum/csrf-cookie");

      const url = editingProductId
        ? `http://localhost:8000/api/products/${editingProductId}`
        : "http://localhost:8000/api/products";

      const headers = {
        "X-XSRF-TOKEN": getCsrfToken(),
        "Content-Type": "multipart/form-data",
      };

      const payload = new FormData();
      if (editingProductId) payload.append("_method", "PUT");
      Object.entries(form).forEach(([key, value]) => {
        if (key === "image") {
          if (value) payload.append("image", value);
        } else {
          payload.append(key, value);
        }
      });

      await axios.post(url, payload, { headers, withCredentials: true });

      setToastMessage({
        text: editingProductId ? "Produit mis à jour" : "Produit ajouté",
        type: "success",
      });

      resetForm();
      fetchProducts();
    } catch (err) {
      console.error("Erreur soumission:", err);
      setToastMessage({ text: "Erreur lors de la soumission", type: "error" });
    }
  };

  const submitPromotion = async () => {
    try {
      await axios.get("http://localhost:8000/sanctum/csrf-cookie");
      await axios.post(
        "http://localhost:8000/api/promotions",
        {
          produit_id: editingProductId,
          promotion_percentage: promotionForm.percentage,
          promotion_start: promotionForm.start,
          promotion_end: promotionForm.end,
        },
        {
          headers: { "X-XSRF-TOKEN": getCsrfToken() },
          withCredentials: true,
        }
      );

      setToastMessage({ text: "Promotion ajoutée", type: "success" });
      setPromotionForm({ percentage: "", start: "", end: "" });
      setShowPromotionForm(false);
    } catch (err) {
      console.error("Erreur ajout promotion:", err);
      setToastMessage({ text: "Erreur ajout promotion", type: "error" });
    }
  };

  const resetForm = () => {
    setForm({ name: "", description: "", price: "", stock: "", image: null });
    setExistingImage("");
    setEditingProductId(null);
    setFormVisible(false);
    setShowPromotionForm(false);
    setPromotionForm({ percentage: "", start: "", end: "" });
  };

  const handleEdit = (product) => {
    setForm({
      name: product.name,
      description: product.description,
      price: product.price,
      stock: product.stock,
      image: null,
    });
    setExistingImage(product.image);
    setEditingProductId(product.id);
    setFormVisible(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Supprimer ce produit ?")) return;
    try {
      await axios.get("http://localhost:8000/sanctum/csrf-cookie");
      await axios.delete(`http://localhost:8000/api/products/${id}`, {
        headers: { "X-XSRF-TOKEN": getCsrfToken() },
        withCredentials: true,
      });
      fetchProducts();
      setToastMessage({ text: "Produit supprimé", type: "success" });
    } catch (err) {
      console.error("Erreur suppression:", err);
    }
  };

  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-blue-50 to-indigo-100 p-6">
      {toastMessage && (
        <div
          className={`fixed top-6 right-6 px-4 py-3 rounded-xl shadow-lg z-50 transition-all duration-300 ${
            toastMessage.type === "success"
              ? "bg-green-500 text-white"
              : "bg-red-500 text-white"
          }`}
        >
          <div className="flex items-center gap-2">
            {toastMessage.type === "success" ? (
              <CheckCircle size={20} />
            ) : (
              <XCircle size={20} />
            )}
            {toastMessage.text}
          </div>
        </div>
      )}

      <div className="bg-white rounded-xl shadow-lg p-4 max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
            Produits ({filteredProducts.length})
          </h2>
          <button
            type="button"
            onClick={() => setFormVisible(true)}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded shadow hover:opacity-90"
          >
            <Plus size={18} /> Ajouter Produit
          </button>
        </div>

        <div className="mb-4">
          <div className="flex items-center gap-2 bg-gray-100 rounded-xl p-3 shadow-inner">
            <Search size={20} className="text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-transparent w-full focus:outline-none text-sm"
            />
          </div>
        </div>

        {formVisible && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-lg relative">
              <button
                onClick={() => setFormVisible(false)}
                className="absolute top-2 right-2 text-gray-500 hover:text-red-500"
              >
                <X size={20} />
              </button>
              <h3 className="text-xl font-bold mb-4">
                {editingProductId ? "Modifier le produit" : "Ajouter un produit"}
              </h3>
              <form onSubmit={handleSubmit} className="space-y-4">
                <input
                  type="text"
                  placeholder="Nom"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full border px-3 py-2 rounded"
                  required
                />
                <textarea
                  placeholder="Description"
                  value={form.description}
                  onChange={(e) =>
                    setForm({ ...form, description: e.target.value })
                  }
                  className="w-full border px-3 py-2 rounded"
                />
                <div className="grid grid-cols-2 gap-4">
                  <input
                    type="number"
                    placeholder="Prix"
                    value={form.price}
                    onChange={(e) =>
                      setForm({ ...form, price: e.target.value })
                    }
                    className="border px-3 py-2 rounded"
                    required
                  />
                  <input
                    type="number"
                    placeholder="Stock"
                    value={form.stock}
                    onChange={(e) =>
                      setForm({ ...form, stock: e.target.value })
                    }
                    className="border px-3 py-2 rounded"
                  />
                </div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) =>
                    setForm({ ...form, image: e.target.files[0] })
                  }
                  className="w-full"
                />

                {editingProductId && (
                  <>
                    <button
                      type="button"
                      onClick={() => setShowPromotionForm(true)}
                      className="text-indigo-600 text-sm hover:underline"
                    >
                      Gérer la promotion
                    </button>
                    {showPromotionForm && (
                      <div className="mt-4 bg-gray-50 p-4 rounded shadow">
                        <h4 className="text-sm font-semibold mb-2">
                          Ajouter une promotion
                        </h4>
                        <div className="grid grid-cols-2 gap-4">
                          <input
                            type="number"
                            placeholder="Promotion (%)"
                            value={promotionForm.percentage}
                            onChange={(e) =>
                              setPromotionForm({
                                ...promotionForm,
                                percentage: e.target.value,
                              })
                            }
                            className="border px-3 py-2 rounded"
                          />
                          <input
                            type="date"
                            value={promotionForm.start}
                            onChange={(e) =>
                              setPromotionForm({
                                ...promotionForm,
                                start: e.target.value,
                              })
                            }
                            className="border px-3 py-2 rounded"
                          />
                          <input
                            type="date"
                            value={promotionForm.end}
                            onChange={(e) =>
                              setPromotionForm({
                                ...promotionForm,
                                end: e.target.value,
                              })
                            }
                            className="border px-3 py-2 rounded"
                          />
                        </div>
                        <button
                          type="button"
                          onClick={submitPromotion}
                          className="mt-3 bg-indigo-600 text-white py-1 px-4 rounded hover:bg-indigo-700"
                        >
                          Enregistrer Promotion
                        </button>
                      </div>
                    )}
                  </>
                )}

                <button
                  type="submit"
                  className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
                >
                  {editingProductId ? "Modifier" : "Ajouter"}
                </button>
              </form>
            </div>
          </div>
        )}

        {loading ? (
          <div className="flex justify-center py-8 text-indigo-600">
            <Loader className="animate-spin" size={32} />
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {filteredProducts.map((p) => (
              <div
                key={p.id}
                className="bg-white border border-gray-100 rounded-lg shadow hover:shadow-md transition p-3"
              >
                {p.image ? (
                  <img
                    src={`http://localhost:8000/storage/${p.image}`}
                    alt={p.name}
                    className="w-full h-32 object-cover rounded mb-2"
                  />
                ) : (
                  <div className="w-full h-32 bg-gray-100 flex items-center justify-center rounded mb-2">
                    <ImageIcon className="text-gray-400" size={32} />
                  </div>
                )}
                <h3 className="text-base font-semibold text-gray-800 mb-1">
                  {p.name}
                </h3>
                <p className="text-sm text-gray-500 line-clamp-2">
                  {p.description}
                </p>
                <div className="text-green-600 font-bold text-sm mb-1">
                  {parseFloat(p.price).toFixed(2)} DH
                </div>
                <div className="text-xs text-gray-500">Stock: {p.stock}</div>
                <div className="flex justify-end gap-2 mt-2 text-sm">
                  <button
                    onClick={() => handleEdit(p)}
                    className="text-blue-600 hover:underline"
                  >
                    <Pencil size={16} />
                  </button>
                  <button
                    onClick={() => handleDelete(p.id)}
                    className="text-red-600 hover:underline"
                  >
                    <Trash2 size={16} />
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
