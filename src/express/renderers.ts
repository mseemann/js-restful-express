import * as express from 'express';
import * as namings from './namings';
import { MethodDescription, ParamDescription, ContextTypes } from 'js-restful';

export interface IRenderer {

    render(res: express.Response, value:any);
}

export class RenderWithRenderer implements  IRenderer {

    constructor(private viewName: string){}

    render(res: express.Response, value:any){
        res.render(this.viewName, value);
    }
}

export class DefaultRenderer implements IRenderer {

    constructor(private method:MethodDescription){};

    render(res: express.Response, value:any){
        if ( typeof value === 'undefined' || value === null) {
            if(this.isResponseParameterPresent()){
                // do not send any reponse values if a HttpReponse Context param is provided to the service method.
                return;
            }
            this.setToPlainText(res);
            res.send('');
        } else  if (typeof value === 'boolean' || typeof value === 'number' || typeof value === 'string') {
            this.setToPlainText(res);
            res.send('' + value);
        } else {
            res.json(value);
        }
    }

    private isResponseParameterPresent(){
        var result = false;

        this.method.contextParams.forEach( (contextParam) => {
            if (ContextTypes[contextParam.paramName] == ContextTypes.HttpResponse){
                result =true;
            }
        });

        return result;
    }

    private setToPlainText(res){
        res.header("Content-Type", "text/plain");
    }
}

export class RendererFactory {

    static getRenderer(service:any, method: MethodDescription) : IRenderer {

        if (Reflect.hasMetadata(namings.renderWith, service[method.methodName])) {
            // return a Renderer that support RenderWith
            let viewName = Reflect.getMetadata(namings.renderWith, service[method.methodName]);
            return new RenderWithRenderer(viewName);
        }

        // Return the default renderer.
        return new DefaultRenderer(method);
    }
}