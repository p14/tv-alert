import 'reflect-metadata';
import { InversifyExpressServer } from 'inversify-express-utils';
import cors from 'cors';
import express from 'express';
import container from './setup/ioc.config';
import dbConnect from './setup/dbConnector';
import AuthProvider from './providers/auth.provider';
import TYPES from './setup/ioc.types';
import CronService from './services/cron.service';

const PORT = process.env.PORT || 8080;

/* Setup Express App to pass into InversifyExpressServer */
const app = express();

/* Instantiate Server */
const server = new InversifyExpressServer(container, null, null, app, AuthProvider);

server.setConfig((app) => {
    app.use(express.urlencoded({ extended: true }));
    app.use(express.json());
    app.use(cors({
        origin: [String(process.env.CLIENT_URL)],
        methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
        credentials: true,
    }));
});

const serverInstance = server.build();

dbConnect().then(() => {
    serverInstance.listen(PORT, async () => {
        console.log(`Server listening on port ${PORT}`);

        /* Instantiate Cron Jobs */
        container.get<CronService>(TYPES.Services.Cron);

        /* Status Check */
        app.get('/', (_req, res) => {
            res.status(200).send('In Mae we trust.');
        });
    });
});
