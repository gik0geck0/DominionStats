// Simple Express server setup to serve the build output
import compression from 'compression';
import helmet from 'helmet';
import express from 'express';
import path from 'path';

//to import queries from DB service
import { testQueryAll, testQueryAll2} from './db_setup';
import { testQueryAll3 } from './db_setup';
import { testQueryAll4 } from './db_setup';

const app = express();
app.use(compression());

const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

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

app.get('/api/v1/gameResults', async (req: any, res: any) => {
    res.json(await testQueryAll2());
});

app.get('/api/v1/gameResultsTest', async (req: any, res: any) => {
    res.json(await testQueryAll4());
});

app.post('/api/v1/gameResultsTest', (req, res) => {
    //to test if data is being uploaded correctly
    console.log('Got body:', req.body);
    console.log('Got method:', req.method);
    console.log('Got headers:', req.headers);
    // console.log(req.json());

    //to test getting response from post request
    // console.log('Got response:', res);
    // res.sendStatus(200);
    
    res.json(testQueryAll3(req.body, res));
});

// Serve LWC content
app.use(express.static(DIST_DIR));

app.use('/', (req, res) => {
    res.sendFile(path.resolve(DIST_DIR, 'index.html'));
});

app.listen(PORT, () =>
    console.log(`✅  Server started: http://${HOST}:${PORT}`)
);