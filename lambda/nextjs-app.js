const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Simple handler for API routes
exports.handler = async (event) => {
  console.log('Next.js Lambda called', JSON.stringify(event, null, 2));
  
  const path = event.path;
  const method = event.httpMethod;
  
  // Handle different API routes
  if (path === '/api/codes' && method === 'GET') {
    const codes = await prisma.generatedCode.findMany({
      orderBy: { createdAt: 'desc' }
    });
    
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify(codes)
    };
  }
  
  if (path === '/api/codes' && method === 'POST') {
    const body = JSON.parse(event.body);
    const newCode = await prisma.generatedCode.create({
      data: body
    });
    
    return {
      statusCode: 201,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify(newCode)
    };
  }
  
  // Default response
  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*'
    },
    body: JSON.stringify({
      message: 'Next.js App running on Lambda',
      path: path,
      method: method
    })
  };
};