import * as express from "express";
import { ServiceDescription, ServiceParser } from 'js-restful';

export class ExpressServiceRegistry {

    static registerService(app: express.Application, servcie:Object){
        let descriptions = ServiceParser.parse(servcie);
       
    }
}