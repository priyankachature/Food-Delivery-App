import React, { useContext} from 'react'
import { assets } from '../assets/assets'
import { StoreContext } from '../Context/StoreContext'

const FoodItem = ({ id, name, price, description, image , onClickCard}) => {
  const { cartItems, addToCart, removeFromCart } = useContext(StoreContext);

  return (
    <div onClick={onClickCard}
    className="w-full h-full rounded-2xl shadow-2xl overflow-hidden flex flex-col cursor-pointer">
      <div className="w-full relative">
        <img
          src={image}
          alt={name}
          className="w-full h-40 sm:h-44 md:h-48 lg:h-52 object-cover rounded-t-xl"
        />

        {!cartItems[id] ? (
          <img
            className="absolute w-8 sm:w-9 bottom-3 sm:bottom-4 right-3 sm:right-4 cursor-pointer rounded-full"
            
            onClick={(e) =>{ 
              e.stopPropagation();
              addToCart(id)}}
            src={assets.add_icon_white}
            alt=""
          />
        ) : (
          <div onClick={(e) => e.stopPropagation()}
          className="absolute bottom-3 sm:bottom-4 right-3 sm:right-4 flex items-center gap-2 sm:gap-2.5 px-2 py-1.5 sm:p-1.5 rounded-full bg-white">
            <img
              onClick={() => removeFromCart(id)}
              src={assets.remove_icon_red}
              alt=""
              className="w-6 sm:w-7"
            />
            <p className="text-sm sm:text-base">{cartItems[id]}</p>
            <img
              onClick={() => addToCart(id)}
              src={assets.add_icon_green}
              alt=""
              className="w-6 sm:w-7"
            />
          </div>
        )}
      </div>

      <div className="px-4 sm:px-5 py-4 flex flex-col flex-1">
        <div className="mb-2.5 flex items-center justify-between gap-2">
          <p className="font-medium text-base sm:text-lg truncate min-w-0">{name}</p>
          <img
            className="w-14 sm:w-16 h-auto shrink-0 mt-0.5"
            src={assets.rating_stars}
            alt="rating"
          />
        </div>

        <p className="text-[#747474] text-sm sm:text-[15px] leading-5 line-clamp-3">
          {description}
        </p>

        <p className="text-amber-600 text-lg sm:text-xl font-medium mt-auto pt-3">
          ₹{price}
        </p>
      </div>
    </div>
  );
}

export default FoodItem