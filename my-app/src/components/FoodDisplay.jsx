import React, { useContext } from 'react'
import { StoreContext } from '../Context/StoreContext'
import FoodItem from './FoodItem'

const FoodDisplay = ({ category, onOpenDetails }) => {

  const { food_list } = useContext(StoreContext);

  return (
    <div className="h-full  px-4 sm:px-6 lg:px-12 py-8">
      <h2 className="text-2xl font-bold text-center">Top dishes near you</h2>

      {/* Responsive grid */}
      <div className="
        grid 
        grid-cols-1 
        sm:grid-cols-2 
        md:grid-cols-3 
        lg:grid-cols-4
        mt-12 
        gap-6 
        sm:gap-8 
        lg:gap-x-10 
        lg:gap-y-12
      ">
        {food_list.map((item, index) => {

          const compiledImageUrl = `http://localhost:8080${item.imageUrl}`;

          
          if (category === "All" || category === item.category) {
            return (
              <FoodItem
                key={index}
                id={item.id}
                name={item.name}
                description={item.description}
                price={item.price}
                image={`http://localhost:8080${item.imageUrl}`}
                onClickCard={() => onOpenDetails({ ...item, image: compiledImageUrl })}
              />
            );
          }
          return null;
        })}
      </div>
    </div>
  );
}

export default FoodDisplay