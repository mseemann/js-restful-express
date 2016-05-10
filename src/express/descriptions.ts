import { MethodDescription, ISecurityContext } from 'js-restful';
import * as express from 'express';

export enum ExpressContextType {
    HttpNextFunction
}


export interface ISecurityContextFactory {
    createSecurityContext(req:express.Request):ISecurityContext;
}