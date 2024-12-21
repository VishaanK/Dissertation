import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { DocumentLedger } from './utils';

const userID = "GUI";
const API = "http://localhost:3000/documents/ledger"
const Alldocuments: React.FC = () => {
    const [data, setData] = useState<DocumentLedger[]>([]);
    const [refresh,setRefresh] = useState<Boolean>();

    useEffect(() => {
        const fetch = async () => {
            try {
                const response = await axios.post(API, { userID: userID }); // Replace "yourUserID" with the actual ID
                setData(response.data.Result);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };
        fetch();
    }, [refresh]); // Add dependencies as needed
        
    
    return(
        <>    
        <div>
            <button onClick={() =>{setRefresh(!refresh)}}>Refresh</button>
        </div>
        <div>
            <p>
                This page shows all the documents which are being logged in the system
            </p>
        </div>
        <table style={{ borderCollapse: "collapse", width: "100%" }}>
  <thead>
    <tr>
      <th style={{ border: "1px solid black", padding: "8px" }}>Document ID</th>
      <th style={{ border: "1px solid black", padding: "8px" }}>Document Name</th>
      <th style={{ border: "1px solid black", padding: "8px" }}>Creator ID</th>
      <th style={{ border: "1px solid black", padding: "8px" }}>Document Hash</th>
      <th style={{ border: "1px solid black", padding: "8px" }}>Document Type</th>
      <th style={{ border: "1px solid black", padding: "8px" }}>Signable</th>
      <th style={{ border: "1px solid black", padding: "8px" }}>Last Action</th>
    </tr>
  </thead>
  <tbody>
    {data.map((doc, index) => (
      <tr key={index}>
        <td style={{ border: "1px solid black", padding: "8px" }}>{doc.documentID}</td>
        <td style={{ border: "1px solid black", padding: "8px" }}>{doc.documentName}</td>
        <td style={{ border: "1px solid black", padding: "8px" }}>{doc.creatorID}</td>
        <td style={{ border: "1px solid black", padding: "8px" }}>{doc.documentHash}</td>
        <td style={{ border: "1px solid black", padding: "8px" }}>{doc.documentType}</td>
        <td style={{ border: "1px solid black", padding: "8px" }}>{doc.signable ? "Yes" : "No"}</td>
        <td style={{ border: "1px solid black", padding: "8px" }}>{doc.lastAction}</td>
      </tr>
    ))}
  </tbody>
</table>
</>
    )
       
    
}

export default Alldocuments;