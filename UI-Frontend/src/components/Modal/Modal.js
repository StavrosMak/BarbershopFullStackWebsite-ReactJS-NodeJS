import React, { useState, useContext, useEffect } from 'react';
import { motion } from 'framer-motion';
import SignInForm from './SignInForm';
import SignUpForm from './SignUpForm';
import { AuthContext } from '../../Context/AuthContext';
import { Link } from 'react-router-dom';
import useFetchData from '../../CustomHooks/useDatabase';
import './Modal.css';

export default function Modal({ open, handleNavbar, onClose }) {
  const [authMode, setAuthMode] = useState('Sign In');
  const [Role, setRole] = useState(null);
  const { isLoggedIn, handleLogout, user } = useContext(AuthContext);
  const { checkRole } = useFetchData();

  useEffect(() => {
    const fetchRole = async () => {
      if (isLoggedIn && user) { // Check if the user is logged in and user object exists
        try {
          const value = await checkRole(user.id);
          setRole(value[0].Role);
        } catch (error) {
          console.error("Error fetching role:", error);
        }
      }
    };

    fetchRole();
  }, [checkRole, isLoggedIn, user]);

  const handleClick = () => {
    onClose();
    handleNavbar();
  };
  const changeAuthMode = () => {
    setAuthMode(authMode === 'Sign In' ? 'Sign Up' : 'Sign In');
  };

  const logoutHandler = () => {
    handleLogout();
    onClose();
  };

  const modalAnimation = {
    initial: { opacity: 0, scale: 0.75 },
    animate: { opacity: 1, scale: 1, transition: { ease: 'easeOut', duration: 0.15 } },
    exit: { opacity: 0, scale: 0.75, transition: { ease: 'easeIn', duration: 0.15 } }
  };

  if (!open) return null;

  return (
    <div className='Modal'>
      <motion.div {...modalAnimation} className='ModalContent'>
        <div className='signInHeader'>
          <h2>{authMode}</h2>
          <button className='closeBtn' onClick={onClose}>
            <i className='fa-solid fa-xmark'></i>
          </button>
        </div>
        {isLoggedIn ? (
          <div className='loggedBox'>
            <p>Welcome, {user.name}!</p>
            {Role === 1 ? <Link className='submitBtn actionBtn ' onClick={handleClick} to='/allappointments'>Control Panel</Link> : ''}
            <Link className='submitBtn actionBtn ' onClick={handleClick} to='/myappointments'>MyAppointments</Link>
            {Role === 2 ? <Link className='submitBtn actionBtn ' onClick={handleClick} to='/updateprofile'>Update Profile</Link> : ''}
            <Link to='/' className='submitBtn actionBtn' onClick={logoutHandler}>Logout</Link>
          </div>
        ) : (
          <>
            {authMode === 'Sign In' ? (
              <SignInForm changeAuthMode={changeAuthMode} />
            ) : (
              <SignUpForm changeAuthMode={changeAuthMode} onClose={onClose} />
            )}
          </>
        )}
      </motion.div>
    </div>
  );
}
