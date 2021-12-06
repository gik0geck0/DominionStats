// Simple Express server setup to serve the build output
import compression from 'compression';
import helmet from 'helmet';
import express from 'express';
import path from 'path';

//to import queries from DB service
import { testQueryAll, getGameResultsFromDb, testQueryDataUpload} from './db_setup';

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

if (!process.env.NODB) {
    app.get('/api/v1/testObjects', async (req: any, res: any) => {
        res.json(await testQueryAll());
    });

    app.post('/api/v1/gameResultsTest', (req: any, res: any) => {
        res.json(testQueryDataUpload(req.body, res));
    });

    app.get('/api/v1/gameResults', async (req: any, res: any) => {
        res.json(await getGameResultsFromDb());
    });
}

// Serve LWC content
app.use(express.static(DIST_DIR));

app.use('/', (req, res) => {
    res.sendFile(path.resolve(DIST_DIR, 'index.html'));
});

app.listen(PORT, () =>
    console.log(`✅  Server started: http://${HOST}:${PORT}`)
);
