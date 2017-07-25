import * as express from "express";
import { JsRestfulRegistry, JsRestfulRegistryConfig } from './registry';
import { ISecurityContext } from 'js-restful';
import { ISecurityContextFactory } from './descriptions';

export class ExpressServiceRegistry {

    static initJsRestfulRegistry(app: express.Application, config?: JsRestfulRegistryConfig){
        app.locals.jsResutfulRegistry = app.locals.jsResutfulRegistry || new JsRestfulRegistry(app, config);
    }

    static registerSecurityContextFactory(app: express.Application, factory:ISecurityContextFactory){

        this.initJsRestfulRegistry(app);

        app.locals.jsResutfulRegistry.registerSecurityContextFactory(factory);
    }

    static registerService(app: express.Application, service:any){

        this.initJsRestfulRegistry(app);

        app.locals.jsResutfulRegistry.registerService(service);
    }
}