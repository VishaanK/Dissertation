import React from 'react';
import { Outlet } from 'react-router';
import Navbar from './Navbar';

const Layout: React.FC = () => {
  return (
    <>
    
        <Navbar/>
      <main>
        <Outlet />
      </main>
    </>
  );
};

export default Layout;
