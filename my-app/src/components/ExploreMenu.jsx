
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, FreeMode, A11y, Autoplay } from "swiper/modules";
import axios from "axios";
import { useEffect, useState , useContext } from "react";
import { StoreContext } from "../Context/StoreContext";


const ExploreMenu = ({ category, setCategory }) => {
  const [menuList, setMenuList] = useState([]);
  const { BASE_URL } = useContext(StoreContext);

  useEffect(() =>{
    axios.get(`${BASE_URL}/api/menu/categories`)
    .then(res => setMenuList(res.data))
    .catch(err => setMenuList([]));
  }, []);


  const handleClick = (name) => {
    setCategory((prev) => (prev === name ? "All" : name));
  }



  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 py-8 flex flex-col items-center gap-4 sm:gap-5">
      <h1 className="text-[#262626] mt-2 text-2xl sm:text-3xl font-bold">Explore our menu</h1>

      {/* Make the paragraph readable on small screens */}
      <p className="max-w-[90%] sm:max-w-[70%] md:max-w-[60%] text-[#808080] text-sm sm:text-base leading-6 text-center">
        Chooose from a diverse menu featuring a delectable array of dishes . Our mission is to satisfy your craving and elevate your dining experience, one delicious meal at a time. 
      </p>

      <div className="w-full mt-4">
        <Swiper
          modules={[Pagination, FreeMode, Autoplay]}
          // spacing between slides
          spaceBetween={12}
          // base slides per view
          slidesPerView={2}
          // free scroll feel
          freeMode
          // optional autoplay (kept as-is)
          autoplay={{ delay: 2000, pauseOnMouseEnter: true, disableOnInteraction: false }}
          // dots
          pagination={{
            clickable: true,
          }}
          // infinite loop
          loop={menuList.length > 4}
          // responsive breakpoints
          breakpoints={{
            0:    { slidesPerView: 2,   spaceBetween: 10 },
            360:  { slidesPerView: 2.25,spaceBetween: 12 },
            480:  { slidesPerView: 3,   spaceBetween: 12 },
            640:  { slidesPerView: 4,   spaceBetween: 14 },
            768:  { slidesPerView: 4,   spaceBetween: 16 },
            1024: { slidesPerView: 5,   spaceBetween: 18 },
            1280: { slidesPerView: 6,   spaceBetween: 20 },
          }}
          className="pb-4!"
        >
          {menuList.map((item) => {
            const isActive = category === item.menu_name;
            return (
              <SwiperSlide onClick={() => handleClick(item.menu_name)} key={item.id}>
                <div className="mt-6 flex flex-col items-center text-center">
                  <img
                    src={`${BASE_URL}${item.menu_img}`} 
                    alt={item.menu_name}
                    loading="lazy"
                    className={`h-16 w-16 sm:h-24 sm:w-24 md:h-28 md:w-28 cursor-pointer rounded-full shadow-2xl 
                    ${isActive ? "ring-2 ring-orange-500 p-0.5" : ""}`}
                  />
                  <p
                    className={`mt-2.5 text-[#747474] text-sm sm:text-base cursor-pointer
                    ${isActive ? "text-orange-600 font-semibold" : "text-[#747474]"}`}
                  >
                    {item.menu_name}
                  </p>
                </div>
              </SwiperSlide>
            );
          })}
        </Swiper>
      </div>
    </div>
  );
};

export default ExploreMenu;