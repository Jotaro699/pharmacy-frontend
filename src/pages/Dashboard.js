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
  useEffect(() => {
    if (toastMessage) {
      const timer = setTimeout(() => {
        setToastMessage(null);
      }, 3000); 
      return () => clearTimeout(timer);
    }
  }, [toastMessage]);
  
  const [existingImage, setExistingImage] = useState("");
  const [showPromotionForm, setShowPromotionForm] = useState(false);
  const [promotionProductId, setPromotionProductId] = useState(null);
  const [showQuickPromotionForm, setShowQuickPromotionForm] = useState(false);


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
  const loadPromotionIfExists = async (productId) => {
    try {
      const res = await axios.get(
        `http://localhost:8000/api/promotions/${productId}`
      );
      const promo = res.data;

      setPromotionForm({
        percentage: promo.promotion_percentage || "",
        start: promo.promotion_start || "",
        end: promo.promotion_end || "",
      });
    } catch (err) {
      setPromotionForm({ percentage: "", start: "", end: "" });
    }
  };
  
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
            onClick={() => {
              setFormVisible(true);
              setForm({
                name: "",
                description: "",
                price: "",
                stock: "",
                image: null,
              });
              setExistingImage("");
              setEditingProductId(null);
              setShowPromotionForm(false);
            }}
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
            <div className="bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100 rounded-xl shadow-xl w-[90%] max-w-md max-h-[90vh] overflow-y-auto relative p-6">
              <button
                onClick={() => setFormVisible(false)}
                className="absolute top-4 right-4 text-gray-400 hover:text-red-500 transition"
              >
                <X size={22} />
              </button>

              <h3 className="text-2xl font-bold mb-6 text-center text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
                {editingProductId
                  ? "Modifier le produit"
                  : "Ajouter un produit"}
              </h3>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-sm font-medium mb-1">Nom</label>
                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="Nom du produit"
                    required
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    Description
                  </label>
                  <textarea
                    value={form.description}
                    onChange={(e) =>
                      setForm({ ...form, description: e.target.value })
                    }
                    placeholder="Brève description"
                    rows={3}
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Prix (DH)
                    </label>
                    <input
                      type="number"
                      value={form.price}
                      onChange={(e) =>
                        setForm({ ...form, price: e.target.value })
                      }
                      placeholder="0.00"
                      required
                      className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Stock
                    </label>
                    <input
                      type="number"
                      value={form.stock}
                      onChange={(e) =>
                        setForm({ ...form, stock: e.target.value })
                      }
                      placeholder="Quantité"
                      className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    Image
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) =>
                      setForm({ ...form, image: e.target.files[0] })
                    }
                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:border-0 file:rounded-md file:bg-blue-600 file:text-white hover:file:bg-blue-700"
                  />
                </div>

                {existingImage && (
                  <img
                    src={`http://localhost:8000/storage/${existingImage}`}
                    alt="Image actuelle"
                    className="w-full h-32 object-cover rounded-md shadow mt-2"
                  />
                )}

                {editingProductId && (
                  <>
                    <button
                      type="button"
                      onClick={() => setShowPromotionForm(!showPromotionForm)}
                      className="text-sm text-indigo-600 hover:underline"
                    >
                      {showPromotionForm
                        ? "Masquer la promotion"
                        : "Ajouter une promotion"}
                    </button>

                    {showPromotionForm && (
                      <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg mt-3 space-y-3 shadow">
                        <h4 className="text-sm font-semibold mb-1">
                          Promotion
                        </h4>
                        <input
                          type="number"
                          placeholder="Pourcentage (%)"
                          value={promotionForm.percentage}
                          onChange={(e) =>
                            setPromotionForm({
                              ...promotionForm,
                              percentage: e.target.value,
                            })
                          }
                          className="w-full px-3 py-2 border rounded"
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
                          className="w-full px-3 py-2 border rounded"
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
                          className="w-full px-3 py-2 border rounded"
                        />
                        <button
                          type="button"
                          onClick={submitPromotion}
                          className="bg-indigo-600 text-white py-1 px-4 rounded hover:bg-indigo-700 transition"
                        >
                          Enregistrer la promotion
                        </button>
                      </div>
                    )}
                  </>
                )}

                <button
                  type="submit"
                  className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-green-500 to-green-600 hover:opacity-90 text-white font-semibold py-2.5 px-4 rounded-lg shadow transition"
                >
                  {editingProductId
                    ? "Modifier le produit"
                    : "Ajouter le produit"}
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
                  <div className="flex justify-end gap-2 mt-3">
                    <button
                      onClick={() => handleEdit(p)}
                      className="p-2 bg-blue-100 text-blue-600 hover:bg-blue-200 rounded-full shadow transition"
                      title="Modifier"
                    >
                      <Pencil size={16} />
                    </button>
                    <button
                      onClick={() => handleDelete(p.id)}
                      className="p-2 bg-red-100 text-red-600 hover:bg-red-200 rounded-full shadow transition"
                      title="Supprimer"
                    >
                      <Trash2 size={16} />
                    </button>
                    <button
                      onClick={async () => {
                        setPromotionProductId(p.id);
                        await loadPromotionIfExists(p.id); 
                        setShowQuickPromotionForm(true);
                      }}
                      className="p-2 bg-indigo-100 text-indigo-600 hover:bg-indigo-200 rounded-full shadow transition"
                      title="Ajouter une promotion"
                    >
                      %
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      {showQuickPromotionForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
          <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-md relative">
            <button
              onClick={() => {
                setShowQuickPromotionForm(false);
                setPromotionProductId(null);
                setPromotionForm({ percentage: "", start: "", end: "" });
              }}
              className="absolute top-3 right-3 text-gray-400 hover:text-red-500"
            >
              <X size={20} />
            </button>
            <h3 className="text-lg font-semibold mb-4 text-indigo-600">
              Ajouter une promotion
            </h3>
            <div className="space-y-3">
              <input
                type="number"
                placeholder="Pourcentage (%)"
                value={promotionForm.percentage}
                onChange={(e) =>
                  setPromotionForm({
                    ...promotionForm,
                    percentage: e.target.value,
                  })
                }
                className="w-full px-3 py-2 border rounded"
              />
              <input
                type="date"
                value={promotionForm.start}
                onChange={(e) =>
                  setPromotionForm({ ...promotionForm, start: e.target.value })
                }
                className="w-full px-3 py-2 border rounded"
              />
              <input
                type="date"
                value={promotionForm.end}
                onChange={(e) =>
                  setPromotionForm({ ...promotionForm, end: e.target.value })
                }
                className="w-full px-3 py-2 border rounded"
              />
              <button
                onClick={async () => {
                  try {
                    await axios.get(
                      "http://localhost:8000/sanctum/csrf-cookie"
                    );
                    await axios.post(
                      "http://localhost:8000/api/promotions",
                      {
                        produit_id: promotionProductId,
                        promotion_percentage: promotionForm.percentage,
                        promotion_start: promotionForm.start,
                        promotion_end: promotionForm.end,
                      },
                      {
                        headers: { "X-XSRF-TOKEN": getCsrfToken() },
                        withCredentials: true,
                      }
                    );
                    setToastMessage({
                      text: "Promotion ajoutée",
                      type: "success",
                    });
                    setShowQuickPromotionForm(false);
                    setPromotionProductId(null);
                    setPromotionForm({ percentage: "", start: "", end: "" });
                  } catch (err) {
                    console.error(err);
                    setToastMessage({
                      text: "Erreur ajout promotion",
                      type: "error",
                    });
                  }
                }}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded"
              >
                Enregistrer la promotion
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
