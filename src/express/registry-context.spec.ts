import { JsRestfulRegistry } from './registry';
import * as express from 'express';
import {expect} from 'chai';
import * as request from 'supertest';
import { Path, GET, PUT, Context, ContextTypes} from 'js-restful';
import { ExpressContext } from './decorators';
import { ExpressContextType } from './descriptions';
import * as util from './test-util.spec';

let anyBook = {name:'simsons'};

@Path('/books')
class TestService {

    @PUT()
    doPut(@Context(ContextTypes.HttpRequest) req:express.Request, @Context(ContextTypes.HttpResponse) res:express.Response){
        return req.method + (res ? '-response-present' : '');
    }

    @PUT()
    @Path('/error')
    error(@Context(1000) req:express.Request){
        // simulates an unsuported context type
    }

    @GET()
    @Path('/doNotRenderTheResult')
    doNotRenderTheResult(@Context(ContextTypes.HttpResponse) res:express.Response){
        res.send('manually send');
        return null;
    }

    @GET()
    @Path('/expresscontext')
    expressContext(@ExpressContext(ExpressContextType.HttpNextFunction) next:Function){
        return typeof next;
    }

    @PUT()
    @Path('/errorExpress')
    errorExpress(@ExpressContext(1000) req:express.Request){
        // simulates an unsuported expres  context type
    }
}

describe('service-registry: HTTP methods with Context decorator', () => {

    var app;
    var testService;

    beforeEach( ()=>{
        app = express();
        testService = new TestService();

        new JsRestfulRegistry(app).registerService(testService);
    });

    it('should test a PUT method with a content decorator', (done) => {

        request.agent(app).put('/books').end((err:any, res: request.Response) => {

            expect(res.status).to.equal(200);

            expect(res.text).to.eql('PUT-response-present');

            done();
        });

    });

    it('should throw an error if an unsupported context type is used', (done) => {

        request.agent(app).put('/books/error').end((err:any, res: request.Response) => {

            expect(res.status).to.equal(500);
            expect(JSON.stringify(res.error)).to.contains('unsupported contexttype');

            done();
        });
    })


    it('should not render the resut by js-restful-express - this should be done by the service method', (done) => {
        request.agent(app).get('/books/doNotRenderTheResult').end((err:any, res: request.Response) => {

            expect(res.status).to.equal(200);
            expect(res.text).to.contains('manually send');

            done();
        });
    })

    it('should test a method with express context type next function', (done) => {
        request.agent(app).get('/books/expresscontext').end((err:any, res: request.Response) => {

            expect(res.status).to.equal(200);
            expect(res.text).to.contains('function');

            done();
        });
    })

    it('should throw an error if an unsupported express context type is used', (done) => {

        request.agent(app).put('/books/errorExpress').end((err:any, res: request.Response) => {

            expect(res.status).to.equal(500);
            expect(JSON.stringify(res.error)).to.contains('unsupported contexttype');

            done();
        });
    })
});