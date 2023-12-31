import React, { useState, useContext } from "react";
import { HashLink as Link } from 'react-router-hash-link'
import NavbarItems from "../data/Links.json";
import Modal from "../Modal/Modal";
import logo from "../../Images/logo7.png";
import { ModalContext } from "../../Context/ModalContext";
import { AuthContext } from "../../Context/AuthContext";

import "./Navbar2.css";

export default function Navbar() {
    const [colorChange, setColorchange] = useState(false);
    const { isLoggedIn } = useContext(AuthContext);
    const { openModal, setModal } = useContext(ModalContext);
    const [navbarIcon, setNavbarIcon] = useState("fas fa-bars");
    const [menuOpen, setMenuOpen] = useState(false);
    const changeNavbarColor = () => { window.scrollY >= 80 ? setColorchange(true) : setColorchange(false) };
    window.addEventListener("scroll", changeNavbarColor);



    function handleNavbar() {
        setNavbarIcon((prevIcon) =>
            prevIcon === "fas fa-bars" ? "fas fa-times" : "fas fa-bars"
        );
        setMenuOpen((prevOpen) => !prevOpen);
    }

    return (
        <nav className={colorChange ? "Navbar colorChange" : "Navbar"}>
            <div className="NavbarItems">
                <div className="NavbarSiteBrand">
                    <Link smooth to="/#home">
                        <img src={logo} alt="" />
                    </Link>
                </div>
                <div className="menu-icon">
                    <i className={navbarIcon} onClick={handleNavbar}></i>
                </div>
                <div className="NavbarLinks">
                    <ul className={`nav-menu ${menuOpen ? "active" : ""}`}>
                        {NavbarItems.map((item, index) => (
                            <li key={index} className={`${item.cName}`}>
                                <Link smooth
                                    to={item.url}
                                    className="linkItem"
                                    onClick={handleNavbar}
                                >
                                    {item.title}
                                </Link>
                            </li>
                        ))}
                        <li className="mobile-actions">
                            <button
                                title="actions"
                                aria-label="ProfileActions"
                                onClick={() => setModal(true)}
                            >
                                {isLoggedIn ? 'Profile' : 'Sign In'}
                            </button>
                            <Link smooth className="BookBtn" onClick={handleNavbar} to="/book">
                                Book
                            </Link>
                        </li>
                    </ul>
                </div>
                <div className="NavbarActions">
                    <div className="singUpIconSection">
                        <button
                            aria-label="ProfileActions"
                            onClick={() => setModal(true)}
                        >
                            <i className="fa-solid fa-user" style={{ color: "#fff" }}></i>
                        </button>
                    </div>
                    <Link className="BookBtn" to="/book" onClick={handleNavbar}>
                        Book
                    </Link>
                </div>
            </div>
            <Modal open={openModal} handleNavbar={handleNavbar} onClose={() => setModal(false)} />
        </nav>
    );
}
