import React, { useEffect, useRef } from "react";

const CheckClickOutside = ({ onClickOutside, children }) => {
  const ref = useRef(null);
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (ref.current && !ref.current.contains(event.target)) {
        onClickOutside && onClickOutside();
      }
    };
    window.addEventListener("mousedown", handleClickOutside);
    return () => window.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (!children) {
    return null;
  }

  return <div ref={ref}>{children}</div>;
};

export default CheckClickOutside;
