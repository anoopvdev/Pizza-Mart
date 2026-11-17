
import { FaSearch, FaShoppingCart, FaBars } from 'react-icons/fa'
import "./Landing.css"
import { useState } from 'react'
import { Link, NavLink } from 'react-router-dom';
import { useCart } from '../context/CartCotext';
import { useProfile } from '../context/ProfileContext';

const Navbar = () => {
    const [search, setSearch] = useState("");
    const [menuOpen, setMenuOpen] = useState(false);

    const { cartCount } = useCart();
    const { profile } = useProfile();

    // Active link class
    const getNavClass = ({ isActive }) =>
        `text-decoration-none ${isActive ? "active-nav-link" : "text-dark"}`;

    return (
        <>
            <nav className="navbar navbar-expand-lg sticky-top pizza-navbar bg-white">
                <div className="container-fluid px-4">

                    <Link className="navbar-brand pizza-brand" to="/">
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

                            <div className="navbar-nav d-flex flex-row gap-5">

                                <NavLink
                                    to="/home"
                                    className={getNavClass}
                                    onClick={() => setMenuOpen(false)}
                                >
                                    Home
                                </NavLink>

                                <NavLink
                                    to="/menu"
                                    className={getNavClass}
                                    onClick={() => setMenuOpen(false)}
                                >
                                    Menu
                                </NavLink>

                                <NavLink
                                    to="/about"
                                    className={getNavClass}
                                    onClick={() => setMenuOpen(false)}
                                >
                                    About
                                </NavLink>

                                <NavLink
                                    to="/contact"
                                    className={getNavClass}
                                    onClick={() => setMenuOpen(false)}
                                >
                                    Contact
                                </NavLink>

                            </div>
                        </ul>

                        

                        <div className="nav-actions">

                            <Link
                                to="/cart"
                                className="btn btn-danger cart-button"
                            >
                                <FaShoppingCart /> Cart ({cartCount})
                            </Link>

                            <Link
                                className="profile-nav-icon"
                                to="/profile"
                                aria-label="Profile"
                            >
                                <i className="bi bi-person-circle"></i>
                            </Link>

                        </div>

                    </div>
                </div>
            </nav>
        </>
    )
}

export default Navbar
