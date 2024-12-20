import React from 'react';

const Navbar: React.FC = () => {
  return (

    <header className="header">
      <h1>hello</h1>
      <div className="header-left">
        <button className="home-button">Home</button>
      </div>
      <div className="header-right">
        <button className="nav-button">Page 1</button>
        <button className="nav-button">Page 2</button>
        <button className="nav-button">Page 3</button>
        <button className="nav-button">Page 4</button>
      </div>
    </header>

  );
};

export default Navbar;
