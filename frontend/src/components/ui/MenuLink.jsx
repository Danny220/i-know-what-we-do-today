import React from 'react';
import { Link } from 'react-router-dom';

const MenuLink = ({ to, children }) => (
  <Link to={to} className="text-xl font-bold text-white">
    {children}
  </Link>
);

export default MenuLink;