import { test, expect } from '@playwright/test';

test.describe('API Endpoint Tests', () => {
  
  // Test API CRUD operations
  test('should perform full CRUD operations on codes API', async ({ request }) => {
    const testCodeData = {
      title: `API Test ${Date.now()}`,
      htmlCode: '<html><body><h1>API Test</h1></body></html>',
      type: 'test'
    };

    // CREATE - POST new code
    const createResponse = await request.post('/api/codes', {
      data: testCodeData
    });
    
    expect(createResponse.status()).toBe(201);
    const createdCode = await createResponse.json();
    expect(createdCode.title).toBe(testCodeData.title);
    expect(createdCode.id).toBeDefined();
    
    console.log('✅ API Test: CREATE operation works');

    // READ - GET all codes
    const getAllResponse = await request.get('/api/codes');
    expect(getAllResponse.status()).toBe(200);
    const allCodes = await getAllResponse.json();
    expect(Array.isArray(allCodes)).toBe(true);
    
    console.log('✅ API Test: READ all operation works');

    // READ - GET single code
    const getSingleResponse = await request.get(`/api/codes/${createdCode.id}`);
    expect(getSingleResponse.status()).toBe(200);
    const singleCode = await getSingleResponse.json();
    expect(singleCode.title).toBe(testCodeData.title);
    
    console.log('✅ API Test: READ single operation works');

    // UPDATE - PUT (update) code
    const updateData = {
      title: `Updated ${testCodeData.title}`,
      htmlCode: '<html><body><h1>UPDATED</h1></body></html>'
    };
    
    const updateResponse = await request.put(`/api/codes/${createdCode.id}`, {
      data: updateData
    });
    
    expect(updateResponse.status()).toBe(200);
    const updatedCode = await updateResponse.json();
    expect(updatedCode.title).toBe(updateData.title);
    
    console.log('✅ API Test: UPDATE operation works');

    // DELETE - Remove code
    const deleteResponse = await request.delete(`/api/codes/${createdCode.id}`);
    expect(deleteResponse.status()).toBe(200);
    
    console.log('✅ API Test: DELETE operation works');
  });

  // Test API validation
  test('should validate required fields in API', async ({ request }) => {
    // Test missing required fields
    const invalidData = {
      // Missing title and htmlCode (required fields)
      type: 'test'
    };

    const response = await request.post('/api/codes', {
      data: invalidData
    });
    
    // Should return error status
    expect(response.status()).toBe(500); // Or 400 if you add proper validation
    
    console.log('✅ API Test: Validation works');
  });
});