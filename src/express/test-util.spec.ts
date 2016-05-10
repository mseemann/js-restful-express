import {expect} from 'chai';
import { ISecurityContext, IUser } from 'js-restful';
import { ISecurityContextFactory } from './descriptions';
import * as express from 'express';

export function checkHttpStatus(err, res, done){
    if (err) return done(err);
    expect(res.status).to.equal(200);
}

export function checkDefaultsJson(err, res, done){
    checkHttpStatus(err, res, done);
    expect(res.header).to.contain({'content-type': 'application/json; charset=utf-8'});
}

export function checkDefaultsText(err, res, done){
    checkHttpStatus(err, res, done);
    expect(res.header).to.contain({'content-type': 'text/plain; charset=utf-8'});
}

export class Context implements ISecurityContext {
    user:IUser;
    isUserInRole(roleName:string):boolean{
        return true;
    }
}

export class Factory implements ISecurityContextFactory {

    createSecurityContext(req:express.Request):ISecurityContext{
        return new Context();
    }
}
