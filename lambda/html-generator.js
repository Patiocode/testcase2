const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

exports.handler = async (event) => {
  console.log('HTML Generator Lambda called', JSON.stringify(event, null, 2));
  
  try {
    const body = JSON.parse(event.body);
    const { title, content, type } = body;
    
    // Generate HTML code (your existing logic)
    const htmlCode = `<!DOCTYPE html>
<html>
<head>
    <title>${title}</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 40px; }
        .container { max-width: 800px; margin: 0 auto; }
    </style>
</head>
<body>
    <div class="container">
        <h1>${title}</h1>
        <div>${content}</div>
    </div>
</body>
</html>`;
    
    // Save to database
    const savedCode = await prisma.generatedCode.create({
      data: {
        title,
        htmlCode,
        type: type || 'lambda-generated'
      }
    });
    
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({
        success: true,
        id: savedCode.id,
        htmlCode: htmlCode,
        message: 'HTML generated successfully via Lambda function'
      })
    };
    
  } catch (error) {
    console.error('Lambda error:', error);
    
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({
        success: false,
        error: error.message
      })
    };
  }
};