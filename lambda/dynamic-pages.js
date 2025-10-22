const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

exports.handler = async (event) => {
  console.log('Dynamic Pages Lambda called', JSON.stringify(event, null, 2));
  
  try {
    const pageId = event.pathParameters.id;
    
    // Fetch the generated code from database
    const code = await prisma.generatedCode.findUnique({
      where: { id: pageId }
    });
    
    if (!code) {
      return {
        statusCode: 404,
        headers: {
          'Content-Type': 'text/html',
          'Access-Control-Allow-Origin': '*'
        },
        body: '<html><body><h1>Page Not Found</h1></body></html>'
      };
    }
    
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'text/html',
        'Access-Control-Allow-Origin': '*'
      },
      body: code.htmlCode
    };
    
  } catch (error) {
    console.error('Lambda error:', error);
    
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'text/html',
        'Access-Control-Allow-Origin': '*'
      },
      body: '<html><body><h1>Server Error</h1></body></html>'
    };
  }
};