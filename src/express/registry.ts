import { ServiceDescription, ServiceParser, HttpMethod, ContextTypes, MethodDescription, ParamDescription } from 'js-restful';
import * as express from 'express';
import * as pathUtil from './path-util';
import { RendererFactory } from './renderers';
import * as  winston from 'winston';
import * as namings from './namings';
import { ExpressContextType } from './descriptions';

export class JsRestfulRegistry {

    private registeredServices:any[] = [];

    constructor(private app:express.Application){}

    registerService(service:any){
        if(typeof service === 'function'){
            throw new TypeError('A type is not allowed - only an object can be registered');
        }

        // check if the service is not already registered at this app
        if (this.registeredServices.indexOf(service.constructor.name) !== -1 ){
            throw new Error(`A service can only be registered once per app. ${service.constructor.name} is already resgitered.`);
        }
        winston.log('info', `${service.constructor.name} will be registered`);
        // store the service at the app
        this.registeredServices.push(service.constructor.name);


        let descriptions = ServiceParser.parse(service);

        let router = express.Router();

        descriptions.methods.forEach( (method) => {
            // create a http method name from the enum. the enum are capitalized http method
            // - so, convert to string and convert to lowercase is enough.
            var httpMethodName = HttpMethod[method.httpMethod].toLowerCase();

            let path = method.path ? method.path : '/';

            winston.log('info', `register method ${method.methodName} for path ${path}`);

            router[httpMethodName](path, (req: express.Request, res: express.Response, next: express.NextFunction) => {
                try{

                    var args = this.collectAndConvertArgs(req, res, next, service, method);

                    let methodToCall =service[method.methodName];

                    let resultRenderer = RendererFactory.getRenderer(service, method);

                    let result = methodToCall.apply(service, args);

                    if (result && 'function' === typeof result.then) {
                        result.then( (pResult) => {
                            resultRenderer.render(res, pResult);
                        });
                        result.catch( (err) => {
                            this.sendError(res, err);
                        });
                    } else {
                        resultRenderer.render(res, result);
                    }

                } catch (err) {
                    this.sendError(res, err);
                }
            });

        })

        let basePath = pathUtil.getPathFromString(descriptions.basePath);
        this.app.use(basePath, router);
        winston.log('info', `${service.constructor.name} published at ${basePath}`);
    }

    collectAndConvertArgs(req:express.Request, res: express.Response, next:express.NextFunction, service:Object, method:MethodDescription): any[]{
        var args = [];

        args.length = method.pathParams.length + method.headerParams.length + method.queryParams.length + method.contextParams.length;

        method.pathParams.forEach( (pathParam) => {
            // this is always a string
            let rawParam = req.params[pathParam.paramName];
            args[pathParam.index] = this.convertRawParamToMethodParam(service, method, pathParam, rawParam);
        })

        method.headerParams.forEach( (headerParam) => {
            let rawParam = req.header(headerParam.paramName);
            args[headerParam.index] = this.convertRawParamToMethodParam(service, method, headerParam, rawParam);
        })

        method.queryParams.forEach( (queryParam) => {
            let rawParam = req.query[queryParam.paramName];
            args[queryParam.index] = this.convertRawParamToMethodParam(service, method, queryParam, rawParam);
        })

        method.contextParams.forEach( (contextParam) => {
            let contextType:ContextTypes = ContextTypes[contextParam.paramName];
            switch (contextType){
                case ContextTypes.HttpRequest: {
                    args[contextParam.index] = req;
                    break;
                }
                case ContextTypes.HttpResponse: {
                    args[contextParam.index] = res;
                    break;
                }
                default: {
                    throw new Error(`unsupported contexttype ${contextParam.paramName}`);
                }
            }
        });

        let expressContextParams: ParamDescription[] = Reflect.getMetadata(namings.expressContextParam, service,  method.methodName) || [];
        expressContextParams.forEach( (expressContextParam) => {
            let expressContextType:ExpressContextType = ExpressContextType[expressContextParam.paramName];
            switch (expressContextType){
                case ExpressContextType.HttpNextFunction: {
                    args[expressContextParam.index] = next;
                    break;
                }
                default: {
                    throw new Error(`unsupported contexttype ${expressContextParam.paramName}`);
                }
            }
        })

        return args;
    }

    convertRawParamToMethodParam(service, method, pathParam, rawParam){
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
    

    sendError(res, err){
        res.status(500).send(err.message);
    }
}