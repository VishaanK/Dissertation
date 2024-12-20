import React from 'react';
import { Link } from 'react-router';

const Navbar: React.FC = () => {
  return (

    <header className="header">
      
      <div className="header-left">
        <button className="home-button">Home</button>
        <h2> Document tracking system</h2>
      </div>
      <div className="header-right">
        <Link to={"/allDocuments"}><button className="nav-button" >View all documents</button></Link> 
        <button className="nav-button">View edit history of a document</button>
        <button className="nav-button">Log a new document</button>
        <button className="nav-button">Edit a document</button>
      </div>
    </header>

  );
};

export default Navbar;
