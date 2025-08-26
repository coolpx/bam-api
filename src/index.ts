import express from 'express';
import fs from 'fs';
import path from 'path';
import { Endpoint } from './types';

const app = express();
app.use(express.json());

const endpointsDir = path.join(__dirname, 'endpoints');
// Dynamically import all endpoint modules (supporting default export as Endpoint or Endpoint[])
fs.readdirSync(endpointsDir).forEach((file) => {
    if (file.endsWith('.js')) {
        const endpointModule = require(path.join(endpointsDir, file));
        let endpoints = endpointModule.default || endpointModule;
        if (!Array.isArray(endpoints)) endpoints = [endpoints];
        endpoints.forEach((endpoint: Endpoint) => {
            if (
                endpoint &&
                endpoint.url &&
                endpoint.method &&
                endpoint.handler
            ) {
                app[endpoint.method](endpoint.url, endpoint.handler);
                console.log(
                    `Registered endpoint: [${endpoint.method.toUpperCase()}] ${
                        endpoint.url
                    }`
                );
            }
        });
    }
});

app.listen(8080, () => {
    console.log('Server is running on port 8080');
});
