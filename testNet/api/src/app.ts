import { connect, Contract, Gateway, hash, Network } from "@hyperledger/fabric-gateway";
import { NextFunction, Request, Response } from "express";
import { newGrpcConnection, newIdentity, newSigner } from "./gateway";
import { Client } from "@grpc/grpc-js";
import { chaincodeName, channelName, collectionName, DATABASE_NAME, MONGO_URL } from "./constants";
import { ledgerCheckDuplicate, ledgerCreateDocument, ledgerDelete, ledgerGetAllDocuments, ledgerHealthCheck, ledgerReadDocument, ledgerRenameDocument, ledgerRetrieveHistory, ledgerUpdateDocumentHash, ledgerUpdateSignable } from "./documentInterface";
import { Db, MongoClient} from "mongodb";
import multer from 'multer';
import {createHash, Hash } from "crypto";
import {DocumentAction, DocumentDB, DocumentLedger, PythonController } from "./utils";
import {PyBridge} from 'pybridge';
import { documentStateNode } from "./auditFunctionality";

const crypto = require('crypto');
const express = require("express");

//configure multer to use in memory buffers 
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

//python bridge 
const bridge = new PyBridge({python: 'python3', cwd: __dirname});
const controller = new PythonController(bridge);
//hyperledger connection detials to make available is different files 
export let gateway: Gateway;
export let client:Client;
export let network:Network;
export let contract:Contract;
export let db:Db;

let auditMap : Map<string,documentStateNode> = new Map();
let hashingAlgo:Hash = createHash('sha256');

let highestAssetId:number=0;


function generatedNewID() : string{
  highestAssetId = highestAssetId + 1;
  return "doc"+highestAssetId.toString();
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
    res.status(200).json({"Result":value}); 

  }).catch((error: Error) => {
    console.log("error %s",error);
    res.status(500).json({"Error": error})
    
  })
  
});

/**
 * Fetch all document states from ledger 
 */
app.post("/documents/ledger", (req:Request, res:Response) => {
  ledgerGetAllDocuments(contract,req.body.userID).then(value => {
    res.status(200).json({"Result":value}); 
  }).catch((err : Error) => {
    console.log("error %s",err);
    res.status(500).json({"Error": err})
  })
  
});

/**
 * Fetch a specific documents info from ledger
 * also fetches the file from the database 
 * 
 */
app.post("/documents/read",async (req:Request, res:Response) => {
  
  if(!req.body.documentID || !req.body.userID){
    res.status(400).json({"ERROR":"No documentID or USER ID"});
    return;
  }

  //confirm the id exists 
  //check the entered id is in the database 
  let dbEntry = await db.collection(collectionName).findOne({documentID:req.body.documentID});
  if(!dbEntry){
    res.status(404).json({"Result":"No entry in the database"});
    return;
  }

  //check the id exists in the ledger
  let checkLedgerEntryExists:DocumentLedger | null = await  ledgerReadDocument(contract,req.body.documentID,req.body.userID);
  if(!checkLedgerEntryExists){
    res.status(404).json({"Result":"No id found in ledger"});
    return;
  }

  ledgerReadDocument(contract,req.body.documentID,req.body.userID).then((ledgerResult) => {

    //fetch from database 
    db.collection(collectionName).findOne({"documentID":req.body.documentID}).then((result) =>{

      console.log("Read document",result)
      // Include the raw file data as a Base64 string in the response
      const encodedFile = dbEntry.file.toString('base64'); // Encode binary to Base64
      res.status(200).json({"LedgerData":ledgerResult,"fileData":encodedFile})

    }).catch((err:Error) => {

      console.log("error fetching file from database",err)
      res.status(404).json({"Error":err})
    })
    
  }).catch((err:Error) => {
    console.log("error reading file",err)
    res.status(404).json({"Error":err})
  })
  
});

/**
 * Creating a document
 * Document to store and register is in the payload 
 * hash the document 
 * send the file to the db 
 * log the file in the ledger 
 */
 app.post("/documents", upload.single('file') , (req:Request, res:Response) => {

    if(!req.file){
      console.error("NO FILE ATTACHED TO REQUEST")
      res.status(400).json({"Result":"error no file in request"});
      return;
    }
    //send file to data base 
    let document: DocumentDB = {
      "documentID":generatedNewID(),
      "creatorID" : req.body.creatorID,
      "documentName" : req.file.originalname,
      "documentType":req.body.documentType,
      "signable":req.body.signable,
      "documentHash":calculateHash(req.file!.buffer),
      "file":req.file!.buffer
    }

    //check that nothing with the same name or hash already exists 

    ledgerCheckDuplicate(contract,document.documentName,document.documentHash).then((result)=>{
      if(result == true){
        
      console.log("saving file to db",document);
    
        db.collection(collectionName).insertOne(document).then((result) =>{


          console.log("inserted obj id",result);
          controller.generateVectors.extract_and_embed_pdf(req.file!.buffer).then((result:number[]) =>{
            
            //update the ledger now that the file has successfully been stored 
            ledgerCreateDocument(contract,document.documentID,document.documentName,document.creatorID,document.documentHash,document.documentType,document.signable,result).then(()=>{
              res.sendStatus(200);

            
            }).catch((err)=>{
      
              console.error("error logging in ledger",err);
              res.status(500).json({"Error":err});
              
            })

          }).catch((err)=>{
    
            console.error("error generating embedding",err);
            res.status(500).json({"Error":err});
            
          })
          
    
        }).catch((err)=>{
          console.error("error saving in database",err)
          res.status(500).json({"Error":err});
          
        })
      }else{
        res.status(404).json({"Error":"THIS DOCUMENT NAME OR HASH ALREADY EXISTS"});
      }
    }).catch((err) => {
      res.status(500).json({"Error":err});
    })
   

 });

/**Edit a document or its properties 
 * need to reupload the document to recalculate the hash 
 */
app.post("/documents/:documentid", upload.single('file') ,async (req:Request,res:Response) => {

  console.log("in /documents", req.file, req.body)

  if(!req.file){
    console.error("NO FILE ATTACHED TO REQUEST")
    res.status(400).json({"Result":"error no file in request"});
    return;
  }

  //check the entered id is in the database 
  let dbEntry = await db.collection(collectionName).findOne({documentID:req.params.documentid});
  if(!dbEntry){
    res.status(404).json({"Result":"No entry in the database"});
    return;
  }
  //check the id exists in the ledger
  let checkLedgerEntryExists:DocumentLedger | null = await  ledgerReadDocument(contract,req.params.documentid,req.body.userID);
  if(!checkLedgerEntryExists){
    res.status(404).json({"Result":"No id found in ledger"});
    return;
  }

  //send file to data base 
  let document: DocumentDB = {
    "documentID":req.params.documentid,
    "creatorID" :dbEntry.creatorID,//not allowed to update the creator id 
    "documentName" : req.file.originalname,//name always pulled from the file itself 
    "documentType":req.body.documentType || dbEntry.documentType ,
    "signable":req.body.signable || dbEntry.signable,
    "documentHash":calculateHash(req.file!.buffer),
    "file":req.file!.buffer
  }

  // Update the hash of the file in the ledger and database
  db.collection(collectionName).updateOne({ documentID: req.params.documentid }, { $set: document })
  .then(() => {
    // Check if the document hash needs updating in the ledger
    if (document.documentHash !== checkLedgerEntryExists.documentID) {
      controller.generateVectors.extract_and_embed_pdf(req.file!.buffer).then((result:number[]) =>{
        return ledgerUpdateDocumentHash(contract, req.params.documentid, document.documentHash,req.body.userID,result);
      
      })

    }
  })
  .then(() => {
    // Check if the signable flag has changed
    if(req.body.signable){
      if (req.body.signable !== dbEntry.signable) {
        return ledgerUpdateSignable(contract, req.params.documentid, req.body.signable,req.body.userID);
      }
    }

  })
  .then(() => {
    // Check if the name has changed
    if (req.file!.originalname !== checkLedgerEntryExists.documentName) {
      return ledgerRenameDocument(contract, req.params.documentid, req.file!.originalname,req.body.userID);
    }
  })
  .then(() => {
    // Send the 200 response after all updates are successful
    res.status(200).json({ "Result": "Updates made" });
  })
  .catch((err) => {
    // Handle any errors from any of the promises
    res.status(500).json({ "Error": err.message || "An error occurred during the update process" });
  });

  
})

/**
 * Deleting a document 
 * id and user id provided in body
 */
app.delete("/documents", (req:Request, res:Response) => {

  if (!req.body || !req.body.documentID || !req.body.userID) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  ledgerDelete(contract,req.body.documentID,req.body.userID).then(()=>{

    res.status(200).json({"DeleteStatus":"Successful"});

  }).catch((err:Error)=>{
    console.log("error",err)
    res.status(500).json({"Error deleting document":err.message,"DocID":req.params.id})
  })
  
});

/**
 * get the transaction history of a particular key 
 */
app.get("/documents/history/:documentid" , (req:Request, res:Response) => {
  if(!req.params.documentid){

    res.status(400).json({"Error no documentid provided":"no id"})
  }
  ledgerRetrieveHistory(contract,req.params.documentid).then((result) =>{
    res.status(200).json({"History":result});
  }).catch((err:Error) =>{
    console.log(err)
    res.status(500).json({"Error":err.message});
  })
});

/**
 * sets up the audit history object 
 */
app.get("/documents/audit/setup" , async (req:Request, res:Response) => {
  //get all the document ids from the database 

  const documents : DocumentLedger[] =  await ledgerGetAllDocuments(contract,"audit")

  let histories : Map<string,DocumentLedger[]> = new Map;
  for(let i =0;i < documents.length;i++){
      histories.set(documents[i].documentID,await ledgerRetrieveHistory(contract,documents[i].documentID))
  }

  //read the histories into the datastructures 
  //for each history iterate from the end to the start and read them into the audit blocks 
  for (let [key, value] of histories) {
    
    console.log(`Key: ${key}`);

    //iterate from the end of the value to the start 
    //add the create operations to the correspondng entries in the audit map 

    for(let j = value.length - 1 ;j >= 0 ; j --){
      //create a node
      let node : documentStateNode = new documentStateNode(value[j])

      //add to the audit hashmap if it is a created event
      if(value[j].lastAction == DocumentAction.CREATED){
        console.log("Creation event for " , value[j].documentID)
        auditMap.set(value[j].documentID,node)

      }else{
        //add to the appropriate chain of events
        //go along the events till you read a node where next is null 
        //get the start node
        //iterate to the end 
        let docBlock = auditMap.get(value[j].documentID)
        if(!docBlock){
          console.log("THE DOCUMENT DOESNT EXIST AUDIT BUILDER FAILED")
          return 
        }

        let end : Boolean = false;
        
        while(end == false){
          if(docBlock.next == null){
   
            docBlock.setNext(node);
            node.setPrevious(docBlock);
            end = true;
          }else{
            docBlock = docBlock?.next;
          }
        }
      }

    }
  }
  res.status(200).json({"RESULT":"SUCCESS"})
});



/**
 * fetches the audit history with the semantic change scores 
 */
app.get("/documents/audit", async (req: Request, res: Response) => {
  try {
    // Declare result as an object with the desired structure
    const result: { [key: string]: { "STATE": DocumentLedger, "CHANGE_SCORE": Number }[] } = {};

    // Iterate over the audit map
    for (let [key, value] of auditMap) {
      // Create a new list for the current document
      const items: { "STATE": DocumentLedger, "CHANGE_SCORE": Number }[] = [];

      let current: documentStateNode | null = value;

      // Traverse the linked list
      while (current != null) {
        items.push({
          "STATE": current.state,
          "CHANGE_SCORE": current.semanticChangeScore
        });
        current = current.next;
      }

      // Assign the list to the result object
      result[key] = items;
    }

    // Send the result as a JSON response
    res.json(result);
  } catch (error) {
    console.error("Error fetching audit history:", error);
    res.status(500).send("Internal Server Error");
  }
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


  /**
 * hashes a file in sync 
 * @param filePath to file to hash
 * @returns 
 */
  function calculateHash(file:Buffer) : string {
    try{
      const digest:string = hashingAlgo.update(file).digest('base64');
      //reset the object 
      hashingAlgo = crypto.createHash('sha256');
      return digest
    }catch(err){
      console.error('Error reading or hashing file:', err);
      return "";
    }
  }