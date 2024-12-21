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
        <Link to= {"/documentHistory"}> <button className="nav-button">View edit history of a document</button></Link>
        <Link to = {"/addDocument"}>  <button className="nav-button">Log a new document</button></Link>
        <Link to = {'/editDocument'} ><button className="nav-button">Edit a document</button> </Link>
      </div>
    </header>

  );
};

export default Navbar;
