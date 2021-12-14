// Simple Express server setup to serve the build output
import compression from 'compression';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import express, { NextFunction } from 'express';
import expressSession from 'express-session';
import path from 'path';
import passport from 'passport';
import passportGoogle from 'passport-google-oauth20';
import type { DominionUser } from './common';

//to import queries from DB service
import { testQueryAll, getGameResultsFromDb, insertGameResults } from './db_setup';

declare global {
    namespace Express {
        interface User extends DominionUser {}
    }
}

const app = express();
app.use(compression());

const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const HOST = process.env.HOST || 'localhost';
let PUBLIC_PORT = HOST === 'localhost' ? 30001 : process.env.PORT;
let SCHEME = 'http://';
if (HOST !== 'localhost') {
    SCHEME = 'https://';
    PUBLIC_PORT = '443';
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

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
if (!GOOGLE_CLIENT_ID || !GOOGLE_CLIENT_SECRET) {
    throw new Error("Missing environment variables: GOOGLE_CLIENT_ID or GOOGLE_CLIENT_SECRET");
}
const SESSION_SECRET = process.env.SESSION_SECRET;
if (!SESSION_SECRET) {
    throw new Error("Missing environment variable: SESSION_SECRET");
}
const PORT = process.env.PORT || 3001;
const DIST_DIR = './dist';
const ALLOWLIST_EMAILS: string[] = (process.env.ALLOWLIST || '').split(',');

passport.serializeUser(function(user, done) {
    done(null, user);
});

function assertIsUser(user: unknown): user is Express.User {
    if (!user) {
        throw new Error('User cannot be null');
    }
    if (typeof user !== 'object') {
        throw new Error('User is not an object');
    }
    const obj: any = user;
    if (typeof obj.name !== 'string' || obj.name === '') {
        throw new Error('User must have a name');
    }
    if (typeof obj.email !== 'string' || obj.email === '') {
        throw new Error('User must have an email');
    }
    return true;
}

passport.deserializeUser(function(user, done) {
    try {
        if (assertIsUser(user)) {
            return done(null, user);
        } else {
            return done('Object could not be cast to user: ' + user);
        }
    } catch (e: any) {
        return done(e.message);
    }
});

function ensureLoggedIn(options: {throw?: boolean}) {
    return (req: Express.Request, res: any, next: NextFunction) => {
        if (!req.isAuthenticated || !req.isAuthenticated()) {
            if (options.throw) {
                return res.status(403).send();
            }
            return res.redirect('/login/google');
        }
        next();
    }
}
passport.use(new passportGoogle.Strategy({
    clientID: GOOGLE_CLIENT_ID,
    clientSecret: GOOGLE_CLIENT_SECRET,
    callbackURL: `${SCHEME}${HOST}:${PUBLIC_PORT}/oauth2/redirect/accounts.google.com`,
    scope: [ 'profile', 'email' ]
}, function (accessToken: string, refreshToken: string, profile: passportGoogle.Profile, cb: passportGoogle.VerifyCallback) {
    if (!profile || !profile.emails || profile.emails.length === 0 || !profile.emails[0] || !profile.emails[0].value || !profile.emails[0].verified) {
        console.error("User has no email attached or is unverified: ", profile);
        return cb("User has no email attached or is unverified: " + profile?.emails);
    }
    const emails = profile?.emails?.filter((ev) => ev.verified);
    if (!emails) {
        return cb("User has no verified emails");
    }

    const allowedEmail = emails.find((ev) => ALLOWLIST_EMAILS.includes(ev.value));
    if (!allowedEmail) {
        return cb("User is not authorized to use these features");
    }

    const user: Express.User = {email: allowedEmail.value, name: profile.displayName };
    return cb(null, user)
}));

app.use(cookieParser());
app.use(expressSession({secret: SESSION_SECRET, resave: false, saveUninitialized: false, cookie: { maxAge: 60000 }}));
app.use(passport.initialize());
app.use(passport.session());

app.get('/login/google', passport.authenticate('google'));
app.get('/logout', (req, res) => {
    req.logout();
    res.clearCookie(COOKIE_USERNAME);
    res.redirect('/');
})

const COOKIE_USERNAME = 'dominionstats-username';
app.get('/oauth2/redirect/accounts.google.com',
    passport.authenticate('google', { failureRedirect: '/', failureMessage: true }),
    function(req, res, next) {
        if (req.user) {
            if (req.user?.name != req.cookies[COOKIE_USERNAME]) {
                // if user successfully signed in, store user.name in cookie
                if (req.user) {
                    res.cookie(COOKIE_USERNAME, req.user.name, {
                        // expire in year 9999 (from: https://stackoverflow.com/a/28289961)
                        expires: new Date(253402300000000),
                        httpOnly: false, // allows JS code to access it
                    });
                } else {
                    res.clearCookie(COOKIE_USERNAME);
                }
            }
        }
        next();
    },
    function(req, res, next) {
        res.redirect('/');
        next();
});
app.get('/guarded', ensureLoggedIn({}), (req, res) => {
    res.send('Logged in as: ' + JSON.stringify(req.user));
});

if (!process.env.NODB) {
    app.get('/api/v1/testObjects', ensureLoggedIn({throw: true}), async (req, res) => {
        res.json(await testQueryAll());
    });

    app.post('/api/v1/gameResults', ensureLoggedIn({throw: true}), async (req, res) => {
        const insertResult = await insertGameResults(req.body);
        res.status(insertResult.status).json(insertResult.results);
    });

    app.get('/api/v1/gameResults', async (req, res) => {
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
