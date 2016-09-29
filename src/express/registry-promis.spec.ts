import { JsRestfulRegistry } from './registry';
import * as express from 'express';
import {expect} from 'chai';
import * as request from 'supertest';
import { Path, GET } from 'js-restful';
import * as util from './test-util.spec';

let anyBook = {a:'b'};

@Path('/books')
class TestService {

    @GET()
    get(){
        const p: Promise<any> = new Promise ((resolve, reject) => {
          resolve([anyBook]);
        });
        return p;
    }
}

@Path('/books')
class TestServiceB {

    @GET()
    get(){
        const p: Promise<any> = new Promise ((resolve, reject) => {
            reject(new Error('test error'));
        });
        return p;
    }
}


describe('service-registry: implementations with promises', () => {

    var app;
    var testService;

    

    beforeEach( ()=>{
        app = express();
    });

    it('should test a GET method with a service that return a promise', (done) => {

        new JsRestfulRegistry(app).registerService(new TestService());

        request.agent(app).get('/books').end((err:any, res: request.Response) => {

            util.checkDefaultsJson(err, res, done);

            expect(res.body).to.eql([anyBook]);

            done();
        });

    });

    it ('should send an error if the promise is rejected', (done) => {

        new JsRestfulRegistry(app).registerService(new TestServiceB());

        request.agent(app).get('/books').end((err:any, res: request.Response) => {

            expect(res.status).to.equal(500);
            expect(JSON.stringify(res.error)).to.contains('test error');

            done();
        });
    })

});