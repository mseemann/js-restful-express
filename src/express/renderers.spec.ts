import * as express from 'express';
import {expect} from 'chai';
import * as request from 'supertest';
import {RenderWith} from "./decorators";
import {RendererFactory, DefaultRenderer, RenderWithRenderer} from './renderers';
import {JsRestfulRegistry} from "./registry";
import { Path, GET } from 'js-restful';
import * as util from './test-util.spec';

class TestService {

    @Path('/')
    @GET()
    @RenderWith('index')
    render(){
        return {a:'b'};
    }

    get(){
        return {a:'b'};
    }
}

describe('renderer', () => {

    it('shoud return the default renderer for the get methods', ()=>{
        var renderer = RendererFactory.getRenderer(new TestService(), 'get');
        expect(renderer instanceof DefaultRenderer).to.be.true;
    })

    it('shoud return the renderwith renderer for the render methods', ()=>{
        var renderer = RendererFactory.getRenderer(new TestService(), 'render');
        expect(renderer instanceof RenderWithRenderer).to.be.true;
    })
});

describe('RenderWithRenderer', ()=>{

    let app = express();

    app.set('view engine', 'pug');
    app.set('views', __dirname +'/testviews');

    let registry =  new JsRestfulRegistry(app);
    registry.registerService(new TestService());

    it('should test a render method', (done) => {

        request.agent(app).get('/').end((err:any, res: request.Response) => {

            util.checkHttpStatus(err, res, done);

            expect(res.text).to.eql('<div>a b</div>');

            done();
        });

    });


})