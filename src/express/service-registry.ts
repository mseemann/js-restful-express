import * as express from "express";
import { JsRestfulRegistry, JsRestfulRegistryConfig } from './registry';
import { ISecurityContext } from 'js-restful';
import { ISecurityContextFactory } from './descriptions';

export class ExpressServiceRegistry {

    private static initJsResutfulRegistry(app: express.Application, config?: JsRestfulRegistryConfig){
        app.locals.jsResutfulRegistry = app.locals.jsResutfulRegistry || new JsRestfulRegistry(app, config);
    }

    static registerSecurityContextFactory(app: express.Application, factory:ISecurityContextFactory){

        this.initJsResutfulRegistry(app);

        app.locals.jsResutfulRegistry.registerSecurityContextFactory(factory);
    }

    static registerService(app: express.Application, service:any){

        this.initJsResutfulRegistry(app);

        app.locals.jsResutfulRegistry.registerService(service);
    }
}