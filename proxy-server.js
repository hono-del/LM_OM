const http = require('http');
const https = require('https');
const fs = require('fs');
const path = require('path');

const PORT = 3000;

// .envファイルを読み込む
function loadEnv() {
  const envPath = path.join(__dirname, '.env');
  if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, 'utf8');
    envContent.split('\n').forEach(line => {
      const [key, value] = line.split('=');
      if (key && value) {
        process.env[key.trim()] = value.trim();
      }
    });
  }
}

loadEnv();
const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;

const server = http.createServer((req, res) => {
  // CORSヘッダーを設定
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, x-api-key');

  // プリフライトリクエストに対応
  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }

  // POSTリクエストのみ処理
  if (req.method === 'POST' && req.url === '/api/anthropic') {
    let body = '';

    req.on('data', chunk => {
      body += chunk.toString();
    });

    req.on('end', () => {
      try {
        const requestData = JSON.parse(body);
        const messages = requestData.messages;
        
        // サーバー側のAPIキーを使用
        const apiKey = ANTHROPIC_API_KEY;
        
        if (!apiKey) {
          res.writeHead(500, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'API key not configured on server' }));
          return;
        }
        
        console.log('Received request with messages:', JSON.stringify(messages, null, 2));

        // Anthropic APIにリクエスト
        const postData = JSON.stringify({
          model: 'claude-sonnet-4-6',
          max_tokens: 2000,
          messages: messages
        });

        const options = {
          hostname: 'api.anthropic.com',
          port: 443,
          path: '/v1/messages',
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': apiKey,
            'anthropic-version': '2023-06-01',
            'Content-Length': Buffer.byteLength(postData)
          }
        };

        const proxyReq = https.request(options, (proxyRes) => {
          let responseData = '';

          proxyRes.on('data', (chunk) => {
            responseData += chunk;
          });

          proxyRes.on('end', () => {
            console.log('Anthropic API response status:', proxyRes.statusCode);
            console.log('Anthropic API response:', responseData);
            
            res.writeHead(proxyRes.statusCode, {
              'Content-Type': 'application/json',
              'Access-Control-Allow-Origin': '*'
            });
            res.end(responseData);
          });
        });

        proxyReq.on('error', (error) => {
          console.error('Proxy request error:', error);
          res.writeHead(500, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: error.message }));
        });

        proxyReq.write(postData);
        proxyReq.end();

      } catch (error) {
        console.error('Error processing request:', error);
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Invalid request' }));
      }
    });
  } else {
    res.writeHead(404);
    res.end();
  }
});

server.listen(PORT, () => {
  console.log(`Proxy server running at http://localhost:${PORT}/`);
  console.log('Ready to proxy requests to Anthropic API');
});
