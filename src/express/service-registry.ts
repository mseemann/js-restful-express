import * as express from "express";
import { ServiceDescription, ServiceParser, HttpMethod } from 'js-restful';

export class ExpressServiceRegistry {

    static getBasePath(path: string| void): string{
        let result =  <string>(path ? path : "/");
        return result;
    }

    static setToPlainText(res){
        res.header("Content-Type", "text/plain");
    }

    static convertRawParamToMethoParam(service, method, pathParam, rawParam){
        // try to figure out what the method signature expects
        let paramTypes = Reflect.getMetadata('design:paramtypes', service, method.methodName);
        if(paramTypes && paramTypes.length >= pathParam.index){
            // this is a constructor function of the expected type
            let paramType = paramTypes[pathParam.index];
            let expectedValue = paramType(rawParam);
            return expectedValue;
        } else {
            // ther is no way to figure out what the expected type is - pass it as string
            return rawParam;
        }
    }

    static registerService(app: express.Application, service:any){
        
        

        if(typeof service === 'function'){
            throw new TypeError('A type is not allowed - only an object can be registered');
        }

        // create a registry at app level
        app.locals.registeredServices = app.locals.registeredServices || [];

        // check if the service is not already registered at this app
        if (app.locals.registeredServices.indexOf(service.constructor.name) !== -1 ){
            throw new Error(`A service can only be registered once per app. ${service.constructor.name} is already resgitered.`);
        }
        // store the service at the app
        app.locals.registeredServices.push(service.constructor.name);


        let descriptions = ServiceParser.parse(service);
        let router = express.Router();

        descriptions.methods.forEach( (method) => {
            // create a http method name from the enum. the enum are capitalized http method
            // - so, convert to string and convert to lowercase is enough.
            var httpMethodName = HttpMethod[method.httpMethod].toLowerCase();

            let path = method.path ? method.path : '/';

            // TODO use a logging framwork console.log(`register method ${method.methodName} for path ${path}`);

            router[httpMethodName](path, (req: express.Request, res: express.Response, next: express.NextFunction) => {
                var args = [];

                args.length = method.pathParams.length + method.headerParams.length + method.queryParams.length;

                method.pathParams.forEach( (pathParam) => {
                    // this is always a string
                    let rawParam = req.params[pathParam.paramName];
                    args[pathParam.index] = this.convertRawParamToMethoParam(service, method, pathParam, rawParam);
                })

                method.headerParams.forEach( (headerParam) => {
                    let rawParam = req.header(headerParam.paramName);
                    args[headerParam.index] = this.convertRawParamToMethoParam(service, method, headerParam, rawParam);
                })

                method.queryParams.forEach( (queryParam) => {
                    let rawParam = req.query[queryParam.paramName];
                    args[queryParam.index] = this.convertRawParamToMethoParam(service, method, queryParam, rawParam);
                })

                let methodToCall =service[method.methodName];

                let result = methodToCall.apply(service, args);

                if ( typeof result === 'undefined' || result === null) {
                    this.setToPlainText(res);
                    res.send('');
                } else  if (typeof result === 'boolean' || typeof result === 'number' || typeof result === 'string') {
                    this.setToPlainText(res);
                    res.send('' + result);
                } else {
                    res.json(result);
                }

            });

        })

        app.use(this.getBasePath(descriptions.basePath), router);
    }
}