import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Pencil,
  Trash2,
  Save,
  X,
  Plus,
  Clock,
  Image as ImageIcon,
  CheckCircle,
  XCircle,
} from "lucide-react";

axios.defaults.baseURL = "http://localhost:8000";
axios.defaults.withCredentials = true;

const GestionServices = () => {
  const [services, setServices] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [existingImage, setExistingImage] = useState("");

  const [editForm, setEditForm] = useState({
    nom: "",
    description: "",
    duree: "",
    prix: "",
    image: null,
  });
  const [newForm, setNewForm] = useState({
    nom: "",
    description: "",
    duree: "",
    prix: "",
    image: null,
    disponibilite: true,
  });

  const showToast = (text, type = "success") => {
    setToastMessage({ text, type });
    setTimeout(() => setToastMessage(null), 3000);
  };

  const fetchServices = async () => {
    const res = await axios.get("/api/services");
    setServices(res.data);
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("❗ Voulez-vous vraiment supprimer ce service ?"))
      return;

    await axios.get("/sanctum/csrf-cookie"); 

    const token = decodeURIComponent(
      document.cookie
        .split("; ")
        .find((row) => row.startsWith("XSRF-TOKEN"))
        .split("=")[1]
    );

    await axios.delete(`/api/services/${id}`, {
      headers: {
        "X-XSRF-TOKEN": token,
      },
    });

    showToast("🗑️ Service supprimé avec succès");
    fetchServices();
  };
  

  const startEditing = (s) => {
    setEditingId(s.id);
    setEditForm({
      nom: s.nom,
      description: s.description,
      duree: s.duree,
      prix: s.prix,
      image: null,
    });
    setExistingImage(s.image);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditForm({ nom: "", description: "", duree: "", prix: "", image: null });
    setExistingImage("");
  };

  const handleEditChange = (e) => {
    const { name, value, type, files } = e.target;
    setEditForm({ ...editForm, [name]: type === "file" ? files[0] : value });
  };

  const handleNewChange = (e) => {
    const { name, value, type, files, checked } = e.target;
    setNewForm({
      ...newForm,
      [name]:
        type === "file" ? files[0] : type === "checkbox" ? checked : value,
    });
  };

  const saveEdit = async (id) => {
    const formData = new FormData();
    Object.entries(editForm).forEach(([key, value]) => {
      if (key === "image" && !value) return;
      formData.append(key, value);
    });
    await axios.get("/sanctum/csrf-cookie");
    const token = decodeURIComponent(
      document.cookie
        .split("; ")
        .find((row) => row.startsWith("XSRF-TOKEN"))
        .split("=")[1]
    );
    await axios.post(`/api/services/${id}?_method=PUT`, formData, {
      headers: { "Content-Type": "multipart/form-data", "X-XSRF-TOKEN": token },
    });
    showToast("✅ Service modifié avec succès");
    cancelEdit();
    fetchServices();
  };

  const handleNewSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    Object.keys(newForm).forEach((key) =>
      formData.append(
        key,
        key === "disponibilite" ? (newForm[key] ? "1" : "0") : newForm[key]
      )
    );
    await axios.get("/sanctum/csrf-cookie");
    const token = decodeURIComponent(
      document.cookie
        .split("; ")
        .find((row) => row.startsWith("XSRF-TOKEN"))
        .split("=")[1]
    );
    await axios.post("/api/services", formData, {
      headers: { "Content-Type": "multipart/form-data", "X-XSRF-TOKEN": token },
    });
    showToast("✅ Service ajouté avec succès");
    setNewForm({
      nom: "",
      description: "",
      duree: "",
      prix: "",
      image: null,
      disponibilite: true,
    });
    setShowForm(false);
    fetchServices();
  };

  const filteredServices = services.filter((s) =>
    s.nom.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-blue-50 to-indigo-100 p-6 text-gray-800">
      {toastMessage && (
        <div
          className={`fixed top-6 right-6 px-4 py-3 rounded-xl shadow-lg z-50 transition-all ${
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

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
          Gestion des Services
        </h1>
        <button
          onClick={() => setShowForm(true)}
          className="bg-gradient-to-r from-blue-600 to-purple-600 hover:opacity-90 text-white px-6 py-3 rounded-lg shadow"
        >
          <Plus size={18} className="inline mr-2" /> Ajouter
        </button>
      </div>

      <input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="🔍 Chercher un service..."
        className="mb-6 w-full border px-4 py-2 rounded shadow-sm focus:ring-2 focus:ring-blue-500"
      />

      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-lg relative">
            <button
              onClick={() => setShowForm(false)}
              className="absolute top-2 right-2 text-gray-500 hover:text-red-500"
            >
              <X size={20} />
            </button>
            <h3 className="text-lg font-bold mb-4">
              Ajouter un nouveau service
            </h3>
            <form onSubmit={handleNewSubmit} className="space-y-4">
              <input
                name="nom"
                value={newForm.nom}
                onChange={handleNewChange}
                placeholder="Nom du service"
                className="w-full border px-3 py-2 rounded"
              />
              <textarea
                name="description"
                value={newForm.description}
                onChange={handleNewChange}
                placeholder="Description"
                className="w-full border px-3 py-2 rounded"
              />
              <input
                name="duree"
                value={newForm.duree}
                onChange={handleNewChange}
                placeholder="Durée"
                className="w-full border px-3 py-2 rounded"
              />
              <input
                type="number"
                name="prix"
                value={newForm.prix}
                onChange={handleNewChange}
                placeholder="Prix"
                className="w-full border px-3 py-2 rounded"
              />
              <input
                type="file"
                name="image"
                accept="image/*"
                onChange={handleNewChange}
                className="w-full"
              />
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  name="disponibilite"
                  checked={newForm.disponibilite}
                  onChange={handleNewChange}
                />{" "}
                Disponible
              </label>
              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
              >
                Ajouter
              </button>
            </form>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {filteredServices.map((s) => (
          <div
            key={s.id}
            className="bg-white rounded-lg shadow p-4 transition-transform duration-300 hover:scale-105 hover:shadow-lg"
          >
            {editingId === s.id ? (
              <>
                <input
                  name="nom"
                  value={editForm.nom}
                  onChange={handleEditChange}
                  className="w-full border mb-2 px-2 py-1 rounded"
                />
                <textarea
                  name="description"
                  value={editForm.description}
                  onChange={handleEditChange}
                  className="w-full border mb-2 px-2 py-1 rounded"
                />
                <input
                  name="duree"
                  value={editForm.duree}
                  onChange={handleEditChange}
                  className="w-full border mb-2 px-2 py-1 rounded"
                />
                <input
                  name="prix"
                  value={editForm.prix}
                  onChange={handleEditChange}
                  className="w-full border mb-2 px-2 py-1 rounded"
                />
                <input
                  type="file"
                  name="image"
                  onChange={handleEditChange}
                  className="w-full mb-2"
                />
                {existingImage && !editForm.image && (
                  <img
                    src={`http://localhost:8000/storage/${existingImage}`}
                    alt="actuelle"
                    className="w-full h-32 object-cover rounded mb-2"
                  />
                )}
                <div className="flex gap-3">
                  <button
                    onClick={() => saveEdit(s.id)}
                    className="flex items-center text-green-600 hover:underline"
                  >
                    <Save size={16} className="mr-1" /> Save
                  </button>
                  <button
                    onClick={cancelEdit}
                    className="flex items-center text-gray-500 hover:underline"
                  >
                    <X size={16} className="mr-1" /> Cancel
                  </button>
                </div>
              </>
            ) : (
              <>
                {s.image && (
                  <img
                    src={`http://localhost:8000/storage/${s.image}`}
                    alt={s.nom}
                    className="w-full h-32 object-cover rounded mb-3"
                  />
                )}
                <h3 className="font-bold text-lg">{s.nom}</h3>
                <p className="text-sm text-gray-600 mb-2">{s.description}</p>
                <p className="text-sm">
                  <Clock size={14} className="inline" /> {s.duree}
                </p>
                <p className="text-sm font-semibold text-green-600">
                  {parseFloat(s.prix).toFixed(2)} DH
                </p>
                <div className="flex items-center gap-4 mt-3 text-sm">
                  <button
                    onClick={() => startEditing(s)}
                    className="flex items-center text-blue-600 hover:underline"
                  >
                    <Pencil size={16} className="mr-1" /> Edit
                  </button>
                  <button
                    onClick={() => handleDelete(s.id)}
                    className="flex items-center text-red-600 hover:underline"
                  >
                    <Trash2 size={16} className="mr-1" /> Delete
                  </button>
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default GestionServices;

