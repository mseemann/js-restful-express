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

    static registerService(app: express.Application, service:Object){
        let descriptions = ServiceParser.parse(service);

        let router = express.Router();

        descriptions.methods.forEach( (method) => {
            // create a http method name from the enum. the enum are capitalized http method
            // - so, convert to string and convert to lowercase is enough.
            var httpMethodName = HttpMethod[method.httpMethod].toLowerCase();

            let path = method.path ? method.path : '/';

            router[httpMethodName](path, (req: express.Request, res: express.Response, next: express.NextFunction) => {
                var args = [];
                args.length = method.pathParams.length;
                method.pathParams.forEach( (pathParam) => {
                    // this is always a string
                    let param = req.params[pathParam.paramName];
                    // try to figure out what the method signature expects
                    let paramTypes = Reflect.getMetadata('design:paramtypes', service, method.methodName);
                    if(paramTypes && paramTypes.length >= pathParam.index){
                        // this is a constructor function of the expected type
                        let paramType = paramTypes[pathParam.index];
                        let expectedValue = paramType(param);
                        args[pathParam.index] = expectedValue;
                    } else {
                        // ther is no way to figure out what the expected type is - pass it as string
                        args[pathParam.index] = param;
                    }
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