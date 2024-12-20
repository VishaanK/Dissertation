import React, { useState } from 'react';
import axios from 'axios';
import { DocumentLedger } from './utils';

const API = "http://localhost:3000/documents"
const Alldocuments: React.FC = () => {
    const [data, setData] = useState<DocumentLedger[]>([]);

    return(
        <></>
    )
       
    
}

export default Alldocuments;