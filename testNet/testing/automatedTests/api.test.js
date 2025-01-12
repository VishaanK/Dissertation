const  axios = require('axios');

describe('API Endpoint Tests', () => {
  // Define the base URL for the API
  const baseURL = process.env.TEST_APP_URL || 'http://localhost:3000';
  const apiClient = axios.create({ baseURL });

  // Add a delay of 0.25 seconds between tests
  const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
  const testDelay = 250; // 0.25 seconds

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

  test('/documents/ledger - should return 500 on failure', async () => {
    const res = await apiClient.post('/documents/ledger', {}); // Missing userID
    expect(res.status).toBe(500);
  });

  // Fetch specific document info
  test('/documents/read - should return 200 on success', async () => {
    const res = await apiClient.post('/documents/read', { documentID: 'doc1', userID: 'testUser' });
    expect(res.status).toBe(200);
  });

  test('/documents/read - should return 400 if documentID or userID is missing', async () => {
    const res = await apiClient.post('/documents/read', {});
    expect(res.status).toBe(400);
  });

  // Creating a document
  test('/documents - should return 200 on success', async () => {
    const formData = new FormData();
    formData.append('file', Buffer.from('test file content'), 'testfile.pdf');
    formData.append('creatorID', 'testUser');
    formData.append('documentType', 'testType');
    formData.append('signable', true);

    const res = await apiClient.post('/documents', formData, {
      headers: formData.getHeaders(),
    });
    expect(res.status).toBe(200);
  });

  test('/documents - should return 400 if file is missing', async () => {
    const formData = new FormData();
    formData.append('creatorID', 'testUser');
    formData.append('documentType', 'testType');
    formData.append('signable', true);

    const res = await apiClient.post('/documents', formData, {
      headers: formData.getHeaders(),
    });
    expect(res.status).toBe(400);
  });

  // Edit a document
  test('/documents/:documentid - should return 200 on success', async () => {
    const formData = new FormData();
    formData.append('file', Buffer.from('updated file content'), 'updatedfile.pdf');
    formData.append('documentType', 'newType');
    formData.append('signable', false);

    const res = await apiClient.post('/documents/doc1', formData, {
      headers: formData.getHeaders(),
    });
    expect(res.status).toBe(200);
  });

  test('/documents/:documentid - should return 400 if file is missing', async () => {
    const res = await apiClient.post('/documents/doc1', {
      documentType: 'newType',
      signable: false,
    });
    expect(res.status).toBe(400);
  });

  // Delete a document
  test('/documents - should return 200 on success', async () => {
    const res = await apiClient.delete('/documents', { data: { documentID: 'doc1', userID: 'testUser' } });
    expect(res.status).toBe(200);
  });

  test('/documents - should return 400 if documentID or userID is missing', async () => {
    const res = await apiClient.delete('/documents', { data: {} });
    expect(res.status).toBe(400);
  });

  // Verify a document
  test('/documents/verify - should return 200 on success', async () => {
    const formData = new FormData();
    formData.append('file', Buffer.from('test file content'), 'testfile.pdf');
    formData.append('documentID', 'doc1');

    const res = await apiClient.post('/documents/verify', formData, {
      headers: formData.getHeaders(),
    });
    expect(res.status).toBe(200);
  });

  test('/documents/verify - should return 400 if documentID or file is missing', async () => {
    const res = await apiClient.post('/documents/verify', {});
    expect(res.status).toBe(400);
  });

  // Transaction history of a document
  test('/documents/history/:documentid - should return 200 on success', async () => {
    const res = await apiClient.get('/documents/history/doc1');
    expect(res.status).toBe(200);
  });

  test('/documents/history/:documentid - should return 400 if documentID is missing', async () => {
    const res = await apiClient.get('/documents/history/');
    expect(res.status).toBe(400);
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
});
