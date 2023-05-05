import React, { useEffect, useRef, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import CheckClickOutside from "./CheckClickOutside";

const CustomLink = ({ href, title, className = "" }) => {
  // console.log(router.asPath)
  return (
    <Link href={href} className={`${className} relative group`}>
      {title}
      <span
        className={`h-0.5 inline-block bg-black absolute left-0 -bottom-0.5 
      group-hover:w-full transition-[width] ease   dark:bg-light
   
      `}
      >
        &nbsp;
      </span>
    </Link>
  );
};
const Nav = () => {
  const [isOpen, setIsOpen] = useState(false);
  const handleOpenModal = () => setIsOpen(true);
  const handleCloseModal = () => setIsOpen(false);
  return (
    <header className="p-2 shadow-lg bg-white">
      <div className="container flex justify-between mx-auto ">
        <a
        
          href="#"
          aria-label="Back to homepage"
          className="flex items-center p-0 font-bold text-primary"
        >
          ONLINE CHAT
        </a>
        <div className="items-center flex-shrink-0 hidden lg:flex">
          <NavLink to='/login' className="self-center px-8 py-2.5 rounded">Login</NavLink>
          <NavLink to='/register' className="self-center px-8 py-2.5 hover:bg-secondary  font-semibold rounded bg-violet-500 text-white">
            Register
          </NavLink>
        </div>
        <button className="p-4 lg:hidden" onClick={handleOpenModal}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            className="w-6 h-6  "
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M4 6h16M4 12h16M4 18h16"
            ></path>
          </svg>
        </button>
      </div>

      {isOpen && (
        <CheckClickOutside onClickOutside={handleCloseModal}>
          <div
            className=" text-white rounded-2xl fixed min-w-[60vw] max-w-[95vw] top-1/2 left-1/2 -translate-x-1/2
            -translate-y-1/2 p-2 bg-black/60 backdrop-blur-sm "
          >
            <ul>
              <li>home</li>
              <li>page</li>
              <li>contact</li>
            </ul>
          </div>
        </CheckClickOutside>
      )}
    </header>
  );
};

export default Nav;
