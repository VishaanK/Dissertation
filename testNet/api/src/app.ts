import { connect, Contract, Gateway, hash, Network } from "@hyperledger/fabric-gateway";
import { NextFunction, Request, Response } from "express";
import { newGrpcConnection, newIdentity, newSigner } from "./gateway";
import { Client } from "@grpc/grpc-js";
import { chaincodeName, channelName, DATABASE_NAME, MONGO_URL } from "./constants";
import { initLedger, ledgerCreateDocument, ledgerHealthCheck } from "./documentInterface";
import { Db, MongoClient } from "mongodb";
import multer, { FileFilterCallback } from 'multer';

const crypto = require('crypto');
let express = require("express");

// Set up multer storage configuration
const upload = multer({ dest: 'uploads/' });

//hyperledger connection detials to make available is different files 
export let gateway: Gateway;
export let client:Client;
export let network:Network;
export let contract:Contract;
export let db:Db;


export const highestAssetId = getHighestAssetId;

//connect to db, get highest asset ID 

export function getHighestAssetId(){

}

var app = express();
//enable logging each request that turns up 
app.use((req:Request, res:Response, next:NextFunction) => {
  console.log('Time: ', Date.now());
  next();
});


app.get("/healthcheck", (req:Request, res:Response) => {
  console.log("/healthcheck pinged ")
  ledgerHealthCheck(contract).then(value => {
    console.log("Result :" , value);
    res.status(200).json({Result:value}); 

  }).catch((error: Error) => {
    console.log("error %s",error);
    res.status(500).json({error: error})
  })
  
});

app.get("/init", (req:Request, res:Response) => {
  console.log("/init pinged ")
  initLedger(contract).then(value => {
    console.log("Ledger Initid ... Init");
    res.status(200).json({Result:value}); 

  }).catch((error: Error) => {
    console.log("error %s",error);
    res.status(500).json({error: error})
  })
  
});

/**
 * Fetch all documents
 */
app.get("/documents", (req:Request, res:Response) => {
  res.sendStatus(200);
  
});

/**
 * Fetch a specific document 
 * 
 */
app.get("/documents/:id", (req:Request, res:Response) => {
  const docID = req.query.id;
  console.log("Fetching doc %s", docID)

  res.sendStatus(200);
  
});

/**
 * Creating a document
 * Document to store and register is in the payload 
 * hash the document 
 * send the file to the db 
 * log the file in the ledger 
 */
 app.post("/documents", upload.single('file') ,(req:Request, res:Response) => {
   const docname = req.body.documentName;
   const creatorID = req.body.creatorID;
   const document = req.body.document;
   const documentType = req.body.documentType;
   const signable = req.body.signable;

   console.log(req.file, req.body)

   //create an id 
   
   //cnst hashValue = await getHash('path/to/file');
   //ledgerCreateDocument(contract,docname,creatorID,)
   res.sendStatus(200);
 });

/**Edit a document 
 * 
 */
app.put("/documents/:id",(req:Request,res:Response) => {


  res.sendStatus(200);
})

/**rename
 * 
 */
app.put("/documents/rename/:id",(req:Request,res:Response) => {

  res.sendStatus(200);
})

/**
 * Deleting a document 
 * :id is the id of the document 
 */
app.delete("/documents/:id", (req:Request, res:Response) => {
  const docID = req.query.id;
  console.log("Deleting doc %s", docID)
  res.sendStatus(200);
});


//set the api server listening 
app.listen(3000, () => {
  setupAPI();
  console.log("Server running on port 3000");
 
 });

/**
 * Establish connection to database and to fabric 
 */
function setupAPI(){
  client =  newGrpcConnection()

  gateway = connect({
    client,
    identity: newIdentity(),
    signer: newSigner(),
    hash: hash.sha256,
    //timeout options
    evaluateOptions: () => {
      return { deadline: Date.now() + 5000 }; // 5 seconds
    },
    endorseOptions: () => {
        return { deadline: Date.now() + 15000 }; // 15 seconds
    },
    submitOptions: () => {
        return { deadline: Date.now() + 5000 }; // 5 seconds
    },
    commitStatusOptions: () => {
        return { deadline: Date.now() + 60000 }; // 1 minute
    },
  });
  
  //connect 
  try {
    // Get a network instance representing the channel where the smart contract is deployed.
    network = gateway.getNetwork(channelName);

    // Get the smart contract from the network.
    contract = network.getContract(chaincodeName);
            // Initialize a set of asset data on the ledger using the chaincode 'InitLedger' function.
    
    } catch (error) {
    console.error('FAILED TO CONNECT TO FABRIC GATEWAY', error);
    console.log('FAILED TO CONNECT TO FABRIC GATEWAY');
    process.exitCode = 1;
  }


  //connect to database 
  try{
    // Connect to MongoDB
    MongoClient.connect(MONGO_URL)
    .then((client) => {
      console.log('Connected to MongoDB');
      //only need the db as its extracted from the client 
      db = client.db(DATABASE_NAME);
    })


  }catch (error) {
    console.error('Failed to connect to MongoDB', error);
    console.log('Failed to connect to MongoDB');
    process.exitCode = 1;
  }

}
