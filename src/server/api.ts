// Simple Express server setup to serve the build output
import compression from 'compression';
import helmet from 'helmet';
import express from 'express';
import path from 'path';

//to import queries from DB service
// import { testQueryAll, testQueryAll2} from './db_setup';
import { any } from 'sequelize/types/lib/operators';
import { testQueryAll, testQueryAll2, testQueryAll3} from './db_setup';

const app = express();
app.use(compression());

const HOST = process.env.HOST || 'localhost';
if (HOST !== 'localhost') {
    app.use(helmet());
    app.use(helmet({
        contentSecurityPolicy: {
            useDefaults: true,
            directives: {
                "upgrade-insecure-requests": null
        
            }
        },
        noSniff: undefined,
    }));
}
const PORT = process.env.PORT || 3001;
const DIST_DIR = './dist';

// Respond to API endpoints
app.get('/api/v1/endpoint', (req: any, res: any) => {
    res.json({ success: true });
});

app.get('/api/v1/testObjects', async (req: any, res: any) => {
    res.json(await testQueryAll());
});

app.get('/api/v1/gameLogs', async (req: any, res: any) => {
    res.json(await testQueryAll2());
});

// app.get('/api/v1/dataUpload', async (req: any, res: any) => {
//     res.json(await testQueryAll3());
// });

// Example POST method implementation:
async function postData(url = '', data = {}) {
    // Default options are marked with *
    const response = await fetch(url, {
      method: 'POST', // *GET, POST, PUT, DELETE, etc.
      mode: 'cors', // no-cors, *cors, same-origin
      cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
      credentials: 'same-origin', // include, *same-origin, omit
      headers: {
        'Content-Type': 'application/json'
        // 'Content-Type': 'application/x-www-form-urlencoded',
      },
      redirect: 'follow', // manual, *follow, error
      referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
      body: JSON.stringify(data) // body data type must match "Content-Type" header
    });
    return response.json(); // parses JSON response into native JavaScript objects
  }

postData('/api/v1/gameLogs', { req: any, res: any })
  .then(data => {
    console.log(data); // JSON data parsed by `data.json()` call
});

app.post('/api/v1/gameLogs', async (req: any, res: any) => {
    
});

// Serve LWC content
app.use(express.static(DIST_DIR));

app.use('/', (req, res) => {
    res.sendFile(path.resolve(DIST_DIR, 'index.html'));
});

app.listen(PORT, () =>
    console.log(`✅  Server started: http://${HOST}:${PORT}`)
);