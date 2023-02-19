import React from "react"
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link
} from "react-router-dom";
import "./Navbar.css"
const Navbar = () => {
    return (
        <nav className="navbar">
            <div className="container">
            <h3 className="logo">SafeSites</h3>
            <ul className="nav-links">
                <Link to='/scan'><li>Home</li></Link>
                <Link to='/about'><li>About Us</li></Link>
            </ul>
            </div>
        </nav>
    )
}

export default Navbar