import { ShoppingCart, UserPlus, LogIn, LogOut, Lock, Menu, X } from "lucide-react";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { useUserStore } from "../stores/useUserStore";

const Navbar = () => {
  const {user, logout} = useUserStore();
  const isAdmin = user.role === "admin"



  const [cartItems, setCartItems] = useState(3);
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <header 
      className={`fixed top-0 left-0 w-full z-40 transition-all duration-300 border-b ${
        isScrolled 
          ? 'bg-slate-900 bg-opacity-95 backdrop-blur-md shadow-lg border-slate-700' 
          : 'bg-slate-900 bg-opacity-85 border-slate-800'
      }`}
    >
      <div className='container mx-auto px-4 py-3'>
        <div className='flex justify-between items-center'>
          <Link to='/' className='flex items-center space-x-2'>
            <span className='text-2xl font-bold text-slate-200  hover:text-slate-500 transition duration-300 '>
              My store
            </span>
          </Link>

          {/* Mobile menu button */}
          <button 
            className="md:hidden text-gray-300  hover:text-slate-800 transition-colors"
            onClick={toggleMobileMenu}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

          {/* Desktop Navigation */}
          <nav className='hidden md:flex items-center gap-5'>
            <Link
              to={"/"}
              className='text-gray-300 hover:text-slate-600 transition duration-300 font-medium'
            >
              Home
            </Link>
            {user && (
              <Link
                to={"/cart"}
                className='relative group text-gray-300 hover:text-slate-600 transition duration-300 '
              >
                <ShoppingCart className='inline-block mr-2 group-hover:text-slate-600' size={20} />
                
                {cartItems > 0 && (
                  <span
                    className='absolute -top-2 -right-2 bg-slate-900 text-white rounded-full h-5 w-5 flex items-center justify-center text-xs font-bold group-hover:bg-slate-600 transition duration-300'
                  >
                    {cartItems}
                  </span>
                )}
              </Link>
            )}
            {isAdmin && (
              <Link
                className='bg-gradient-to-r from-slate-700 to-slate-900 text-white px-4 hover:from-slate-500 hover:to-slate-600 py-2 rounded-md transition duration-300 border border-slate-600 shadow-md font-mono tracking-wide '
                to={"/secret-dashboard"}
              >
                <Lock className='inline-block mr-2' size={18} />
                <span>Dashboard</span>
              </Link>
            )}

            {user ? (
              <button
                className='bg-gradient-to-r from-slate-700 to-slate-900 hover:from-slate-500 hover:to-slate-600  text-white py-2 px-4 rounded-md flex items-center  shadow-md'
                onClick={logout}
              >
                <LogOut size={18} />
                <span className='ml-2'>Log Out</span>
              </button>
            ) : (
              <>
                <Link
                  to={"/signup"}
                  className='bg-gradient-to-r from-slate-700 to-slate-900 hover:from-slate-500 hover:to-slate-600 text-white py-2 px-4 rounded-md flex items-center transition duration-300 shadow-md'
                >
                  <UserPlus className='mr-2' size={18} />
                  Sign Up
                </Link>
                <Link
                  to={"/login"}
                  className='bg-gradient-to-r from-slate-700 to-slate-900 hover:from-slate-500 hover:to-slate-600 text-white py-2 px-4 rounded-md flex items-center transition duration-300 shadow-md border border-slate-500'
                >
                  <LogIn className='mr-2' size={18} />
                  Login
                </Link>
              </>
            )}
          </nav>
        </div>

        {/* Mobile menu */}
        <div className={`md:hidden transition-all duration-300 overflow-hidden ${mobileMenuOpen ? 'max-h-96 pt-4' : 'max-h-0'}`}>
          <nav className='flex flex-col space-y-4 pb-4'>
            <Link
              to={"/"}
              className='text-gray-300 hover:text-slate-500 transition duration-300 font-medium py-2'
              onClick={() => setMobileMenuOpen(false)}
            >
              Home
            </Link>
            {user && (
              <Link
                to={"/cart"}
                className='relative group text-gray-300 hover:text-slate-500 transition duration-300 py-2'
                onClick={() => setMobileMenuOpen(false)}
              >
                <ShoppingCart className='inline-block mr-2 group-hover:text-slate-500' size={20} />
                <span>Cart</span>
                {cartItems > 0 && (
                  <span
                    className='absolute top-0 ml-16 bg-slate-500 text-white rounded-full h-5 w-5 flex items-center justify-center text-xs font-bold group-hover:bg-slate-500 transition duration-300'
                  >
                    {cartItems}
                  </span>
                )}
              </Link>
            )}
            {isAdmin && (
              <Link
                className='bg-gradient-to-r from-slate-700 to-slate-800 hover:from-slate-600 hover:to-slate-900 text-white px-4 py-2 rounded-md transition duration-300 border border-slate-600 shadow-md text-center font-mono tracking-wide'
                to={"/secret-dashboard"}
                onClick={() => setMobileMenuOpen(false)}
              >
                <Lock className='inline-block mr-2' size={18} />
                <span>Dashboard</span>
              </Link>
            )}

            {user ? (
              <button
                className='bg-gradient-to-r from-slate-700 to-slate-800 hover:from-slate-600 hover:to-slate-900 text-white py-2 px-4 rounded-md flex items-center justify-center transition duration-300 shadow-md'
                // onClick={logout}
              >
                <LogOut size={18} />
                <span className='ml-2'>Log Out</span>
              </button>
            ) : (
              <>
                <Link
                  to={"/signup"}
                  className='bg-gradient-to-r from-slate-600 to-slate-700 hover: text-white py-2 px-4 rounded-md flex items-center justify-center transition duration-300 shadow-md'
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <UserPlus className='mr-2' size={18} />
                  Sign Up
                </Link>
                <Link
                  to={"/login"}
                  className='bg-gradient-to-r from-slate-600 to-slate-700 hover:from-teal-600 hover:to-teal-700 text-white py-2 px-4 rounded-md flex items-center justify-center transition duration-300 shadow-md border border-slate-500'
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <LogIn className='mr-2' size={18} />
                  Login
                </Link>
              </>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Navbar;