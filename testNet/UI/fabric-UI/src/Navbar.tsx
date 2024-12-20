import React from 'react';

const Navbar: React.FC = () => {
  return (

    <header className="header">
      
      <div className="header-left">
        <button className="home-button">Home</button>
        <h2> Document tracking system</h2>
      </div>
      <div className="header-right">
        <button className="nav-button">View all documents</button>
        <button className="nav-button">View edit history of a document</button>
        <button className="nav-button">Log a new document</button>
        <button className="nav-button">Edit a document</button>
      </div>
    </header>

  );
};

export default Navbar;
