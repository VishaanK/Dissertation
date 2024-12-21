import './index.css'
import App from './App.tsx'
import { BrowserRouter, Route } from "react-router";
import ReactDOM from "react-dom/client";
import { Routes } from "react-router";
import Alldocuments from './Alldocuments.tsx';
import Layout from './Layout.tsx';
import Documenthistory from './Documenthistory.tsx';
import Lognewdocument from './Lognewdocument.tsx';
import Editdocument from './Editdocument.tsx';

const root = document.getElementById("root");
if(root){
  ReactDOM.createRoot(root).render(
    <BrowserRouter>
    <Routes>
      <Route path ='/' element={<Layout/>}>
      <Route index element={<App />} />
      <Route path ='allDocuments' element = {<Alldocuments/>}/>
      <Route path = 'documentHistory' element = {<Documenthistory/>}/>
      <Route path ='addDocument' element = {<Lognewdocument/>}/>
      <Route path ='editDocument' element = {<Editdocument/>}/>
      
      </Route>
    </Routes>
     
    </BrowserRouter>
  );
}else{
  console.log("NO ROOOOOT")
}
