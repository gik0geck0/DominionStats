// Simple Express server setup to serve the build output
import compression from 'compression';
import helmet from 'helmet';
import express from 'express';
import path from 'path';

const app = express();
app.use(helmet());
app.use(compression());

const HOST = process.env.HOST || 'localhost';
const PORT = process.env.PORT || 3001;
const DIST_DIR = './dist';

// Respond to API endpoints
app.get('/api/v1/endpoint', (req: any, res: any) => {
    res.json({ success: true });
});

// Serve LWC content
app.use(express.static(DIST_DIR));

app.use('*', (req, res) => {
    res.sendFile(path.resolve(DIST_DIR, 'index.html'));
});

app.listen(PORT, () =>
    console.log(`✅  Server started: http://${HOST}:${PORT}`)
);