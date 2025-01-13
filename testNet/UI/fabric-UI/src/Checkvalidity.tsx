
import React, { useState } from 'react';
import axios from 'axios';

const API = "http://localhost:3000/documents/verify";

const Checkvalidity: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [formData, setFormData] = useState({
    documentID: ''
  });

  function handleInputChange(event: React.ChangeEvent<HTMLInputElement>) {
    const { name, value} = event.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  }

  function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const uploadedFile = event.target.files ? event.target.files[0] : null;
    setFile(uploadedFile);
  }

  async function submitData(event: React.FormEvent) {
    event.preventDefault(); // Prevent the default form submission

    // Validate file existence
    if (!file) {
      console.error("No file selected");
      return;
    }

    // Create FormData and append fields
    const data = new FormData();
    data.append('file', file);
    data.append('documentID' , formData.documentID);
    try {
      const response = await axios.post(API , data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.status === 200) {
        console.log("File uploaded successfully:", response.data);
        alert("The file is valid ")
      }else{
        alert("The file is not valid ")
      }
    } catch (error) {
      console.error("Error uploading file:", error);
    }
  }

  return (
    <><div><h1>This page enables a file to be verified to matach the on chain version</h1></div>
    <form onSubmit={submitData} style={{ display: "flex", flexDirection: "column", gap: "1em", width: "300px" }}>
          <div>
              <label htmlFor="documentID">document ID:</label>
              <input type="text" name="documentID" id="documentID" value={formData.documentID} onChange={handleInputChange} />
          </div>

          <div>
              <label htmlFor="file">File:</label>
              <input type="file" name="file" id="file" onChange={handleFileChange} />
          </div>

          <button type="submit">Submit Document</button>
      </form></>
  );
};

export default Checkvalidity;
