
import React, { useState } from 'react';
import axios from 'axios';

const API = "http://localhost:3000/documents/read";

const Fetchfile: React.FC = () => {
  const [formData, setFormData] = useState({
    documentID: '',
    userID:''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);


  function handleInputChange(event: React.ChangeEvent<HTMLInputElement>) {
    const { name, value} = event.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  }
  async function submitData(event: React.FormEvent) {
    event.preventDefault(); // Prevent the default form submission
    setLoading(true);
    setError(null);
    const data = new FormData();
    data.append('documentID' , formData.documentID);
    data.append('userID' , formData.userID);
    try {
      const response = await axios.post(API, data, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.status === 200 && response.data.fileData) {
        console.log("File fetched successfully:", response.data);

        // Decode the Base64 file data
        const byteCharacters = atob(response.data.fileData);
        const byteNumbers = Array.from(byteCharacters, (char) => char.charCodeAt(0));
        const byteArray = new Uint8Array(byteNumbers);

        // Create a Blob from the byte array
        const fileBlob = new Blob([byteArray]);
        const downloadUrl = URL.createObjectURL(fileBlob);

        // Trigger the download
        const a = document.createElement('a');
        a.href = downloadUrl;
        a.download = response.data.LedgerData.documentName; // You can dynamically set the filename here
        document.body.appendChild(a);
        a.click();
        a.remove();
      } else {
        setError('Failed to fetch the file. Please try again.');
      }
    } catch (error) {
      console.error("Error fetching file:", error);
      setError('An error occurred while fetching the file.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <><div><h1>This page enables a user to fetch a file</h1></div>
    <form onSubmit={submitData} style={{ display: "flex", flexDirection: "column", gap: "1em", width: "300px" }}>
          <div>
              <label htmlFor="documentID">document ID:</label>
              <input type="text" name="documentID" id="documentID" value={formData.documentID} onChange={handleInputChange} />
          </div>

          <div>
              <label htmlFor="userID">user ID:</label>
              <input type="text" name="userID" id="userID" value={formData.userID} onChange={handleInputChange} />
          </div>


          <button type="submit" disabled={loading}>
          {loading ? 'Fetching...' : 'Fetch File'}
        </button>
        {error && <p style={{ color: 'red' }}>{error}</p>}
      </form></>
  );
};

export default Fetchfile;
