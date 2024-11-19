// Create a new database and switch to it
db = db.getSiblingDB('document_database');

// Define the collection with schema validation
db.createCollection('documents', {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["documentID", "creatorID", "documentHash", "documentName", "signable", "file"],  // Ensure documentID is required
      properties: {
        documentID: {
          bsonType: "string",
          description: "Must be a string and is required"  // Primary Key
        },
        creatorID: {
          bsonType: "string",
          description: "Must be a string and is required"
        },
        documentHash: {
          bsonType: "string",
          description: "Must be a string and is required"
        },
        documentName: {
          bsonType: "string",
          description: "Must be a string and is required"
        },
        documentType: {
          bsonType: ["string", "null"],
          description: "Can be a string or null to represent the type of the document"
        },
        signable: {
          bsonType: "string",
          description: "Must be a boolean indicating if the document is signable"
        },
        file: {
          bsonType: "binData",
          description: "Must be binary data representing the file content (Word/PDF)"
        }
      }
    }
  }
});

db.documents.createIndex({ documentID: 1 }, { unique: true });
db.documents.createIndex({ creatorID: 1 });
// Create a user with read and write privileges for the database
db.createUser({
  user: 'myuser',
  pwd: 'mypassword',
  roles: [
    { role: 'readWrite', db: 'document_database' }
  ]
});