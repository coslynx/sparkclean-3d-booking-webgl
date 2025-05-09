// src/components/layout/Header.tsx
 /**
  * Purpose: Renders the header section with navigation and branding.
  * Author: AI Assistant
  * Creation Date: June 27, 2024
  * Last Modification Date: June 27, 2024
  */
 

 import React, { useState } from 'react';
 import { Link } from 'react-router-dom';
 import { Menu } from 'lucide-react';
 import Button from 'src/components/core/Button';
 import 'src/styles/layout/header.css';
 

 interface HeaderProps {
  logoSrc?: string;
  navLinks?: { text: string; url: string; }[];
 }
 

 const Header: React.FC<HeaderProps> = ({
  logoSrc = '/public/images/logo.svg',
  navLinks = [
  { text: 'Services', url: '/services' },
  { text: 'About', url: '/about' },
  { text: 'Contact', url: '/contact' },
  ],
 }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
 

  const toggleMenu = () => {
  setIsMenuOpen(!isMenuOpen);
  };
 

  const closeMenu = () => {
  setIsMenuOpen(false);
  };
 

  const safeURL = (url: string): string => {
  try {
  new URL(url);
  return url;
  } catch (e) {
  console.error('Invalid URL:', url);
  return '/'; // Fallback to homepage if invalid
  }
  };
 

  return (
  <header className="fixed top-0 w-full bg-secondary shadow-md z-10">
  <nav className="container mx-auto px-4 py-3 flex items-center justify-between">
  <Link to="/" className="flex items-center" aria-label="Homepage">
  <img
  src={logoSrc}
  alt="Cleaning Service Logo"
  className="h-8 w-auto mr-2"
  onError={(e: any) => {
  console.error('Failed to load image:', logoSrc);
  e.target.onerror = null; // Prevents infinite loop
  e.target.src = '/public/images/placeholder-logo.svg'; // Placeholder image
  }}
  />
  <span className="font-bold text-xl">CleanHome</span>
  </Link>
 

  <div className="hidden md:flex items-center space-x-4">
  {navLinks.map((link) => (
  <Link
  key={link.text}
  to={safeURL(link.url)}
  className="text-gray-700 hover:text-primary transition duration-300"
  aria-label={`Navigate to ${link.text} page`}
  >
  {link.text}
  </Link>
  ))}
  <Button onClick={() => console.log('Book Now clicked')}>Book Now</Button>
  </div>
 

  <div className="md:hidden">
  <button
  onClick={toggleMenu}
  className="text-gray-700 hover:text-primary focus:outline-none focus:ring-2 focus:ring-primary"
  aria-label="Open navigation menu"
  >
  <Menu className="h-6 w-6"/>
  </button>
 

  {isMenuOpen && (
  <div className="absolute top-full right-0 bg-white shadow-md rounded-md mt-1 py-2 w-48">
  {navLinks.map((link) => (
  <Link
  key={link.text}
  to={safeURL(link.url)}
  className="block px-4 py-2 text-gray-700 hover:bg-gray-100 transition duration-300"
  aria-label={`Navigate to ${link.text} page`}
  onClick={closeMenu}
  >
  {link.text}
  </Link>
  ))}
  <Button onClick={() => {
  console.log('Book Now clicked');
  closeMenu();
  }} className="block px-4 py-2">Book Now</Button>
  </div>
  )}
  </div>
  </nav>
  </header>
  );
 };
 

 export default Header;