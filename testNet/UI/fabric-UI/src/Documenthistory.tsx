import React, {useState } from 'react';
import axios from 'axios';
import { DocumentLedger } from './utils';


const API = "http://localhost:3000/documents/history/"
const Documenthistory: React.FC = () => {
    const [data, setData] = useState<DocumentLedger[]>([]);
 

    function submitForm(formData : FormData){
      if(!formData){
        return;
      }

      const id = formData.get("docID");
      let url = API + id;
      
      const fetch = async () => {
        try {
            const response = await axios(url); // Replace "yourUserID" with the actual ID
            setData(response.data.History);
        } catch (error) {
            console.error("Error fetching data:", error);
        }
      };
      fetch();
    }
    return(
        <>    
        <div>
          <form onSubmit={(event) => {
            event.preventDefault(); // Prevent the default form submission
            const formData = new FormData(event.currentTarget); // Extract FormData from the form
            submitForm(formData); // Pass FormData to submitForm
            }}>

            <input name="docID" />
            <button type="submit">Search</button>
          </form>
        </div>
        <div>
            <p>
                This page shows the history of a document when the id is entered. If nothing is found ensure the ID is correct. The page ignores events caused by the GUI but the reads 
                are still recorded in the logs
            </p>
        </div>
        <table style={{ borderCollapse: "collapse", width: "100%" }}>
  <thead>
    <tr>
      <th style={{ border: "1px solid black", padding: "8px" }}>Creator ID</th>
      <th style={{ border: "1px solid black", padding: "8px" }}>Document Hash</th>
      <th style={{ border: "1px solid black", padding: "8px" }}>Document ID</th>
      <th style={{ border: "1px solid black", padding: "8px" }}>Document Name</th>
      <th style={{ border: "1px solid black", padding: "8px" }}>Document Type</th>
      <th style={{ border: "1px solid black", padding: "8px" }}>Signable</th>
      <th style={{ border: "1px solid black", padding: "8px" }}>Last Interacted With ID</th>
      <th style={{ border: "1px solid black", padding: "8px" }}>Last Action</th>
    </tr>
  </thead>
  <tbody>
    {data.filter((doc) => doc.lastInteractedWithID !== "GUI").map((doc, index) => (
      
      <tr key={index}>
        <td style={{ border: "1px solid black", padding: "8px" }}>{doc.creatorID}</td>
        <td style={{ border: "1px solid black", padding: "8px" }}>{doc.documentHash}</td>
        <td style={{ border: "1px solid black", padding: "8px" }}>{doc.documentID}</td>
        <td style={{ border: "1px solid black", padding: "8px" }}>{doc.documentName}</td>
        <td style={{ border: "1px solid black", padding: "8px" }}>{doc.documentType}</td>
        <td style={{ border: "1px solid black", padding: "8px" }}>{doc.signable ? "Yes" : "No"}</td>
        <td style={{ border: "1px solid black", padding: "8px" }}>{doc.lastInteractedWithID}</td>
        <td style={{ border: "1px solid black", padding: "8px" }}>{doc.lastAction}</td>
      </tr>
    ))}
  </tbody>
</table>
</>
    )
       
    
}

export default Documenthistory;