const  axios = require('axios');
const path = require('path');
const fs = require('fs');
const FormData = require('form-data');

describe('API Endpoint Tests', () => {
  // Define the base URL for the API
  const baseURL = process.env.TEST_APP_URL || 'http://localhost:3000';
  const apiClient = axios.create({ baseURL });

  // Add a delay of 0.25 seconds between tests
  const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
  const testDelay = 250; // 0.25 seconds
  jest.setTimeout(300000); // Set timeout for all tests to 5 mins


  afterEach(async () => {
    await delay(testDelay);
  });

  // Healthcheck Endpoint
  test('/healthcheck - should return 200 on success', async () => {
    const res = await apiClient.get('/healthcheck');
    expect(res.status).toBe(200);
  });

  // Fetch all documents from the ledger
  test('/documents/ledger - should return 200 on success', async () => {
    const res = await apiClient.post('/documents/ledger', { userID: 'testUser' });
    expect(res.status).toBe(200);
  });
  //test for 400 when user ID is missing 
  test('/documents/ledger - should return 500 on failure', async () => {
    try{
      const res = await apiClient.post('/documents/ledger', {});

    }catch(e ){
      expect(e.response.status).toBe(500);

    }
  });


  
  // Creating a document
  test('/documents - should return 200 on success', async () => {
    const formData = new FormData();
    const filePath = path.resolve('../Vishaan_Khanna_CV-3.pdf'); // Ensure you have a file in your test directory
    const fileBuffer= fs.readFileSync(filePath);
    formData.append('file', fileBuffer,"Vishaan_Khanna_CV-3.pdf");
    formData.append('creatorID', 'testUser');
    formData.append('documentType', 'testType');
    formData.append('signable', "true");

    const res = await apiClient.post('/documents', formData, {
      headers: formData.getHeaders(),
    });
    expect(res.status).toBe(200);
  });
  //test a 400 returned when no file is provided 
  test('/documents - should return 400 if file is missing', async () => {
    const formData = new FormData();
    formData.append('creatorID', 'testUser');
    formData.append('documentType', 'pdf');
    formData.append('signable', "true");

    try{
      const res = await apiClient.post('/documents', formData, {
        headers: formData.getHeaders(),
      });
    }catch(e){
      if (e.response) {
        console.log('Response Error:', e.response);
        expect(e.response.status).toBe(400); // This will check the status code in the response
      }
    }
    
    
  });


  // Fetch specific document info
  test('/documents/read - should return 200 on success', async () => {
    const res = await apiClient.post('/documents/read', { documentID: 'doc1', userID: 'testUser' });
    expect(res.status).toBe(200);
  });
  //test for 400 when information is missing from the request 
  test('/documents/read - should return 400 if documentID or userID is missing', async () => {
    try{
      const res = await apiClient.post('/documents/read', {});
    }catch(e){
      expect(e.response.status).toBe(400);
    }
    
    
  });


  // Edit a document
  test('/documents/:documentid - should return 200 on success', async () => {
    const formData = new FormData();
    const filePath = path.resolve('../Vishaan_Khanna_CV-5.pdf'); // Ensure you have a file in your test directory
    const fileBuffer = await fs.readFileSync(filePath);
    formData.append('file', fileBuffer,"Vishaan_Khanna_CV-5.pdf");
    formData.append('documentType', 'pdf');
    formData.append('signable', "false");

    const res = await apiClient.post('/documents/doc1', formData, {
      headers: formData.getHeaders(),
    });
    expect(res.status).toBe(200);
  });

  //test for 400 when information is missing from the request 
  test('/documents/:documentid - should return 400 if file is missing', async () => {
    try{
      const res = await apiClient.post('/documents/doc1', {
        documentType: 'newType',
        signable: false,
      });
    }catch(e){
      expect(e.response.status).toBe(400);

    }
    

  });



  // Verify a document
  test('/documents/verify - should return 200 on success', async () => {
    const formData = new FormData();

    const filePath = path.resolve('../Vishaan_Khanna_CV-5.pdf'); // Ensure you have a file in your test directory
    const fileBuffer = await fs.readFileSync(filePath);

    formData.append('file', fileBuffer,"Vishaan_Khanna_CV-5.pdf");

    formData.append('documentID', 'doc1');

    const res = await apiClient.post('/documents/verify', formData, {
      headers: formData.getHeaders(),
    });
    expect(res.status).toBe(200);
  });

  test('/documents/verify - should return 400 if documentID or file is missing', async () => {
    try{
      const res = await apiClient.post('/documents/verify', {});

    }catch(e){
      expect(e.response.status).toBe(400);

    }
    
  });

  // Transaction history of a document
  test('/documents/history/:documentid - should return 200 on success', async () => {
    const res = await apiClient.get('/documents/history/doc1');
    expect(res.status).toBe(200);
  });

  //test recieve 404 if the document doesnt exist 
  test('/documents/history/:documentid - should return 400 if documentID is missing', async () => {
    try{
      const res = await apiClient.get('/documents/history/');

    }catch(e){
      expect(e.response.status).toBe(404);

    }

  });

  // Audit setup
  test('/documents/audit/setup - should return 200 on success', async () => {
    const res = await apiClient.get('/documents/audit/setup');
    expect(res.status).toBe(200);
  });

  // Audit history with change scores
  test('/documents/audit - should return 200 on success', async () => {
    const res = await apiClient.get('/documents/audit');
    expect(res.status).toBe(200);
  });

  // Delete a document
  test('/documents - should return 200 on success', async () => {
    const res = await apiClient.delete('/documents', { data: { documentID: 'doc1', userID: 'testUser' } });
    expect(res.status).toBe(200);
  });

  test('/documents - should return 400 if documentID or userID is missing', async () => {

    try{
      const res = await apiClient.delete('/documents', { data: {} });

    }catch(e){
      expect(e.response.status).toBe(400);

    }
  });

});
