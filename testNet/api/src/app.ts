import { connect, Contract, Gateway, hash, Network } from "@hyperledger/fabric-gateway";
import { NextFunction, Request, Response } from "express";
import { newGrpcConnection, newIdentity, newSigner } from "./gateway";
import { Client } from "@grpc/grpc-js";
import { chaincodeName, channelName, collectionName, DATABASE_NAME, MONGO_URL } from "./constants";
import { initLedger, ledgerCreateDocument, ledgerHealthCheck } from "./documentInterface";
import { Db, MongoClient } from "mongodb";
import multer, { FileFilterCallback } from 'multer';
import { error } from "console";
import { createHash, Hash } from "crypto";
import path from "path";
import { calculateHash, DocumentDB } from "./utils";

const fs = require('fs')
const crypto = require('crypto');
const express = require("express");

//configure multer to use in memory buffers 
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

//hyperledger connection detials to make available is different files 
export let gateway: Gateway;
export let client:Client;
export let network:Network;
export let contract:Contract;
export let db:Db;

export const hashingAlgo:Hash = createHash('sha256');

export let highestAssetId:number;




function generatedNewID() : string{
  highestAssetId = highestAssetId + 1;
  return "doc"+highestAssetId.toString();
}

//set the id back if the function fails 
function undoNewID():void{
  highestAssetId = highestAssetId - 1;
}

var app = express();
//enable logging each request that turns up 
app.use((req:Request, res:Response, next:NextFunction) => {
  console.log('Time: ', Date.now());
  next();
});

app.use(express.json());
/**
 * Healthcheck endpoint
 */
app.get("/healthcheck", (req:Request, res:Response) => {
  ledgerHealthCheck(contract).then(value => {
    console.log("Result :" , value);
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
 app.post("/documents", upload.single('file') , (req:Request, res:Response) => {

    console.log(req.file, req.body)

    if(!req.file){
      console.error("NO FILE ATTACHED TO REQUEST")
      res.status(400).json({Result:"error no file in request"});
      return;
    }
    
    //send file to data base 
    let document: DocumentDB = {
      "documentID":generatedNewID(),
      "creatorID" : req.body.creatorID,
      "documentName" : req.body.documentName,
      "documentType":req.body.documentType,
      "signable":req.body.signable,
      "documentHash":calculateHash(req.file!.path),
      "file":req.file!.buffer
    }

    console.log("saving file to db",document);

    db.collection(collectionName).insertOne(document).then((result) =>{

      console.log("inserted obj id",result);

      //update the ledger now that the file has successfully been stored 
      ledgerCreateDocument(contract,document.documentID,document.documentName,document.creatorID,document.documentHash,document.documentType,document.signable).then(()=>{
        res.sendStatus(200);
      }).catch((err)=>{

        console.error("error logging in ledger",err);
        res.status(500).json({Error:err});
      })

    }).catch((err)=>{
      console.error("error saving in database",err)
      res.status(500).json({Error:err});
      
    })

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
    }).then(() => {
      
      //get the highest id 

      db.collection(collectionName).aggregate([
        {
          // Step 1: Add a new field that extracts the numeric part from `documentID`
          $addFields: {
            numericPart: {
              $toInt: {
                $arrayElemAt: [
                  {
                    $regexFind: {
                      input: "$documentID",
                      regex: /(\d+)$/, // Match digits at the end of the string
                    },
                  },
                  0,
                ],
              },
            },
          },
        },
        {
          // Step 2: Sort the documents in descending order based on the numeric part
          $sort: { numericPart: -1 },
        },
        {
          // Step 3: Limit the result to just one document (the one with the highest number)
          $limit: 1,
        },
      ]).toArray().then((result) =>{
        if(result.length > 0){
          highestAssetId = result[0].numericPart;
        }else{
          highestAssetId = 0;
        }
        console.log("HighestId found",highestAssetId);
      }).catch((error) =>{
        console.error("error getting highest ID",error);
      });
    })


  }catch (error) {
    console.error('Failed to connect to MongoDB', error);
    console.log('Failed to connect to MongoDB');
    process.exitCode = 1;
  }

  
  
 

}
