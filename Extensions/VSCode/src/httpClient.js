const https = require('https');
const http = require('http');
const { URL } = require('url');

class HttpClient {
    async post(url, data) {
        return this.request('POST', url, data);
    }

    async request(method, urlString, data = null) {
        const parsedUrl = new URL(urlString);
        const options = {
            method: method,
            hostname: parsedUrl.hostname,
            port: parsedUrl.port ? parseInt(parsedUrl.port) : (parsedUrl.protocol === 'https:' ? 443 : 80),
            path: parsedUrl.pathname + parsedUrl.search,
            headers: {
                'Content-Type': 'application/json',
            },
        };

        if (data) {
            const bodyData = JSON.stringify(data);
            options.headers['Content-Length'] = Buffer.byteLength(bodyData);
        }

        return new Promise((resolve, reject) => {
            const protocol = parsedUrl.protocol === 'https:' ? https : http;
            const req = protocol.request(options, (res) => {
                let responseBody = '';

                res.on('data', (chunk) => {
                    responseBody += chunk;
                });

                res.on('end', () => {
                    try {
                        const statusCode = res.statusCode || 500;
                        if (statusCode >= 200 && statusCode < 300) {
                            const parsedBody = responseBody ? JSON.parse(responseBody) : null;
                            resolve({ success: true, data: parsedBody });
                        } else {
                            const errorMessage = `HTTP ${statusCode}: ${responseBody}`;
                            console.error(errorMessage);
                            resolve({ success: false, message: errorMessage });
                        }
                    } catch (parseError) {
                        const errorMessage = `Failed to parse response: ${parseError.message}`;
                        console.error(errorMessage);
                        resolve({ success: false, message: errorMessage });
                    }
                });
            });

            req.on('error', (error) => {
                console.error(`Request error: ${error.message}`);
                resolve({ success: false, message: error.message });
            });

            if (data) {
                req.write(JSON.stringify(data));
            }

            req.end();
        });
    }
}

module.exports = { HttpClient };