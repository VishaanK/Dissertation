import React, { useState } from 'react';
import axios from 'axios';

const API = "http://localhost:3000/documents"
const Deletedocument: React.FC = () => {
      const [formData, setFormData] = useState({
        userID: '',
        documentID: ''
      });


    
    function handleInputChange(event: React.ChangeEvent<HTMLInputElement>) {
        const { name, value} = event.target;
        setFormData((prevState) => ({
        ...prevState,
        [name]: value,
        }));
    }
 
    
  async function submitData(event: React.FormEvent) {
    event.preventDefault(); // Prevent the default form submission

    // Create FormData and append fields
    const data = new FormData();
    data.append('userID', formData.userID);
    data.append('creatorID', formData.documentID);

    try {
        const response = await axios.delete(API, {
    
            data: {
                userID: formData.userID,
                documentID: formData.documentID,
            },
            headers: {
                "Content-Type": "application/json"
            }
        });
        if(response.status == 200){
            alert("Successfully Deleted")
        }else{
            alert("Delete operation failed")
        }
        console.log(response.data); // Handle the response

    } catch (error : any) {
        console.error('Error:', error.response || error.message);
    }
    }
    return(
        <>    
        <div><h2>This page enables a file to be deleted</h2></div>
       <form onSubmit={submitData} style={{ display: "flex", flexDirection: "column", gap: "1em", width: "300px" }}>
       
      <div>
        <label htmlFor="userID">User ID:</label>
        <input type="text" name="userID" id="userID" value={formData.userID} onChange={handleInputChange} />
      </div>

      <div>
        <label htmlFor="documentID">Document ID:</label>
        <input type="text" name="documentID" id="documentID" value={formData.documentID} onChange={handleInputChange} />
      </div>

      <button type="submit">Submit Document</button>
    </form>
        </>
    )
       
    
}

export default Deletedocument;