import React from 'react'
import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import ExploreMenu from '../components/ExploreMenu'
import FoodDisplay from '../components/FoodDisplay';

const Menu = () => {
   const [category, setCategory] = useState("All");
   const [searchParams] = useSearchParams();
   const categoryFromUrl = searchParams.get('category');
   const [selectedItem, setSelectedItem] = useState(null);


   useEffect(() => {
    if (categoryFromUrl) {
      setCategory(categoryFromUrl);
    }
  }, [categoryFromUrl]);

  
  return (
    <div>
      <ExploreMenu category={category} setCategory={setCategory} />
            <FoodDisplay category={category} onOpenDetails={setSelectedItem} />


            {selectedItem && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in"
          onClick={() => setSelectedItem(null)} // Close when clicking background mask
        >
          <div
            className="bg-white rounded-2xl overflow-hidden max-w-sm w-full shadow-2xl ring-1 ring-black/5 animate-scale-up"
            onClick={(e) => e.stopPropagation()} // Stop modal from closing when clicking inside
          >
            {/* Display Large Image */}
            <div 
              style={{ backgroundImage: `url(${selectedItem.image || selectedItem.imageUrl})` }}
              className="h-56 sm:h-64 w-full bg-contain bg-center relative bg-slate-100"
            >
              <button 
                onClick={() => setSelectedItem(null)}
                className="absolute top-4 right-4 bg-white/80 hover:bg-white text-slate-800 font-bold p-2 rounded-full h-8 w-8 flex items-center justify-center shadow transition-all cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Content Body */}
            <div className="p-6">
              <div className="flex items-start justify-between gap-4">
                <h2 className="text-xl font-bold text-slate-900">{selectedItem.name}</h2>
                <span className="text-lg font-bold text-amber-600 whitespace-nowrap">
                  ₹{selectedItem.price}
                </span>
              </div>
              
              <p className="text-sm text-slate-600 mt-3 leading-relaxed">
                {selectedItem.description || "No description available for this dish. Prepared fresh daily using authentic local ingredients."}
              </p>

              <div className="mt-4 flex gap-2">
                <span className="text-xs font-semibold bg-slate-100 text-slate-700 px-2.5 py-1 rounded-full">Fresh Base</span>
                <span className="text-xs font-semibold bg-amber-50 text-amber-800 px-2.5 py-1 rounded-full">★ 4.5 Rated</span>
              </div>

              <button 
                onClick={() => setSelectedItem(null)}
                className="mt-6 w-full bg-amber-600 hover:bg-amber-700 text-white font-semibold py-3 rounded-xl transition-colors shadow-sm cursor-pointer"
              >
                Back to Menu
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Menu