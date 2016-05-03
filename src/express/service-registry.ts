import * as express from "express";
import { JsRestfulRegistry } from './registry.ts';

export class ExpressServiceRegistry {

    static registerService(app: express.Application, service:any){
        // one registry per app
        app.locals.jsResutfulRegistry = app.locals.jsResutfulRegistry || new JsRestfulRegistry(app);

        app.locals.jsResutfulRegistry.registerService(service);
    }
}