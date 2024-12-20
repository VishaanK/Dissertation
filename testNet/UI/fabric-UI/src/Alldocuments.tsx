import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { DocumentLedger } from './utils';

const API = "http://localhost:3000/documents/ledger"
const Alldocuments: React.FC = () => {
    const [data, setData] = useState<DocumentLedger[]>([]);

    useEffect (() => {
        const fetch = async () => {
            const result = await axios(API);
            setData(result.data.Result)
        }
        fetch()
    })
       
    
    return(
        <>    
    <table>
      <thead>
        <tr>
          <th>Creator ID</th>
          <th>Document Hash</th>
          <th>Document ID</th>
          <th>Document Name</th>
          <th>Document Type</th>
          <th>Signable</th>
          <th>Last Interacted With ID</th>
          <th>Last Action</th>
        </tr>
      </thead>
      <tbody>
        {data.map((doc, index) => (
          <tr key={index}>
            <td>{doc.creatorID}</td>
            <td>{doc.documentHash}</td>
            <td>{doc.documentID}</td>
            <td>{doc.documentName}</td>
            <td>{doc.documentType}</td>
            <td>{doc.signable ? "Yes" : "No"}</td>
            <td>{doc.lastInteractedWithID}</td>
            <td>{doc.lastAction}</td>
          </tr>
        ))}
      </tbody>
    </table></>
    )
       
    
}

export default Alldocuments;