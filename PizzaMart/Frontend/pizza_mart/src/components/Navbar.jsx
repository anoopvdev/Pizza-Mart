
import {FaSearch,FaShoppingCart,FaBars} from 'react-icons/fa'
import "./Landing.css"
import { useState } from 'react'
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartCotext';
import { useProfile } from '../context/ProfileContext';
const Navbar = () => {
    const [search, setSearch] = useState("");
    const [menuOpen, setMenuOpen] = useState(false);
    const { addToCart, cartCount } = useCart();
    const {profile} = useProfile();
  return (
    <>
      

    {/* <nav className="navbar navbar-expand-lg sticky-top pizza-navbar bg-white ">
        <div className="container-fluid px-4">
          <a className="navbar-brand pizza-brand" href="/">
            🍕 Pizza <span>Mart</span>
          </a>

          <button
            className="navbar-toggler"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle navigation"
            >
            <FaBars />
            </button>

          <div className={`navbar-collapse ${menuOpen ? "d-block" : "collapse"}`}>
          <ul className="navbar-nav mx-auto">

            
             <div className='navbar-nav d-flex flex-row gap-5'>
            <Link className='text-decoration-none text-dark home-nav-link active' to="/home" >Home</Link>
            <Link className='text-decoration-none  text-dark  ' to='/menu'>Menu</Link>
            <Link className='text-decoration-none text-dark '>About</Link>
            <Link className='text-decoration-none  text-dark  '>Contact</Link>
            </div>
            </ul>
            

            
            <form
                        className="search-box"
                        onSubmit={(e) => {
                          e.preventDefault();
                          document.getElementById("menu")?.scrollIntoView({
                            behavior: "smooth",
                          });
                        }}
                      >
                        <FaSearch />
                        <input
                          type="search"
                          placeholder="Search for pizzass..."
                          value={search}
                          onChange={(e) => setSearch(e.target.value)}
                        />
                      </form>
                <div className="nav-actions ">
                            
                    <Link href="/cart" className="btn btn-danger cart-button ">
                              <FaShoppingCart /> Cart {cartCount}
                    </Link>
                    
                    
                    <a className="profile-nav-icon" href="/profile" aria-label="Profile">
                      <i className="bi bi-person-circle"></i>
                     </a>

                  </div>
            
          

          
        </div>
        </div>
      </nav> */}
      <nav className="navbar navbar-expand-lg sticky-top pizza-navbar bg-white ">
        <div className="container-fluid px-4">
          <Link className="navbar-brand pizza-brand" href="/">
            🍕 Pizza <span>Mart</span>
          </Link>

          <button
            className="navbar-toggler"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle navigation"
            >
            <FaBars />
            </button>

          <div className={`navbar-collapse ${menuOpen ? "d-block" : "collapse"}`}>
          <ul className="navbar-nav mx-auto">

            
             <div className='navbar-nav d-flex flex-row gap-5'>
            <Link className='text-decoration-none text-dark home-nav-link active' to="/home" >Home</Link>
            <Link className='text-decoration-none  text-dark  ' to='/menu'>Menu</Link>
            <Link className='text-decoration-none text-dark 'to='/about'>About</Link>
            <Link className='text-decoration-none  text-dark  'to='/contact'>Contact</Link>
            </div>
            </ul>
            

            
            <form
                        className="search-box"
                        onSubmit={(e) => {
                          e.preventDefault();
                          document.getElementById("menu")?.scrollIntoView({
                            behavior: "smooth",
                          });
                        }}
                      >
                        <FaSearch />
                        <input
                          type="search"
                          placeholder="Search for pizzass..."
                          value={search}
                          onChange={(e) => setSearch(e.target.value)}
                        />
                      </form>
                <div className="nav-actions ">
                            
                    <Link to='/cart' className="btn btn-danger cart-button ">
                              <FaShoppingCart /> Cart ({cartCount})
                    </Link>
                    

                    <a className="profile-nav-icon" href="/profile" aria-label="Profile">
                      <i className="bi bi-person-circle"></i>
                     </a>

                  </div>
        </div>
        </div>
      </nav>
    </>
  )
}

export default Navbar
