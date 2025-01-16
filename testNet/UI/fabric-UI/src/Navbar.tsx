import React from 'react';
import { Link } from 'react-router';

const Navbar: React.FC = () => {
  return (

    <header className="header">
      
      <div className="header-left">
      <Link to={"/"}><button className="nav-button" >Home</button></Link> 
        <h2> Document tracking system</h2>
      </div>
      <div className="header-right">
        <Link to={"/allDocuments"}><button className="nav-button" >View all</button></Link> 
        <Link to= {"/documentHistory"}> <button className="nav-button">Document History</button></Link>
        <Link to = {"/addDocument"}>  <button className="nav-button">Log new document</button></Link>
        <Link to = {'/editDocument'} ><button className="nav-button">Edit</button> </Link>
        <Link to = {'/deleteDocument'} ><button className="nav-button">Delete</button> </Link>
        <Link to = {'/checkValidity'} ><button className="nav-button">Verify</button> </Link>
        <Link to = {'/fetchFile'} ><button className="nav-button">Fetch a file</button></Link>
      </div>
    </header>

  );
};

export default Navbar;
