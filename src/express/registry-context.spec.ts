import { JsRestfulRegistry } from './registry';
import * as express from 'express';
import {expect} from 'chai';
import * as request from 'supertest';
import { Path, PUT, Context, ContextTypes} from 'js-restful';
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


});