import { useState, useContext } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { StoreContext } from "../Context/StoreContext";
import Logo from '../components/Logo';
import searchIcon from '../assets/search_icon.png';
import cart from '../assets/basket_icon.png';
import { StoreContext } from '../Context/StoreContext';


const Navbar = () => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const { cartCount, user, authLoading , BASE_URL } = useContext(StoreContext);

  // Close menu when a route is selected
  const closeMenu = () => setOpen(false);

  return (
    <nav className="h-20 w-full bg-[#eeeeee] flex items-center justify-between shadow sticky top-0 z-50 px-4 sm:px-6 lg:px-10">
      {/* Left: Logo */}
      <div className="h-full w-[25%] sm:w-[20%] lg:w-[15%] flex justify-start sm:justify-center items-center">
        <Link to="/"><Logo /></Link>
      </div>

      {/* Center: Desktop Nav */}
      <div className="hidden sm:flex h-full w-[50%] lg:w-[60%] items-center justify-center">
        <ul className="flex gap-6 md:gap-10 lg:gap-14 text-sm md:text-base">
          <li>
            <NavLink
              to="/"
              className={({ isActive }) =>
                `no-underline font-medium transition-colors duration-300 cursor-pointer 
                 ${isActive ? 'text-[#b34700]' : 'text-[#d65804]'}`
              }
            >
              Home
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/menu"
              className={({ isActive }) =>
                `no-underline font-medium transition-colors duration-300 cursor-pointer 
                 ${isActive ? 'text-[#b34700]' : 'text-[#d65804]'}`
              }
            >
              Menu
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/about"
              className={({ isActive }) =>
                `no-underline font-medium transition-colors duration-300 cursor-pointer 
                 ${isActive ? 'text-[#b34700]' : 'text-[#d65804]'}`
              }
            >
              About
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/contact"
              className={({ isActive }) =>
                `no-underline font-medium transition-colors duration-300 cursor-pointer 
                 ${isActive ? 'text-[#b34700]' : 'text-[#d65804]'}`
              }
            >
              Contact Us
            </NavLink>
          </li>
        </ul>
      </div>

      {/* Right: Actions + Mobile Hamburger */}
      <div className="flex items-center justify-end gap-4 sm:gap-6 md:gap-10 lg:gap-14 flex-1">
        {/* Search & Cart (always visible) */}
        <div>
          <img src={searchIcon} alt="Search Icon" className="h-4 w-4 cursor-pointer" />
        </div>
        <div className="relative">
          <Link to="/cart">
            <img src={cart} alt="Cart Icon" className="h-4 w-4 cursor-pointer" />
            {cartCount > 0 && (
              <span
                className="absolute -top-2 -right-2 bg-amber-600 text-white text-xs font-medium rounded-full h-4 w-4 flex items-center justify-center"
              >
                {cartCount}
              </span>
            )}
          </Link>
        </div>




        {/* Desktop Login/Logout */}
        {!authLoading && (
          user ? (
            <Link to="/profile" className="hidden sm:block">
              <img
                src={`${BASE_URL}/images/profile_icon.png`} // ⭐ Use user’s profile image or fallback
                alt="Profile"
                className="w-7 h-7 rounded-full object-contain cursor-pointer border border-gray-300"

              />
            </Link>

          ) : (
            <button
              onClick={() => navigate('/login')}
              className="hidden sm:inline-block px-4 sm:px-5 md:px-6 py-1.5 text-xs sm:text-sm font-medium text-black border-2 border-amber-600 rounded-xl outline-none cursor-pointer"
            >
              Login
            </button>
          )
        )}


        {/* Mobile Hamburger */}
        <button
          type="button"
          className="sm:hidden inline-flex items-center justify-center rounded-md p-2 text-[#d65804] hover:bg-[#e6e6e6] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#b34700]"
          aria-label="Open main menu"
          aria-controls="mobile-menu"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          {/* Icon (hamburger / close) */}
          <svg
            className={`h-6 w-6 transition-transform duration-200 ${open ? 'rotate-90' : ''}`}
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"
          >
            {open ? (
              // X icon
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            ) : (
              // Hamburger
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile Menu (drawer) */}
      <div
        id="mobile-menu"
        className={`
          sm:hidden absolute left-0 right-0 top-20
          bg-[#f7f7f7] border-t border-[#e2e2e2]
          shadow-md overflow-hidden
          transition-[max-height] duration-300 ease-in-out
          ${open ? 'max-h-80' : 'max-h-0'}
        `}
      >
        <ul className="flex flex-col gap-2 p-4 text-base">
          <li>
            <NavLink
              to="/"
              onClick={closeMenu}
              className={({ isActive }) =>
                `block px-2 py-2 rounded-lg no-underline transition-colors 
                 ${isActive ? 'text-[#b34700] bg-[#fff3e9]' : 'text-[#d65804] hover:bg-[#eeeeee]'}`
              }
            >
              Home
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/menu"
              onClick={closeMenu}
              className={({ isActive }) =>
                `block px-2 py-2 rounded-lg no-underline transition-colors 
                 ${isActive ? 'text-[#b34700] bg-[#fff3e9]' : 'text-[#d65804] hover:bg-[#eeeeee]'}`
              }
            >
              Menu
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/about"
              onClick={closeMenu}
              className={({ isActive }) =>
                `block px-2 py-2 rounded-lg no-underline transition-colors 
                 ${isActive ? 'text-[#b34700] bg-[#fff3e9]' : 'text-[#d65804] hover:bg-[#eeeeee]'}`
              }
            >
              About
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/contact"
              onClick={closeMenu}
              className={({ isActive }) =>
                `block px-2 py-2 rounded-lg no-underline transition-colors 
                 ${isActive ? 'text-[#b34700] bg-[#fff3e9]' : 'text-[#d65804] hover:bg-[#eeeeee]'}`
              }
            >
              Contacts
            </NavLink>
          </li>

          {/* Mobile Login (inside drawer) */}
          <li className="pt-2">
            {!authLoading && (
              user ? (
              <Link to="/profile" onClick={closeMenu} className="w-full flex items-center justify-center gap-2 px-5 py-2 text-sm font-medium text-black border-2 border-amber-600 rounded-xl">
                <img
                  src={`${BASE_URL}/images/profile_icon.png`}
                  alt="Profile"
                  className="w-6 h-6 rounded-full object-contain border border-gray-300"
                />
                Profile
              </Link>

              // If you prefer logout instead of profile:
              // <button onClick={() => { closeMenu(); logout(); navigate('/login'); }} className="w-full px-5 py-2 text-sm font-medium text-black border-2 border-amber-600 rounded-xl">Logout</button>
            ) : (
              <button
                onClick={() => { closeMenu(); navigate('/login'); }}
                className="w-full px-5 py-2 text-sm font-medium text-black border-2 border-amber-600 rounded-xl"
              >
                Login
              </button>
            )
          )}

          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;