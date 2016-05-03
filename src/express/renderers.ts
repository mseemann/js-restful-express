import * as express from 'express';
import 'reflect-metadata';
import * as namings from './namings';

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

    render(res: express.Response, value:any){
        if ( typeof value === 'undefined' || value === null) {
            this.setToPlainText(res);
            res.send('');
        } else  if (typeof value === 'boolean' || typeof value === 'number' || typeof value === 'string') {
            this.setToPlainText(res);
            res.send('' + value);
        } else {
            res.json(value);
        }
    }

    private setToPlainText(res){
        res.header("Content-Type", "text/plain");
    }
}

export class RendererFactory {

    static getRenderer(service:any, methodName: string) : IRenderer {
        if (Reflect.hasMetadata(namings.renderWith, service[methodName])) {
            let viewName = Reflect.getMetadata(namings.renderWith, service[methodName]);
            return new RenderWithRenderer(viewName);
        }
        return new DefaultRenderer();
    }
}