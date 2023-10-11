import { Application } from "express";
import mongoose from "mongoose";
import { Server } from 'http';
import colors from 'colors';

let server: Server;

const bootstrap = async (app: Application) => {
    try {
        await mongoose.connect(process.env.MONGO_CONNECTION as string);
        console.log(colors.red(`Database is connected successfully`));

        server = app.listen(process.env.PORT, () => {
            console.log(colors.magenta(`Listening on port ${process.env.PORT}`));
        });
    } catch (err) {
        console.log('Failed to connect database', err);
    }

    process.on('unhandledRejection', error => {
        if (server) {
            server.close(() => {
                console.log(error);
                process.exit(1);
            });
        } else {
            process.exit(1);
        }
    });
}

export default bootstrap;
