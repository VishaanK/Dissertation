
import React, { useState } from 'react';
import axios from 'axios';

const API = "http://localhost:3000/documents/";

const Editdocument: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [formData, setFormData] = useState({
    docID: '',
    userID: '',
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
    data.append('userID' , formData.userID);
    data.append('documentType', formData.documentType);
    data.append('signable', formData.signable ? 'true' : 'false');
    console.log(API + formData.docID)
    try {
      const response = await axios.post(API + formData.docID, data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.status === 200) {
        console.log("File uploaded successfully:", response.data);
      }
    } catch (error) {
      console.error("Error uploading file:", error);
    }
  }

  return (
    <form onSubmit={submitData} style={{ display: "flex", flexDirection: "column", gap: "1em", width: "300px" }}>
      <div>
        <label htmlFor="docID">docID ID:</label>
        <input type="text" name="docID" id="docID" value={formData.docID} onChange={handleInputChange} />
      </div>
      
      <div>
        <label htmlFor="userID">userID:</label>
        <input type="text" name="userID" id="userID" value={formData.userID} onChange={handleInputChange} />
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
    </form>
  );
};

export default Editdocument;
