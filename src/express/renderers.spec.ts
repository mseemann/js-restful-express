import * as express from 'express';
import {expect} from 'chai';
import * as request from 'supertest';
import {RenderWith} from "./decorators";
import {RendererFactory, DefaultRenderer, RenderWithRenderer} from './renderers';
import {JsRestfulRegistry} from "./registry";
import { Path, GET, ServiceParser } from 'js-restful';
import * as util from './test-util.spec';

class TestService {

    @Path('/')
    @GET()
    @RenderWith('index')
    render(){
        return {a:'b'};
    }

    @GET()
    get(){
        return {a:'b'};
    }
}

describe('renderer', () => {

    var service = new TestService();
    var descriptions = ServiceParser.parse(service);


    it('shoud return the default renderer for the get methods', ()=>{
        var renderer = RendererFactory.getRenderer(service, descriptions.getMethodDescriptorForMethodName('get'));
        expect(renderer instanceof DefaultRenderer).to.be.true;
    })

    it('shoud return the renderwith renderer for the render methods', ()=>{
        var renderer = RendererFactory.getRenderer(service, descriptions.getMethodDescriptorForMethodName('render'));
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