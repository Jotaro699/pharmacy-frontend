import React, { useEffect, useState } from "react";
import logo from "../assets/logo.png";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import {
  Clock,
  LayoutGrid,
  Monitor,
  HeartPulse,
  Shield,
  Sparkles,
} from "lucide-react";

const Display = () => {
  const [promotions, setPromotions] = useState([]);

  const [products, setProducts] = useState([]);
  const [services, setServices] = useState([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [mode, setMode] = useState("slideshow");
  const [clock, setClock] = useState({ time: "", date: "" });
  const [slides, setSlides] = useState([]);
  const navigate = useNavigate();


  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "ArrowLeft") {
        navigate("/dashboard");
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);
  useEffect(() => {
    axios
      .get("http://localhost:8000/api/products")
      .then((res) => setProducts(res.data))
      .catch((err) => console.error("Erreur chargement produits:", err));
      axios
        .get("http://localhost:8000/api/promotions")
        .then((res) => setPromotions(res.data))
        .catch((err) => console.error("Erreur chargement promotions:", err));
    
  }, []);

  useEffect(() => {
    setClock(updateClock());
    const interval = setInterval(() => setClock(updateClock()), 1000);
    return () => clearInterval(interval);
  }, []);

  const updateClock = () => {
    const now = new Date();
    const dateFr = now.toLocaleDateString("fr-FR", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    });
    const dateAr = now.toLocaleDateString("ar-MA", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    });
    return { time: now.toLocaleTimeString(), date: `${dateFr} / ${dateAr}` };
  };

  useEffect(() => {
    const timer = setInterval(() => {
      if (mode === "slideshow" && slides.length > 0) {
        setCurrentSlide((prev) => (prev + 1) % slides.length);
      }
    }, 8000);
    return () => clearInterval(timer);
  }, [mode, slides]);
  
  
  useEffect(() => {
    axios
      .get("http://localhost:8000/api/products")
      .then((res) => setProducts(res.data))
      .catch((err) => console.error("Erreur chargement produits:", err));

    axios
      .get("http://localhost:8000/api/services")
      .then((res) => setServices(res.data))
      .catch((err) => console.error("Erreur chargement services:", err));
  }, []);
  useEffect(() => {
    if (products.length > 0 || services.length > 0) {
      setSlides([...products, ...services]);
    }
  }, [products, services]);
  
  
  return (
    <div className="fixed inset-0 flex flex-col bg-gradient-to-b from-green-800 to-emerald-700 text-white font-sans">
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(12)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-emerald-400/10"
            style={{
              width: `${Math.random() * 100 + 50}px`,
              height: `${Math.random() * 100 + 50}px`,
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              transform: `rotate(${Math.random() * 360}deg)`,
              animation: `float ${Math.random() * 10 + 10}s linear infinite`,
            }}
          />
        ))}
      </div>
      <div className="absolute top-0 left-0 right-0 z-50 px-4 py-2 bg-gradient-to-r from-green-900/90 to-emerald-800/90 backdrop-blur-md flex justify-between items-center border-b border-emerald-400/20 shadow-md text-sm">
        <div className="flex items-center gap-3">
          <img
            src={logo}
            alt="logo"
            className="h-12 w-auto rounded-xl shadow-lg border-2 border-emerald-500 bg-white p-1"
          />
          <div className="relative">
            <HeartPulse size={24} className="text-emerald-300 animate-pulse" />
            <Shield
              size={14}
              className="absolute -right-1 -bottom-1 text-white bg-emerald-600 rounded-full p-0.5"
            />
          </div>
          <span className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-200 to-white">
            Para M3A Pharma
          </span>
        </div>
        <button
          onClick={() => setMode(mode === "slideshow" ? "grid" : "slideshow")}
          className="flex items-center gap-2 px-3 py-1 text-xs font-semibold text-white bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 rounded-full shadow-md transition-all duration-300 hover:shadow-emerald-500/30"
        >
          {mode === "slideshow" ? (
            <LayoutGrid size={14} />
          ) : (
            <Monitor size={14} />
          )}
          {mode === "slideshow" ? "Catalogue" : "Présentation"}
        </button>
        <div className="text-right">
          <div className="flex items-center gap-1 text-sm">
            <Clock size={16} className="text-emerald-300" />
            <span>{clock.time}</span>
          </div>
          <div className="text-xs text-emerald-200/80">{clock.date}</div>
        </div>
      </div>
      {mode === "slideshow" && (
        <div className="flex-1 flex items-center justify-center px-6 pt-24 pb-28">
          {slides.map((item, index) => {
            const nom = item.name || item.nom;
            const prix = item.price !== undefined ? item.price : item.prix;

            return (
              <div
                key={item.id}
                className={`absolute inset-0 flex flex-col md:flex-row items-center justify-center gap-8 p-4 transition-opacity duration-1000 ease-in-out ${
                  index === currentSlide
                    ? "opacity-100"
                    : "opacity-0 pointer-events-none"
                }`}
              >
                <div className="w-full md:w-2/3 h-[80vh] flex items-center justify-center">
                  <img
                    src={`http://localhost:8000/storage/${item.image}`}
                    alt={nom}
                    className="h-[80vh] w-auto object-contain rounded-3xl shadow-2xl border-2 border-emerald-500/30 bg-white p-6"
                  />
                </div>
                <div className="w-full md:w-1/3 flex flex-col justify-center">
                  <div className="relative bg-gradient-to-br from-white to-emerald-50 rounded-2xl shadow-xl overflow-hidden border border-emerald-200 p-4 space-y-4 max-w-md transition-all duration-300 hover:scale-105 hover:shadow-emerald-300/30">
                    <h1 className="text-2xl font-bold text-emerald-900 flex items-center gap-2">
                      <Sparkles size={18} className="text-green-600" />
                      {nom}
                    </h1>

                    <p className="text-emerald-700 leading-relaxed text-sm italic border-l-4 border-emerald-300 pl-4">
                      {item.description}
                    </p>

                    {prix !== undefined && (
                      <div className="bg-gradient-to-r from-green-100 to-emerald-100 rounded-2xl p-4 text-right">
                        <span className="text-sm text-emerald-600 block">
                          Prix
                        </span>
                        <span className="text-2xl font-bold text-emerald-800">
                          {Number(prix).toFixed(2)}{" "}
                          <span className="text-base text-emerald-600">DH</span>
                        </span>
                      </div>
                    )}

                    <div className="text-center pt-2 text-sm text-emerald-600 font-medium">
                      {item.promotion_percentage !== undefined
                        ? "Produit disponible en pharmacie"
                        : "Service offert par notre équipe"}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {mode === "grid" && (
        <div className="pt-24 pb-32 px-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
          {slides.map((item) => {
            const nom = item.name || item.nom;
            const prix = item.price !== undefined ? item.price : item.prix;

            return (
              <div
                key={item.id}
                className="bg-white rounded-xl shadow-lg overflow-hidden transition-transform duration-300 hover:scale-105"
              >
                <img
                  src={`http://localhost:8000/storage/${item.image}`}
                  alt={nom}
                  className="h-48 w-full object-cover"
                />
                <div className="p-4">
                  <h2 className="text-lg font-bold text-emerald-800">{nom}</h2>
                  <p className="text-sm text-gray-600 line-clamp-2">
                    {item.description}
                  </p>
                  {prix !== undefined && (
                    <div className="mt-2 text-emerald-600 font-semibold">
                      {parseFloat(prix).toFixed(2)} DH
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
      <footer className="fixed bottom-0 left-0 right-0 bg-gradient-to-r from-green-900 via-emerald-900 to-green-900 text-white py-2 px-4 border-t border-green-500/40 shadow-md z-50 backdrop-blur-sm text-xs">
        <div className="overflow-hidden relative">
          <div className="absolute left-0 top-0 bottom-0 w-6 bg-gradient-to-r from-green-900 to-transparent z-10 pointer-events-none"></div>
          <div className="absolute right-0 top-0 bottom-0 w-6 bg-gradient-to-l from-green-900 to-transparent z-10 pointer-events-none"></div>
          <div className="animate-slide whitespace-nowrap flex items-center gap-4 py-1">
            {promotions.map((promo) => {
              const product = products.find((p) => p.id === promo.produit_id);
              if (!product) return null;

              return (
                <div
                  key={promo.id}
                  className="flex items-center gap-3 bg-gradient-to-r from-green-800/50 to-emerald-800/50 px-3 py-1.5 rounded-xl shadow border border-green-400/40 hover:border-green-300/60 transition-all duration-300 hover:scale-105 cursor-pointer backdrop-blur-sm"
                >
                  <img
                    src={`http://localhost:8000/storage/${product.image}`}
                    alt={product.name}
                    className="h-10 w-10 rounded-lg object-cover border-2 border-white/80 shadow-md"
                  />
                  <div className="min-w-0">
                    <p className="font-semibold text-white text-xs truncate w-32 mb-1">
                      {product.name}
                    </p>
                    <div className="flex items-center gap-2">
                      <span className="line-through text-xs text-red-300/80">
                        {Number(product.price).toFixed(2)} DH
                      </span>
                      <span className="font-bold text-emerald-200 text-xs">
                        {(
                          Number(product.price) -
                          (Number(product.price) * promo.promotion_percentage) /
                            100
                        ).toFixed(2)}{" "}
                        DH
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </footer>
      <style>{`
  @keyframes slide {
    0% { transform: translateX(100%); }
    100% { transform: translateX(-100%); }
  }

  .animate-slide {
    animation: slide ${promotions.length * 8}s linear infinite;
    transition: transform 0.3s ease-in-out;
  }

  .animate-slide:hover {
    animation-play-state: paused;
    
  }
`}</style>
    </div>
  );
};

export default Display;
