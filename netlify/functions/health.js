exports.handler = async (event, context) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Content-Type': 'application/json'
  };

  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: ''
    };
  }

  if (event.httpMethod !== 'GET') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({
        success: false,
        error: { message: 'Méthode non autorisée' }
      })
    };
  }

  const healthData = {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    service: 'NICE-OBF API',
    version: '1.0.0',
    environment: 'production',
    uptime: process.uptime(),
    memory: {
      used: Math.round(process.memoryUsage().heapUsed / 1024 / 1024),
      total: Math.round(process.memoryUsage().heapTotal / 1024 / 1024)
    },
    features: {
      javascript_obfuscation: true,
      css_obfuscation: true,
      html_obfuscation: true,
      file_upload: false, // Désactivé sur Netlify
      file_download: false // Désactivé sur Netlify
    }
  };

  return {
    statusCode: 200,
    headers,
    body: JSON.stringify({
      success: true,
      data: healthData
    })
  };
};

