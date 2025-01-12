const  axios = require('axios');
const path = require('path');
const fs = require('fs');
const FormData = require('form-data');

describe('API Endpoint Tests', () => {
  // Define the base URL for the API
  const baseURL = process.env.TEST_APP_URL || 'http://localhost:3000';
  const apiClient = axios.create({ baseURL });

  jest.setTimeout(300000); // Set timeout for all tests to 5 mins

  
  // Creating a document
  test('/documents - should return 200 on success', async () => {
    const formData = new FormData();
    const filePath = path.resolve('../Vishaan_Khanna_CV-3.pdf'); // Ensure you have a file in your test directory
    const fileBuffer= await fs.readFileSync(filePath);
    formData.append('file', fileBuffer,"Vishaan_Khanna_CV-3.pdf");
    formData.append('creatorID', 'testUser');
    formData.append('documentType', 'testType');
    formData.append('signable', "true");

    const res = await apiClient.post('/documents', formData, {
      headers: formData.getHeaders(),
    });
    expect(res.status).toBe(200);
  });
});