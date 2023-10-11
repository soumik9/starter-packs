import express, { Application, Request, Response } from 'express'
import cors from 'cors'
import morgan from 'morgan'
import routes from './app/routers/routes';
import httpStatus from 'http-status';
import bootstrap from './utils/server/bootstrap';
import { Server } from 'http';
import globalErrorHandler from './utils/helpers/globalErrorHandler';

const app: Application = express();

//middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));

// all routes
app.use('/api/v1', routes);

// files route
app.use('/public', express.static('public'))

//global error handler
app.use(globalErrorHandler);

//handle not found
app.use((req: Request, res: Response) => {
    res.status(httpStatus.NOT_FOUND).json({
        success: false,
        message: 'Not Found',
        errorMessages: [
            {
                path: req.originalUrl,
                message: 'API Not Found',
            },
        ],
    });
});


// server related works
process.on('uncaughtException', error => {
    console.log(error, 'uncaughtException');
    process.exit(1);
});

let server: Server;
bootstrap(app);

process.on('SIGTERM', () => {
    console.log('SIGTERM is received');
    if (server) {
        server.close();
    }
});
