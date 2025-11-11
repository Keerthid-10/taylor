import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

interface userdetails{
        userName: string;
        password: string;
        confirmPassword:string,
        phoneNumber: string;
        email: string;
        continent: string
        }

const Navbar:React.FC = () =>{
    const navigate = useNavigate();
    const location = useLocation();
    const User = sessionStorage.getItem("user");
    const userD: userdetails | null = User ? JSON.parse(User) : null;

    const handleLogout = () =>{
        sessionStorage.removeItem("user");
        sessionStorage.removeItem("isAuthenticated");

        navigate("/login");
    }
    const isActive = (path: string) => {
        return location.pathname === path ? "active" : "";
    };

    return(
       <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
            <div className="container-fluid">
                 <Link className="navbar-brand" to="/">
                    🎵 Concert Hub
                </Link></div> 
                <button
                    className="navbar-toggler"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#navbarNav"
                    aria-controls="navbarNav"
                    aria-expanded="false"
                    aria-label="Toggle navigation"
                >
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarNav">
                    <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                        <li className="nav-item">
                            <Link 
                            className={`nav-link ${isActive("/home")}`}
                            to="/home"
                            >
                                Home
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link
                            className={`nav-link${isActive("/artists")}`}
                            to="/artists"
                            > Artists
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link
                            className={`nav-link${isActive("/fav")}`}
                            to="/fav"
                            > Favorites
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link 
                                className={`nav-link ${isActive("/book-concerts")}`} 
                                to="/book-concerts"
                            >
                                Book Concerts
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link 
                                className={`nav-link ${isActive("/summary")}`} 
                                to="/summary"
                            >
                                Favorites
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link 
                                className={`nav-link ${isActive("/purchase")}`} 
                                to="/purchase"
                            >
                                Purchase 
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link 
                                className={`nav-link ${isActive("/purchase-history")}`} 
                                to="/purchase-history"
                            >
                                Purchase History
                            </Link>
                        </li>
                    </ul>
                    <div className="d-flex align-items-center">
                        {userD && (
                            <span className="navbar-text me-3 text-light">
                                Welcome, <strong>{userD.userName}</strong>
                            </span>
                        )}
                        <button 
                            className="btn btn-outline-light" 
                            onClick={handleLogout}
                        >
                            Logout
                        </button>
                    </div>
                </div>
        </nav>
    );
};

export default Navbar;