const JavaScriptObfuscator = require('javascript-obfuscator');
const CleanCSS = require('clean-css');
const { minify } = require('html-minifier-terser');

// Configuration par défaut pour JavaScript
const jsDefaultOptions = {
  compact: true,
  controlFlowFlattening: false,
  deadCodeInjection: false,
  debugProtection: false,
  debugProtectionInterval: 0,
  disableConsoleOutput: false,
  identifierNamesGenerator: 'hexadecimal',
  log: false,
  numbersToExpressions: false,
  renameGlobals: false,
  selfDefending: false,
  simplify: true,
  splitStrings: false,
  stringArray: true,
  stringArrayCallsTransform: false,
  stringArrayEncoding: [],
  stringArrayIndexShift: true,
  stringArrayRotate: true,
  stringArrayShuffle: true,
  stringArrayWrappersCount: 1,
  stringArrayWrappersChainedCalls: true,
  stringArrayWrappersParametersMaxCount: 2,
  stringArrayWrappersType: 'variable',
  stringArrayThreshold: 0.75,
  unicodeEscapeSequence: false
};

// Configuration par défaut pour CSS
const cssDefaultOptions = {
  level: 2,
  returnPromise: false
};

// Configuration par défaut pour HTML
const htmlDefaultOptions = {
  collapseWhitespace: true,
  removeComments: true,
  removeRedundantAttributes: true,
  removeScriptTypeAttributes: true,
  removeStyleLinkTypeAttributes: true,
  useShortDoctype: true,
  minifyCSS: true,
  minifyJS: true
};

// Fonction d'obfuscation JavaScript
function obfuscateJavaScript(code, options = {}) {
  try {
    const startTime = Date.now();
    const finalOptions = { ...jsDefaultOptions, ...options };
    
    if (!code || typeof code !== 'string') {
      throw new Error('Code JavaScript requis');
    }

    const result = JavaScriptObfuscator.obfuscate(code, finalOptions);
    const obfuscatedCode = `// NICE-OBF\n${result.getObfuscatedCode()}`;
    
    const processingTime = Date.now() - startTime;
    const originalSize = new TextEncoder().encode(code).length;
    const obfuscatedSize = new TextEncoder().encode(obfuscatedCode).length;
    
    return {
      obfuscatedCode,
      originalSize,
      obfuscatedSize,
      compressionRatio: originalSize / obfuscatedSize,
      processingTime
    };
    
  } catch (error) {
    throw new Error(`Erreur d'obfuscation JavaScript: ${error.message}`);
  }
}

// Fonction d'obfuscation CSS
function obfuscateCSS(code, options = {}) {
  try {
    const startTime = Date.now();
    const finalOptions = { ...cssDefaultOptions, ...options };
    
    if (!code || typeof code !== 'string') {
      throw new Error('Code CSS requis');
    }

    const result = new CleanCSS(finalOptions).minify(code);
    
    if (result.errors && result.errors.length > 0) {
      throw new Error(`Erreur d'obfuscation CSS: ${result.errors.join(', ')}`);
    }
    
    const obfuscatedCode = `/* NICE-OBF */\n${result.styles}`;
    
    const processingTime = Date.now() - startTime;
    const originalSize = new TextEncoder().encode(code).length;
    const obfuscatedSize = new TextEncoder().encode(obfuscatedCode).length;
    
    return {
      obfuscatedCode,
      originalSize,
      obfuscatedSize,
      compressionRatio: originalSize / obfuscatedSize,
      processingTime,
      stats: result.stats,
      warnings: result.warnings
    };
    
  } catch (error) {
    throw new Error(`Erreur d'obfuscation CSS: ${error.message}`);
  }
}

// Fonction d'obfuscation HTML
function obfuscateHTML(code, options = {}) {
  try {
    const startTime = Date.now();
    const finalOptions = { ...htmlDefaultOptions, ...options };
    
    if (!code || typeof code !== 'string') {
      throw new Error('Code HTML requis');
    }

    const minifiedHTML = minify(code, finalOptions);
    const obfuscatedCode = `<!-- NICE-OBF -->\n${minifiedHTML}`;
    
    const processingTime = Date.now() - startTime;
    const originalSize = new TextEncoder().encode(code).length;
    const obfuscatedSize = new TextEncoder().encode(obfuscatedCode).length;
    
    return {
      obfuscatedCode,
      originalSize,
      obfuscatedSize,
      compressionRatio: originalSize / obfuscatedSize,
      processingTime
    };
    
  } catch (error) {
    throw new Error(`Erreur d'obfuscation HTML: ${error.message}`);
  }
}

exports.handler = async (event, context) => {
  // Headers CORS
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Content-Type': 'application/json'
  };

  // Gérer les requêtes OPTIONS (preflight)
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: ''
    };
  }

  try {
    // Vérifier la méthode HTTP
    if (event.httpMethod !== 'POST') {
      return {
        statusCode: 405,
        headers,
        body: JSON.stringify({
          success: false,
          error: { message: 'Méthode non autorisée' }
        })
      };
    }

    // Parser le body
    let body;
    try {
      body = JSON.parse(event.body);
    } catch (error) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({
          success: false,
          error: { message: 'Corps de requête JSON invalide' }
        })
      };
    }

    const { code, type, options = {} } = body;

    if (!code || !type) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({
          success: false,
          error: { message: 'Code et type requis' }
        })
      };
    }

    let result;

    // Obfuscation selon le type
    switch (type.toLowerCase()) {
      case 'javascript':
      case 'js':
        result = obfuscateJavaScript(code, options);
        break;
      case 'css':
        result = obfuscateCSS(code, options);
        break;
      case 'html':
        result = obfuscateHTML(code, options);
        break;
      default:
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({
            success: false,
            error: { message: 'Type non supporté. Utilisez: javascript, css, html' }
          })
        };
    }

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        data: result
      })
    };

  } catch (error) {
    console.error('Erreur dans la fonction obfuscate:', error);
    
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        success: false,
        error: { 
          message: error.message || 'Erreur interne du serveur',
          type: 'OBFUSCATION_ERROR'
        }
      })
    };
  }
};


const { TextEncoder } = require('util');


