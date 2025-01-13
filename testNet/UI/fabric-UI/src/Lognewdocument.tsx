
import React, { useState } from 'react';
import axios from 'axios';

const API = "http://localhost:3000/documents";

const Lognewdocument: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [formData, setFormData] = useState({
    userID: '',
    creatorID: '',
    documentType: '',
    signable: false,
  });

  function handleInputChange(event: React.ChangeEvent<HTMLInputElement>) {
    const { name, value, type, checked } = event.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: type === 'checkbox' ? checked : value,
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
    data.append('userID', formData.userID);
    data.append('creatorID', formData.creatorID);
    data.append('documentType', formData.documentType);
    data.append('signable', formData.signable ? 'true' : 'false');

    try {
      const response = await axios.post(API, data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.status === 200) {
        alert("file added")
        console.log("File uploaded successfully:", response.data);
      }
    } catch (error) {
      console.error("Error uploading file:", error);
    }
  }

  return (
    <><div><h2>This page enables a document to be logged in the system</h2></div><form onSubmit={submitData} style={{ display: "flex", flexDirection: "column", gap: "1em", width: "300px" }}>
      <div>
        <label htmlFor="userID">User ID:</label>
        <input type="text" name="userID" id="userID" value={formData.userID} onChange={handleInputChange} />
      </div>

      <div>
        <label htmlFor="creatorID">Creator ID:</label>
        <input type="text" name="creatorID" id="creatorID" value={formData.creatorID} onChange={handleInputChange} />
      </div>

      <div>
        <label htmlFor="documentType">Document Type:</label>
        <input type="text" name="documentType" id="documentType" value={formData.documentType} onChange={handleInputChange} />
      </div>

      <div>
        <label htmlFor="signable">Signable:</label>
        <input type="checkbox" name="signable" id="signable" checked={formData.signable} onChange={handleInputChange} />
      </div>

      <div>
        <label htmlFor="file">File:</label>
        <input type="file" name="file" id="file" onChange={handleFileChange} />
      </div>

      <button type="submit">Submit Document</button>
    </form></>
  );
};

export default Lognewdocument;
