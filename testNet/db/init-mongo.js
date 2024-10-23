// Create a new database and switch to it
db = db.getSiblingDB('document_database');

// Create a new collection and insert documents
db.documents.insert([
  { document_name: 'Document 1',
    hash: '2378erhgnjreniugd849ngsjgrj',
    timestamp: '25:70:40:40'
   }
]);

// Create a user with read and write privileges for the database
db.createUser({
  user: 'myuser',
  pwd: 'mypassword',
  roles: [
    { role: 'readWrite', db: 'document_database' }
  ]
});