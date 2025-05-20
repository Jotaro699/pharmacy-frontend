// import React, { useEffect, useState } from "react";
// import { FaTags, FaInfoCircle, FaCreditCard } from "react-icons/fa";
// import axios from "axios";

// function ProductDisplay() {
//   const [products, setProducts] = useState([]);
//   const [current, setCurrent] = useState(0);
//   const [mode, setMode] = useState("slideshow");

//   useEffect(() => {
//     axios
//       .get("http://localhost:8000/api/products")
//       .then((res) => setProducts(res.data))
//       .catch((err) => console.error("Erreur produits", err));
//   }, []);

//   useEffect(() => {
//     const interval = setInterval(() => {
//       if (mode === "slideshow" && products.length) {
//         setCurrent((prev) => (prev + 1) % products.length);
//       }
//     }, 15000);
//     return () => clearInterval(interval);
//   }, [mode, products]);

//   const now = new Date();
//   const time = now.toLocaleTimeString();
//   const date = now.toLocaleDateString("fr-FR", {
//     weekday: "long",
//     year: "numeric",
//     month: "long",
//     day: "numeric",
//   });

//   return (
//     <div className="relative w-screen h-screen bg-black font-sans text-white overflow-hidden">
//       <button
//         onClick={() => setMode(mode === "slideshow" ? "grid" : "slideshow")}
//         className="absolute top-4 left-4 bg-cyan-400 text-black px-4 py-2 font-bold rounded"
//       >
//         {mode === "slideshow" ? "Mode Grille" : "Mode Diaporama"}
//       </button>

//       <div className="absolute top-4 right-4 text-sm">{time}</div>
//       <div className="absolute bottom-4 left-4 text-sm">{date}</div>

//       {mode === "slideshow" && products.length > 0 && (
//         <div
//           className="w-full h-full bg-cover bg-center flex items-center justify-center"
//           style={{
//             backgroundImage: `url(http://localhost:8000/storage/${products[current].image})`,
//           }}
//         >
//           <div className="bg-black bg-opacity-60 p-6 rounded-xl text-center max-w-xl">
//             <h1 className="text-4xl font-bold mb-2 flex justify-center items-center gap-2">
//               <FaTags /> {products[current].name}
//             </h1>
//             <p className="text-lg mb-4 flex items-center justify-center gap-2">
//               <FaInfoCircle />
//               {products[current].description}
//             </p>
//             <p className="text-3xl text-cyan-400 flex items-center justify-center gap-2 font-bold">
//               <FaCreditCard />
//               {products[current].price} DH
//             </p>
//           </div>
//         </div>
//       )}

//       {mode === "grid" && (
//         <div className="flex flex-wrap justify-center items-center h-full p-6 gap-4 overflow-auto">
//           {products.map((product) => (
//             <div
//               key={product.id}
//               className="w-80 h-96 bg-cover bg-center rounded-xl relative"
//               style={{
//                 backgroundImage: `url(http://localhost:8000/storage/${product.image})`,
//               }}
//             >
//               <div className="absolute inset-0 bg-black bg-opacity-60 flex flex-col items-center justify-center text-center p-4 rounded-xl">
//                 <h2 className="text-2xl font-bold mb-2">{product.name}</h2>
//                 <p className="text-sm mb-2">{product.description}</p>
//                 <p className="text-xl text-cyan-400 font-bold">
//                   {product.price} DH
//                 </p>
//               </div>
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// }

// export default ProductDisplay;

// ---- best deisgn 
// import React, { useEffect, useState, useCallback } from "react";
// import axios from "axios";
// import {
//   Clock,
//   Tag,
//   Info,
//   CreditCard,
//   LayoutGrid,
//   Monitor,
//   ArrowLeft,
//   ArrowRight,
//   ShoppingCart,
// } from "lucide-react";
// import { motion, AnimatePresence } from "framer-motion";

// const Display = () => {
//   const [products, setProducts] = useState([]);
//   const [currentSlide, setCurrentSlide] = useState(0);
//   const [mode, setMode] = useState("slideshow");
//   const [clock, setClock] = useState({ time: "", date: "" });
//   const [isLoading, setIsLoading] = useState(true);
//   const [isHovering, setIsHovering] = useState(false);

//   // ✅ Fetch products from Laravel
//   useEffect(() => {
//     const fetchProducts = async () => {
//       try {
//         setIsLoading(true);
//         const res = await axios.get("http://localhost:8000/api/products");
//         setProducts(res.data);
//       } catch (err) {
//         console.error("Error loading products:", err);
//       } finally {
//         setIsLoading(false);
//       }
//     };
//     fetchProducts();
//   }, []);

//   // ✅ Clock update
//   useEffect(() => {
//     const updateClock = () => {
//       const now = new Date();
//       const dateFr = now.toLocaleDateString("fr-FR", {
//         weekday: "long",
//         day: "numeric",
//         month: "long",
//         year: "numeric",
//       });
//       const dateAr = now.toLocaleDateString("ar-MA", {
//         weekday: "long",
//         day: "numeric",
//         month: "long",
//         year: "numeric",
//       });
//       return {
//         time: now.toLocaleTimeString(),
//         date: `${dateFr} / ${dateAr}`,
//       };
//     };

//     setClock(updateClock());
//     const interval = setInterval(() => setClock(updateClock()), 1000);
//     return () => clearInterval(interval);
//   }, []);

//   // ✅ Slideshow auto-advance
//   useEffect(() => {
//     const timer = setInterval(() => {
//       if (mode === "slideshow" && products.length > 0 && !isHovering) {
//         setCurrentSlide((prev) => (prev + 1) % products.length);
//       }
//     }, 10000);
//     return () => clearInterval(timer);
//   }, [mode, products, isHovering]);

//   const goToNextSlide = useCallback(() => {
//     setCurrentSlide((prev) => (prev + 1) % products.length);
//   }, [products.length]);

//   const goToPrevSlide = useCallback(() => {
//     setCurrentSlide((prev) => (prev - 1 + products.length) % products.length);
//   }, [products.length]);

//   // Keyboard navigation
//   useEffect(() => {
//     const handleKeyDown = (e) => {
//       if (mode === "slideshow") {
//         if (e.key === "ArrowRight") goToNextSlide();
//         if (e.key === "ArrowLeft") goToPrevSlide();
//       }
//     };
//     window.addEventListener("keydown", handleKeyDown);
//     return () => window.removeEventListener("keydown", handleKeyDown);
//   }, [goToNextSlide, goToPrevSlide, mode]);

//   if (isLoading) {
//     return (
//       <div className="bg-gradient-to-br from-slate-900 to-slate-800 w-screen h-screen flex items-center justify-center">
//         <div className="text-center">
//           <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-cyan-500 mx-auto mb-4"></div>
//           <p className="text-cyan-400 text-xl font-medium">
//             Chargement des produits...
//           </p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div
//       className="bg-gradient-to-br from-slate-900 to-slate-800 text-white w-screen h-screen font-sans relative overflow-hidden"
//       onMouseEnter={() => setIsHovering(true)}
//       onMouseLeave={() => setIsHovering(false)}
//     >
//       {/* Header */}
//       <motion.header
//         className="absolute top-0 left-0 right-0 bg-black bg-opacity-50 backdrop-blur-sm p-4 flex justify-between items-center z-50"
//         initial={{ y: -100 }}
//         animate={{ y: 0 }}
//         transition={{ duration: 0.5 }}
//       >
//         <motion.button
//           onClick={() => setMode(mode === "slideshow" ? "grid" : "slideshow")}
//           className="flex items-center gap-2 bg-cyan-600 hover:bg-cyan-700 transition-all text-white px-4 py-2 rounded-full shadow-lg font-bold"
//           whileHover={{ scale: 1.05 }}
//           whileTap={{ scale: 0.95 }}
//         >
//           {mode === "slideshow" ? (
//             <LayoutGrid size={16} />
//           ) : (
//             <Monitor size={16} />
//           )}
//           {mode === "slideshow" ? "Mode Grille" : "Mode Diaporama"}
//         </motion.button>

//         <motion.div
//           className="flex flex-col items-end"
//           initial={{ opacity: 0 }}
//           animate={{ opacity: 1 }}
//           transition={{ delay: 0.3 }}
//         >
//           <div className="flex items-center gap-2 text-lg font-medium">
//             <Clock size={18} className="text-cyan-400" />
//             <span>{clock.time}</span>
//           </div>
//           <div className="text-xs text-gray-300">{clock.date}</div>
//         </motion.div>
//       </motion.header>

//       {mode === "slideshow" ? (
//         <div className="relative h-full">
//           <AnimatePresence mode="wait">
//             {products.map(
//               (product, index) =>
//                 index === currentSlide && (
//                   <motion.div
//                     key={`slide-${product.id}`}
//                     className="h-screen w-screen absolute inset-0 bg-cover bg-center"
//                     style={{
//                       backgroundImage: `url(http://localhost:8000/storage/${product.image})`,
//                     }}
//                     initial={{ opacity: 0 }}
//                     animate={{ opacity: 1 }}
//                     exit={{ opacity: 0 }}
//                     transition={{ duration: 1 }}
//                   >
//                     <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-transparent flex flex-col justify-end items-center text-center p-12 pb-24">
//                       <motion.div
//                         className="max-w-4xl w-full backdrop-blur-sm bg-black/30 p-8 rounded-2xl shadow-2xl border border-white/10"
//                         initial={{ y: 100, opacity: 0 }}
//                         animate={{ y: 0, opacity: 1 }}
//                         transition={{ delay: 0.5, duration: 0.8 }}
//                       >
//                         <h1 className="text-5xl md:text-6xl font-bold mb-6 flex items-center justify-center gap-3">
//                           <Tag className="text-cyan-400" size={40} />
//                           <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
//                             {product.name}
//                           </span>
//                         </h1>
//                         <p className="text-xl md:text-2xl mb-8 max-w-2xl mx-auto font-light">
//                           <span className="flex items-center justify-center gap-2 mb-2">
//                             <Info className="text-cyan-400" size={20} />
//                             <span className="text-gray-300">Description</span>
//                           </span>
//                           {product.description}
//                         </p>
//                         <div className="text-4xl md:text-5xl font-bold flex items-center justify-center gap-3">
//                           <CreditCard className="text-cyan-400" size={32} />
//                           <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
//                             {product.price} DH
//                           </span>
//                         </div>
//                       </motion.div>
//                     </div>
//                   </motion.div>
//                 )
//             )}
//           </AnimatePresence>

//           {/* Navigation */}
//           <motion.button
//             onClick={goToPrevSlide}
//             className="absolute left-6 top-1/2 transform -translate-y-1/2 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-full p-3 text-white z-10"
//             whileHover={{
//               scale: 1.1,
//               backgroundColor: "rgba(255,255,255,0.2)",
//             }}
//             whileTap={{ scale: 0.9 }}
//           >
//             <ArrowLeft size={24} />
//           </motion.button>
//           <motion.button
//             onClick={goToNextSlide}
//             className="absolute right-6 top-1/2 transform -translate-y-1/2 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-full p-3 text-white z-10"
//             whileHover={{
//               scale: 1.1,
//               backgroundColor: "rgba(255,255,255,0.2)",
//             }}
//             whileTap={{ scale: 0.9 }}
//           >
//             <ArrowRight size={24} />
//           </motion.button>

//           {/* Dots */}
//           <motion.div
//             className="absolute bottom-10 w-full text-center z-20"
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             transition={{ delay: 1 }}
//           >
//             <div className="inline-flex bg-black/30 backdrop-blur-sm rounded-full px-4 py-2 space-x-2">
//               {products.map((_, i) => (
//                 <motion.button
//                   key={i}
//                   onClick={() => setCurrentSlide(i)}
//                   className={`h-3 w-3 rounded-full transition-all ${
//                     i === currentSlide
//                       ? "bg-cyan-400"
//                       : "bg-gray-400 hover:bg-gray-300"
//                   }`}
//                   animate={{
//                     width: i === currentSlide ? 32 : 12,
//                   }}
//                   whileHover={{ scale: 1.2 }}
//                 />
//               ))}
//             </div>
//           </motion.div>
//         </div>
//       ) : (
//         <div className="pt-24 px-4 md:px-8 pb-12 h-full overflow-auto">
//           <motion.h2
//             className="text-3xl md:text-4xl font-bold mb-8 text-center text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500"
//             initial={{ opacity: 0, y: -20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ duration: 0.5 }}
//           >
//             Nos Produits
//           </motion.h2>

//           {products.length === 0 ? (
//             <motion.div
//               className="text-center py-16 text-gray-400"
//               initial={{ opacity: 0 }}
//               animate={{ opacity: 1 }}
//               transition={{ delay: 0.3 }}
//             >
//               Aucun produit disponible
//             </motion.div>
//           ) : (
//             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 px-4">
//               {products.map((product) => (
//                 <motion.div
//                   key={product.id}
//                   className="group relative rounded-xl overflow-hidden shadow-2xl h-96"
//                   initial={{ opacity: 0, scale: 0.9 }}
//                   animate={{ opacity: 1, scale: 1 }}
//                   transition={{ type: "spring", stiffness: 100 }}
//                   whileHover={{ scale: 1.03 }}
//                 >
//                   <div
//                     className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
//                     style={{
//                       backgroundImage: `url(http://localhost:8000/storage/${product.image})`,
//                     }}
//                   />
//                   <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-transparent opacity-90" />
//                   <div className="absolute inset-0 p-6 flex flex-col justify-between">
//                     <div className="bg-black/30 backdrop-blur-sm p-3 rounded-lg self-start">
//                       <span className="text-cyan-400 font-bold text-lg flex items-center gap-1">
//                         <Tag size={16} />
//                         PREMIUM
//                       </span>
//                     </div>
//                     <div className="space-y-4">
//                       <h3 className="text-2xl font-bold tracking-tight group-hover:text-cyan-400 transition-colors">
//                         {product.name}
//                       </h3>
//                       <p className="text-gray-300 text-sm line-clamp-3">
//                         {product.description}
//                       </p>
//                       <div className="flex justify-between items-center">
//                         <span className="text-2xl font-bold text-cyan-400">
//                           {product.price} DH
//                         </span>
//                         <motion.button
//                           className="bg-cyan-600 hover:bg-cyan-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center gap-2"
//                           whileHover={{ scale: 1.05 }}
//                           whileTap={{ scale: 0.95 }}
//                         >
//                           <ShoppingCart size={16} />
//                           Acheter
//                         </motion.button>
//                       </div>
//                     </div>
//                   </div>
//                 </motion.div>
//               ))}
//             </div>
//           )}
//         </div>
//       )}
//     </div>
//   );
// };

// export default Display;

// Updated Display component with original grid mode design and safe price formatting
// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import {
//   Clock,
//   Tag,
//   Info,
//   CreditCard,
//   LayoutGrid,
//   Monitor,
//   ArrowLeft,
//   ArrowRight,
//   Pill,
//   AlertCircle,
//   Sparkles
// } from "lucide-react";

// const Display = () => {
//   const [products, setProducts] = useState([]);
//   const [currentSlide, setCurrentSlide] = useState(0);
//   const [mode, setMode] = useState("slideshow");
//   const [clock, setClock] = useState({ time: "", date: "" });

//   useEffect(() => {
//     axios
//       .get("http://localhost:8000/api/products")
//       .then((res) => setProducts(res.data))
//       .catch((err) => console.error("Erreur chargement produits:", err));
//   }, []);

//   useEffect(() => {
//     setClock(updateClock());
//     const interval = setInterval(() => setClock(updateClock()), 1000);
//     return () => clearInterval(interval);
//   }, []);

//   const updateClock = () => {
//     const now = new Date();
//     const dateFr = now.toLocaleDateString("fr-FR", {
//       weekday: "long",
//       day: "numeric",
//       month: "long",
//       year: "numeric",
//     });
//     const dateAr = now.toLocaleDateString("ar-MA", {
//       weekday: "long",
//       day: "numeric",
//       month: "long",
//       year: "numeric",
//     });
//     return { time: now.toLocaleTimeString(), date: `${dateFr} / ${dateAr}` };
//   };

//   useEffect(() => {
//     const timer = setInterval(() => {
//       if (mode === "slideshow" && products.length > 0) {
//         setCurrentSlide((prev) => (prev + 1) % products.length);
//       }
//     }, 10000);
//     return () => clearInterval(timer);
//   }, [mode, products]);

//   const goToNextSlide = () => {
//     setCurrentSlide((prev) => (prev + 1) % products.length);
//   };

//   const goToPrevSlide = () => {
//     setCurrentSlide((prev) => (prev - 1 + products.length) % products.length);
//   };

//   return (
//     <div className="relative min-h-screen bg-gradient-to-b from-green-950 to-neutral-900 text-white font-sans overflow-hidden">
//       {/* Header */}
//       <div className="absolute top-0 left-0 right-0 z-50 p-4 bg-black/60 backdrop-blur-md flex justify-between items-center border-b border-green-900/50">
//         <div className="flex items-center gap-3">
//           <Pill size={24} className="text-green-400" />
//           <span className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-500">
//             PharmaCare
//           </span>
//         </div>

//         <button
//           onClick={() => setMode(mode === "slideshow" ? "grid" : "slideshow")}
//           className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 rounded-full shadow-lg transition-all duration-300"
//         >
//           {mode === "slideshow" ? <LayoutGrid size={16} /> : <Monitor size={16} />}
//           {mode === "slideshow" ? "Mode Grille" : "Mode Diaporama"}
//         </button>

//         <div className="text-right">
//           <div className="flex items-center gap-2 text-lg">
//             <Clock size={18} className="text-green-400" />
//             <span>{clock.time}</span>
//           </div>
//           <div className="text-xs text-gray-300">{clock.date}</div>
//         </div>
//       </div>

//       {mode === "slideshow" ? (
//         <div className="relative w-full h-screen pt-20">
//           {products.map((product, index) => (
//             <div
//               key={product.id}
//               className={`absolute inset-0 flex flex-col md:flex-row items-center justify-center gap-8 p-8 transition-opacity duration-1000 ease-in-out ${
//                 index === currentSlide ? "opacity-100" : "opacity-0 pointer-events-none"
//               }`}
//             >
//               <div className="w-full md:w-1/2 flex flex-col items-center justify-center">
//                 <div className="relative w-full h-64 md:h-96 rounded-2xl overflow-hidden shadow-xl border border-green-500/20 group">
//                   <div
//                     className="w-full h-full bg-cover bg-center transform group-hover:scale-105 transition-transform duration-700"
//                     style={{ backgroundImage: `url(http://localhost:8000/storage/${product.image})` }}
//                   ></div>
//                   <div className="absolute top-4 right-4 bg-green-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
//                     Nouveau
//                   </div>
//                 </div>
//               </div>

//               <div className="w-full md:w-1/2 flex flex-col">
//                 <div className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-xl overflow-hidden border border-green-500/20">
//                   <div className="bg-gradient-to-r from-green-900 to-emerald-900 p-6 border-b border-green-500/30">
//                     <h1 className="text-4xl font-bold flex items-center gap-3 text-white">
//                       <Sparkles size={28} className="text-yellow-400" /> {product.name}
//                     </h1>
//                   </div>

//                   <div className="p-6 bg-gradient-to-b from-black/30 to-transparent">
//                     <div className="flex items-start gap-4">
//                       <AlertCircle size={24} className="text-green-400 mt-1 flex-shrink-0" />
//                       <div>
//                         <h3 className="text-lg font-semibold text-green-300 mb-2">Description</h3>
//                         <p className="text-gray-200 text-lg leading-relaxed">{product.description}</p>
//                       </div>
//                     </div>
//                   </div>

//                   <div className="flex justify-between items-center p-6 bg-gradient-to-r from-green-900/70 to-emerald-900/70 border-t border-green-500/30">
//                     <div className="flex items-center gap-2">
//                       <Tag size={20} className="text-green-400" />
//                       <span className="text-gray-300">Référence: PR-{product.id.toString().padStart(4, '0')}</span>
//                     </div>
//                     <div className="text-3xl font-bold">
//                       <span className="mr-2 text-white">Prix:</span>
//                       <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-300">
//                         {Number(product.price).toFixed(2)} DH
//                       </span>
//                     </div>
//                   </div>
//                 </div>

//                 <div className="mt-6 bg-green-900/30 p-4 rounded-xl flex items-center gap-3 border border-green-500/30">
//                   <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
//                   <span className="text-green-400 font-medium">En stock - Disponible immédiatement</span>
//                 </div>
//               </div>
//             </div>
//           ))}

//           <button onClick={goToPrevSlide} className="absolute top-1/2 left-6 transform -translate-y-1/2 p-4 bg-black/40 hover:bg-black/60 rounded-full shadow-lg transition-all duration-300 border border-green-500/30">
//             <ArrowLeft size={24} className="text-green-400" />
//           </button>
//           <button onClick={goToNextSlide} className="absolute top-1/2 right-6 transform -translate-y-1/2 p-4 bg-black/40 hover:bg-black/60 rounded-full shadow-lg transition-all duration-300 border border-green-500/30">
//             <ArrowRight size={24} className="text-green-400" />
//           </button>

//           <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex items-center gap-2">
//             {products.map((_, index) => (
//               <button
//                 key={index}
//                 onClick={() => setCurrentSlide(index)}
//                 className={`w-3 h-3 rounded-full transition-all duration-300 ${index === currentSlide ? "bg-green-400 w-8" : "bg-white/40"}`}
//               />
//             ))}
//           </div>
//         </div>
//       ) : (
//         <div className="pt-28 px-6 pb-12 max-w-7xl mx-auto">
//           <h2 className="text-4xl font-bold text-center mb-10 text-transparent bg-clip-text bg-gradient-to-r from-teal-600 to-emerald-500">
//             Liste des Produits
//           </h2>
//           <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
//             {products.map((product) => (
//               <div
//                 key={product.id}
//                 className="bg-white/70 backdrop-blur-lg shadow-xl rounded-xl overflow-hidden border border-teal-200 flex flex-col"
//               >
//                 <div
//                   className="h-48 bg-cover bg-center"
//                   style={{ backgroundImage: `url(http://localhost:8000/storage/${product.image})` }}
//                 ></div>
//                 <div className="p-4 flex flex-col justify-between h-full">
//                   <h2 className="text-xl font-bold text-teal-700 flex items-center gap-2 mb-2">
//                     <Tag size={20} /> {product.name}
//                   </h2>
//                   <p className="text-gray-600 text-sm mb-4 line-clamp-3">
//                     <Info size={16} className="inline mr-1 text-teal-500" />
//                     {product.description}
//                   </p>
//                   <div className="text-right text-lg font-semibold text-emerald-600 mt-auto">
//                     <CreditCard className="inline mr-1" /> {Number(product.price).toFixed(2)} DH
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default Display;



// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import {
//   Clock,
//   Tag,
//   Info,
//   CreditCard,
//   LayoutGrid,
//   Monitor,
//   ArrowLeft,
//   ArrowRight,
//   Pill,
//   AlertCircle,
//   Sparkles,
//   Shield,
//   HeartPulse,
//   ShoppingCart,
//   Star,
//   Percent
// } from "lucide-react";

// const Display = () => {
//   const [products, setProducts] = useState([]);
//   const [currentSlide, setCurrentSlide] = useState(0);
//   const [mode, setMode] = useState("slideshow");
//   const [clock, setClock] = useState({ time: "", date: "" });
//   const [isHovering, setIsHovering] = useState(false);

//   useEffect(() => {
//     axios
//       .get("http://localhost:8000/api/products")
//       .then((res) => setProducts(res.data))
//       .catch((err) => console.error("Erreur chargement produits:", err));
//   }, []);

//   useEffect(() => {
//     setClock(updateClock());
//     const interval = setInterval(() => setClock(updateClock()), 1000);
//     return () => clearInterval(interval);
//   }, []);

//   const updateClock = () => {
//     const now = new Date();
//     const dateFr = now.toLocaleDateString("fr-FR", {
//       weekday: "long",
//       day: "numeric",
//       month: "long",
//       year: "numeric",
//     });
//     const dateAr = now.toLocaleDateString("ar-MA", {
//       weekday: "long",
//       day: "numeric",
//       month: "long",
//       year: "numeric",
//     });
//     return { time: now.toLocaleTimeString(), date: `${dateFr} / ${dateAr}` };
//   };

//   useEffect(() => {
//     const timer = setInterval(() => {
//       if (mode === "slideshow" && products.length > 0 && !isHovering) {
//         setCurrentSlide((prev) => (prev + 1) % products.length);
//       }
//     }, 8000);
//     return () => clearInterval(timer);
//   }, [mode, products, isHovering]);

//   const goToNextSlide = () => {
//     setCurrentSlide((prev) => (prev + 1) % products.length);
//   };

//   const goToPrevSlide = () => {
//     setCurrentSlide((prev) => (prev - 1 + products.length) % products.length);
//   };

//   // Generate random discount between 5-20%
//   const getRandomDiscount = () => Math.floor(Math.random() * 16) + 5;

//   return (
//     <div className="relative min-h-screen bg-gradient-to-b from-teal-900 to-slate-900 text-white font-sans overflow-hidden">
//       {/* Animated background elements */}
//       <div className="absolute inset-0 overflow-hidden">
//         {[...Array(10)].map((_, i) => (
//           <div
//             key={i}
//             className="absolute rounded-full bg-teal-500/10"
//             style={{
//               width: `${Math.random() * 100 + 50}px`,
//               height: `${Math.random() * 100 + 50}px`,
//               top: `${Math.random() * 100}%`,
//               left: `${Math.random() * 100}%`,
//               transform: `rotate(${Math.random() * 360}deg)`,
//               animation: `float ${Math.random() * 10 + 10}s linear infinite`,
//             }}
//           />
//         ))}
//       </div>

//       {/* Header */}
//       <div className="absolute top-0 left-0 right-0 z-50 p-4 bg-gradient-to-r from-teal-900/80 to-emerald-900/80 backdrop-blur-md flex justify-between items-center border-b border-teal-500/30 shadow-lg">
//         <div className="flex items-center gap-3">
//           <div className="relative">
//             <HeartPulse size={28} className="text-teal-300 animate-pulse" />
//             <Shield size={16} className="absolute -right-1 -bottom-1 text-white bg-emerald-500 rounded-full p-0.5" />
//           </div>
//           <span className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-teal-300 to-emerald-300">
//             PharmaVision+
//           </span>
//         </div>

//         <div className="flex items-center gap-4">
//           <button className="relative p-2 rounded-full bg-teal-700/50 hover:bg-teal-600/70 transition-all duration-300 group">
//             <ShoppingCart size={20} className="text-teal-200" />
//             <span className="absolute -top-1 -right-1 bg-amber-400 text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center text-slate-900">
//               3
//             </span>
//           </button>
          
//           <button
//             onClick={() => setMode(mode === "slideshow" ? "grid" : "slideshow")}
//             className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-gradient-to-r from-teal-500 to-emerald-600 hover:from-teal-600 hover:to-emerald-700 rounded-full shadow-lg transition-all duration-300 hover:shadow-teal-500/30"
//           >
//             {mode === "slideshow" ? <LayoutGrid size={16} /> : <Monitor size={16} />}
//             {mode === "slideshow" ? "Mode Catalogue" : "Mode Présentation"}
//           </button>
//         </div>

//         <div className="text-right">
//           <div className="flex items-center gap-2 text-lg">
//             <Clock size={20} className="text-teal-300" />
//             <span className="font-medium">{clock.time}</span>
//           </div>
//           <div className="text-sm text-teal-200/80">{clock.date}</div>
//         </div>
//       </div>

//       {mode === "slideshow" ? (
//         <div 
//           className="relative w-full h-screen pt-20"
//           onMouseEnter={() => setIsHovering(true)}
//           onMouseLeave={() => setIsHovering(false)}
//         >
//           {products.map((product, index) => (
//             <div
//               key={product.id}
//               className={`absolute inset-0 flex flex-col md:flex-row items-center justify-center gap-8 p-8 transition-opacity duration-1000 ease-in-out ${
//                 index === currentSlide ? "opacity-100" : "opacity-0 pointer-events-none"
//               }`}
//             >
//               {/* Product Image with Interactive Elements */}
//               <div className="w-full md:w-1/2 flex flex-col items-center justify-center relative">
//                 <div className="relative w-full h-64 md:h-[28rem] rounded-3xl overflow-hidden shadow-2xl border-2 border-teal-500/30 group">
//                   <div
//                     className="w-full h-full bg-cover bg-center transform group-hover:scale-105 transition-transform duration-1000"
//                     style={{ backgroundImage: `url(http://localhost:8000/storage/${product.image})` }}
//                   />
                  
//                   {/* Product Badges */}
//                   <div className="absolute top-4 left-4 flex flex-col gap-2">
//                     <div className="bg-amber-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg flex items-center gap-1">
//                       <Star size={12} className="fill-white" />
//                       <span>Top Vente</span>
//                     </div>
//                     <div className="bg-rose-600 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg flex items-center gap-1">
//                       <Percent size={12} />
//                       <span>-{getRandomDiscount()}%</span>
//                     </div>
//                   </div>
                  
//                   {/* Product Rating */}
//                   <div className="absolute bottom-4 left-4 bg-black/70 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1">
//                     <div className="flex">
//                       {[...Array(5)].map((_, i) => (
//                         <Star 
//                           key={i} 
//                           size={14} 
//                           className={`${i < 4 ? 'fill-amber-400 text-amber-400' : 'text-gray-400'}`} 
//                         />
//                       ))}
//                     </div>
//                     <span className="text-white ml-1">(24)</span>
//                   </div>
//                 </div>
//               </div>

//               {/* Product Details */}
//               <div className="w-full md:w-1/2 flex flex-col">
//                 <div className="bg-gradient-to-br from-slate-800/80 to-teal-900/80 backdrop-blur-lg rounded-3xl shadow-2xl overflow-hidden border-2 border-teal-500/30">
//                   {/* Product Header */}
//                   <div className="bg-gradient-to-r from-teal-800/70 to-emerald-800/70 p-6 border-b border-teal-500/30 relative overflow-hidden">
//                     <div className="absolute -right-10 -top-10 w-32 h-32 bg-teal-500/10 rounded-full"></div>
//                     <div className="absolute -right-5 -bottom-5 w-20 h-20 bg-emerald-500/10 rounded-full"></div>
                    
//                     <h1 className="text-4xl font-bold flex items-center gap-3 text-white relative z-10">
//                       <Sparkles size={28} className="text-amber-300" /> 
//                       <span className="bg-gradient-to-r from-teal-300 to-emerald-300 bg-clip-text text-transparent">
//                         {product.name}
//                       </span>
//                     </h1>
//                     <p className="text-teal-200 mt-2">Médicament {product.category || "Général"}</p>
//                   </div>

//                   {/* Product Description */}
//                   <div className="p-6 bg-gradient-to-b from-black/20 to-transparent">
//                     <div className="flex items-start gap-4">
//                       <div className="bg-teal-700/30 p-2 rounded-lg">
//                         <AlertCircle size={24} className="text-teal-300" />
//                       </div>
//                       <div>
//                         <h3 className="text-xl font-semibold text-teal-300 mb-3">Description du Produit</h3>
//                         <p className="text-gray-200 text-lg leading-relaxed">
//                           {product.description}
//                           {product.description.length < 100 && (
//                             <span className="block mt-2 text-teal-200">
//                               Fabriqué selon les normes internationales de qualité pharmaceutique.
//                             </span>
//                           )}
//                         </p>
//                       </div>
//                     </div>
//                   </div>

//                   {/* Product Footer */}
//                   <div className="flex justify-between items-center p-6 bg-gradient-to-r from-teal-900/50 to-emerald-900/50 border-t border-teal-500/30">
//                     <div className="flex items-center gap-3">
//                       <div className="bg-teal-800/50 p-2 rounded-lg">
//                         <Tag size={20} className="text-teal-300" />
//                       </div>
//                       <div>
//                         <p className="text-xs text-teal-300/80">Référence</p>
//                         <p className="text-white font-mono">PH-{product.id.toString().padStart(4, '0')}</p>
//                       </div>
//                     </div>
                    
//                     <div className="text-right">
//                       <p className="text-sm text-teal-300/80">Prix Spécial</p>
//                       <div className="flex items-end justify-end gap-2">
//                         {Math.random() > 0.5 && (
//                           <span className="text-lg line-through text-rose-400/70">
//                             {(product.price * 1.2).toFixed(2)} DH
//                           </span>
//                         )}
//                         <span className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-teal-300 to-emerald-200">
//                           {Number(product.price).toFixed(2)} DH
//                         </span>
//                       </div>
//                     </div>
//                   </div>
//                 </div>

//                 {/* Call to Action */}
//                 <div className="mt-6 flex items-center justify-between gap-4">
//                   <div className="flex-1 bg-teal-900/40 p-4 rounded-xl flex items-center gap-3 border border-teal-500/30 shadow-md">
//                     <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
//                     <div>
//                       <p className="text-teal-300 font-medium">En stock</p>
//                       <p className="text-xs text-teal-300/70">Livraison rapide disponible</p>
//                     </div>
//                   </div>
                  
//                   <button className="flex-1 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-bold py-4 px-6 rounded-xl shadow-lg transition-all duration-300 hover:shadow-amber-500/30 flex items-center justify-center gap-2">
//                     <ShoppingCart size={20} />
//                     <span>Ajouter au Panier</span>
//                   </button>
//                 </div>
//               </div>
//             </div>
//           ))}

//           {/* Navigation Arrows */}
//           <button 
//             onClick={goToPrevSlide} 
//             className="absolute top-1/2 left-6 transform -translate-y-1/2 p-4 bg-teal-900/70 hover:bg-teal-800/80 rounded-full shadow-lg transition-all duration-300 border-2 border-teal-500/30 backdrop-blur-sm"
//           >
//             <ArrowLeft size={28} className="text-teal-300" />
//           </button>
//           <button 
//             onClick={goToNextSlide} 
//             className="absolute top-1/2 right-6 transform -translate-y-1/2 p-4 bg-teal-900/70 hover:bg-teal-800/80 rounded-full shadow-lg transition-all duration-300 border-2 border-teal-500/30 backdrop-blur-sm"
//           >
//             <ArrowRight size={28} className="text-teal-300" />
//           </button>

//           {/* Slide Indicators */}
//           <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex items-center gap-2">
//             {products.map((_, index) => (
//               <button
//                 key={index}
//                 onClick={() => setCurrentSlide(index)}
//                 className={`w-2 h-2 rounded-full transition-all duration-300 ${
//                   index === currentSlide 
//                     ? "bg-teal-300 w-6 shadow-teal-300/50 shadow-lg" 
//                     : "bg-white/30 hover:bg-white/50"
//                 }`}
//               />
//             ))}
//           </div>
//         </div>
//       ) : (
//         <div className="pt-28 px-6 pb-12 max-w-7xl mx-auto">
//           <h2 className="text-4xl font-bold text-center mb-10 text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-emerald-300">
//             Notre Catalogue de Produits
//           </h2>
          
//           {/* Category Filters */}
//           <div className="flex flex-wrap justify-center gap-3 mb-8">
//             {['Tous', 'Médicaments', 'Soins', 'Bébé', 'Beauté', 'Hygiène'].map((cat) => (
//               <button
//                 key={cat}
//                 className="px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 border border-teal-500/30 hover:border-teal-400/70 hover:bg-teal-900/30 hover:text-teal-300"
//               >
//                 {cat}
//               </button>
//             ))}
//           </div>
          
//           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
//             {products.map((product) => (
//               <div
//                 key={product.id}
//                 className="bg-gradient-to-b from-slate-800/50 to-teal-900/50 backdrop-blur-sm shadow-xl rounded-xl overflow-hidden border border-teal-500/30 hover:border-teal-400/50 transition-all duration-300 hover:shadow-teal-500/20 group"
//               >
//                 {/* Product Image */}
//                 <div className="relative h-48 overflow-hidden">
//                   <div
//                     className="w-full h-full bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
//                     style={{ backgroundImage: `url(http://localhost:8000/storage/${product.image})` }}
//                   />
//                   <div className="absolute top-3 right-3 flex flex-col gap-2">
//                     <div className="bg-rose-600 text-white px-2 py-1 rounded-full text-xs font-bold shadow-lg flex items-center gap-1">
//                       <Percent size={10} />
//                       <span>-{getRandomDiscount()}%</span>
//                     </div>
//                     <div className="bg-teal-600 text-white px-2 py-1 rounded-full text-xs font-bold shadow-lg">
//                       Nouveau
//                     </div>
//                   </div>
//                 </div>
                
//                 {/* Product Info */}
//                 <div className="p-4 flex flex-col">
//                   <div className="flex justify-between items-start mb-2">
//                     <h2 className="text-lg font-bold text-teal-300 line-clamp-1">
//                       {product.name}
//                     </h2>
//                     <div className="flex items-center gap-1 text-xs bg-teal-900/50 px-2 py-1 rounded">
//                       <Star size={12} className="fill-amber-400 text-amber-400" />
//                       <span>4.5</span>
//                     </div>
//                   </div>
                  
//                   <p className="text-gray-300 text-sm mb-4 line-clamp-2">
//                     {product.description}
//                   </p>
                  
//                   <div className="mt-auto flex justify-between items-center">
//                     <div className="text-lg font-bold text-emerald-300">
//                       {Number(product.price).toFixed(2)} DH
//                     </div>
//                     <button className="bg-teal-700 hover:bg-teal-600 text-white p-2 rounded-full transition-all duration-300">
//                       <ShoppingCart size={18} />
//                     </button>
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };
// export default Display;
import React, { useEffect, useState } from "react";
import logo from "../assets/logo.png";
import axios from "axios";
import {
  Clock,
  LayoutGrid,
  Monitor,
  ArrowLeft,
  ArrowRight,
  HeartPulse,
  Shield,
  Sparkles,
  Tag,Star,
} from "lucide-react";

const Display = () => {
  const [products, setProducts] = useState([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [mode, setMode] = useState("slideshow");
  const [clock, setClock] = useState({ time: "", date: "" });

  useEffect(() => {
    axios
      .get("http://localhost:8000/api/products")
      .then((res) => setProducts(res.data))
      .catch((err) => console.error("Erreur chargement produits:", err));
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
      if (mode === "slideshow" && products.length > 0) {
        setCurrentSlide((prev) => (prev + 1) % products.length);
      }
    }, 8000);
    return () => clearInterval(timer);
  }, [mode, products]);

  const goToNextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % products.length);
  };

  const goToPrevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + products.length) % products.length);
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-green-800 to-emerald-700 text-white font-sans overflow-hidden">
      {/* Animated background */}
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
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 z-50 p-2 bg-gradient-to-r from-green-900/90 to-emerald-800/90 backdrop-blur-md flex justify-between items-center border-b border-emerald-400/20 shadow-md">
        <div className="flex items-center gap-3">
          <img
            src={logo}
            alt="logo"
            className="h-16 w-auto rounded-xl shadow-lg border-2 border-emerald-500 bg-white p-2"
          />
          <div className="relative">
            <HeartPulse size={28} className="text-emerald-300 animate-pulse" />
            <Shield
              size={16}
              className="absolute -right-1 -bottom-1 text-white bg-emerald-600 rounded-full p-0.5"
            />
          </div>
          <span className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-200 to-white">
            Para M3A Pharma
          </span>
        </div>

        <button
          onClick={() => setMode(mode === "slideshow" ? "grid" : "slideshow")}
          className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 rounded-full shadow-lg transition-all duration-300 hover:shadow-emerald-500/30"
        >
          {mode === "slideshow" ? (
            <LayoutGrid size={16} />
          ) : (
            <Monitor size={16} />
          )}
          {mode === "slideshow" ? "Mode Catalogue" : "Mode Présentation"}
        </button>

        <div className="text-right">
          <div className="flex items-center gap-2 text-lg">
            <Clock size={20} className="text-emerald-300" />
            <span className="font-medium">{clock.time}</span>
          </div>
          <div className="text-sm text-emerald-200/80">{clock.date}</div>
        </div>
      </div>
      {/* Slideshow mode */}
      {mode === "slideshow" && (
        <div className="relative w-full h-screen pt-24">
          {products.map((product, index) => (
            <div
              key={product.id}
              className={`absolute inset-0 flex flex-col md:flex-row items-center justify-center gap-8 p-8 transition-opacity duration-1000 ease-in-out ${
                index === currentSlide
                  ? "opacity-100"
                  : "opacity-0 pointer-events-none"
              }`}
            >
              <div className="w-full md:w-2/3 h-[40rem] flex items-center justify-center">
                <img
                  src={`http://localhost:8000/storage/${product.image}`}
                  alt={product.name}
                  className="max-h-[40rem] max-w-[90%] object-contain rounded-3xl shadow-2xl border-2 border-emerald-500/30 bg-white p-6"
                />
              </div>
              <div className="w-full md:w-1/3 flex flex-col justify-center">
                <div className="relative bg-gradient-to-br from-white to-emerald-50 rounded-3xl shadow-2xl overflow-hidden border border-emerald-200 p-8 space-y-6 transition-all duration-300 hover:scale-[1.02] hover:shadow-emerald-300/30">
                  {/* Décoration coin haut droite */}
                  <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-emerald-300/30 to-transparent rounded-bl-3xl"></div>

                  {/* Badge promotion */}
                  {product.promotion_percentage > 0 && (
                    <div className="absolute top-4 left-4 bg-gradient-to-r from-pink-500 to-rose-600 text-white px-3 py-1 rounded-full text-sm font-semibold flex items-center gap-1 shadow-md">
                      <Tag size={14} />-{product.promotion_percentage}%
                    </div>
                  )}

                  {/* Nom du produit avec icône */}
                  <div className="space-y-3">
                    <h1 className="text-3xl font-bold flex items-center gap-3 text-emerald-900">
                      <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-green-500 rounded-full flex items-center justify-center shadow-inner">
                        <Sparkles size={20} className="text-white" />
                      </div>
                      <span className="bg-gradient-to-r from-emerald-700 to-green-600 bg-clip-text text-transparent">
                        {product.name}
                      </span>
                    </h1>

                    {/* Étoiles */}
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          size={16}
                          className={`${
                            i < 4
                              ? "text-yellow-400 fill-current"
                              : "text-gray-300"
                          }`}
                        />
                      ))}
                      <span className="text-sm text-emerald-600 ml-2">
                        (4.8)
                      </span>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-emerald-700 leading-relaxed text-sm italic border-l-4 border-emerald-300 pl-4">
                    {product.description}
                  </p>

                  {/* Bloc prix */}
                  <div className="bg-gradient-to-r from-green-100 to-emerald-100 rounded-2xl p-4">
                    <div className="flex justify-between items-end">
                      <div>
                        <p className="text-sm text-emerald-600 font-medium">
                          Prix Spécial
                        </p>
                        {product.promotion_percentage > 0 && (
                          <p className="text-xs text-emerald-500">
                            Économisez {product.promotion_percentage}%
                          </p>
                        )}
                      </div>

                      <div className="text-right">
                        {product.promotion_percentage > 0 && (
                          <span className="text-lg line-through text-gray-400 block">
                            {(
                              product.price /
                              (1 - product.promotion_percentage / 100)
                            ).toFixed(2)}{" "}
                            DH
                          </span>
                        )}
                        <span className="text-4xl font-bold text-emerald-800">
                          {Number(product.price).toFixed(2)}
                          <span className="text-2xl text-emerald-600 ml-1">
                            DH
                          </span>
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Message au lieu du bouton panier */}
                  <div className="text-center pt-2 text-sm text-emerald-600 font-medium">
                    Produit disponible en pharmacie. Consultez notre personnel.
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      {/* Grid (catalogue) mode */}
      {mode === "grid" && (
        <div className="pt-28 px-6 pb-12 max-w-7xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-white mb-10">
            Notre Catalogue de Produits
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <div
                key={product.id}
                className="bg-emerald-800/30 p-4 rounded-xl shadow-lg hover:shadow-emerald-500/30 transition-all"
              >
                <div
                  className="w-full h-48 bg-cover bg-center rounded-lg mb-4"
                  style={{
                    backgroundImage: `url(http://localhost:8000/storage/${product.image})`,
                  }}
                ></div>
                <h3 className="text-xl font-bold text-white mb-2">
                  {product.name}
                </h3>
                <p className="text-emerald-200 text-sm mb-2">
                  {product.category}
                </p>
                <p className="text-emerald-100 text-sm line-clamp-2">
                  {product.description}
                </p>
                <div className="mt-2 text-2xl font-bold text-emerald-300">
                  {Number(product.price).toFixed(2)} DH
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      <footer className="fixed bottom-0 left-0 right-0 bg-gradient-to-r from-green-900 via-emerald-900 to-green-900 text-white py-3 px-6 border-t border-green-500/40 shadow-xl z-50 backdrop-blur-sm">
        <div className="overflow-hidden relative">
          {/* Gradient fade effects on sides */}
          <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-green-900 to-transparent z-10 pointer-events-none"></div>
          <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-green-900 to-transparent z-10 pointer-events-none"></div>

          <div className="animate-slide whitespace-nowrap flex items-center gap-6 py-1">
            {products
              .filter((p) => p.promotion_percentage > 0)
              .map((promo) => (
                <div
                  key={promo.id}
                  className="flex items-center gap-4 bg-gradient-to-r from-green-800/50 to-emerald-800/50 px-4 py-2 rounded-xl shadow-lg border border-green-400/40 hover:border-green-300/60 transition-all duration-300 hover:scale-105 cursor-pointer backdrop-blur-sm"
                >
                  <div className="relative">
                    <img
                      src={`http://localhost:8000/storage/${promo.image}`}
                      alt={promo.name}
                      className="h-12 w-12 rounded-lg object-cover border-2 border-white/80 shadow-md"
                    />
                    {/* Discount badge */}
                    <div className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold px-1.5 py-0.5 rounded-full shadow-md">
                      -{promo.promotion_percentage}%
                    </div>
                  </div>
                  <div className="min-w-0">
                    <p className="font-semibold text-white text-sm truncate w-36 mb-1">
                      {promo.name}
                    </p>
                    <div className="flex items-center gap-2">
                      <span className="line-through text-xs text-red-300/80">
                        {Number(promo.price).toFixed(2)} DH
                      </span>
                      <span className="font-bold text-emerald-200 text-sm">
                        {(
                          Number(promo.price) -
                          (Number(promo.price) * promo.promotion_percentage) /
                            100
                        ).toFixed(2)}{" "}
                        DH
                      </span>
                    </div>
                    <div className="text-xs text-emerald-300/80 mt-1">
                      Économisez{" "}
                      {(
                        (Number(promo.price) * promo.promotion_percentage) /
                        100
                      ).toFixed(2)}{" "}
                      DH
                    </div>
                  </div>
                </div>
              ))}

            {/* No promotions message */}
            {products.filter((p) => p.promotion_percentage > 0).length ===
              0 && (
              <div className="flex items-center justify-center w-full">
                <div className="bg-green-800/30 px-6 py-3 rounded-lg border border-green-500/30">
                  <p className="text-sm text-emerald-200 italic flex items-center gap-2">
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    Aucune promotion en cours - Restez connecté pour les
                    prochaines offres !
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </footer>
      <style jsx>{`
        @keyframes slide {
          0% {
            transform: translateX(100%);
          }
          100% {
            transform: translateX(-100%);
          }
        }

        .animate-slide {
          animation: slide
            ${products.filter((p) => p.promotion_percentage > 0).length * 8}s
            linear infinite;
        }

        /* Pause animation on hover */
        .animate-slide:hover {
          animation-play-state: paused;
        }
      `}</style>
    </div>
  );
};

export default Display;
