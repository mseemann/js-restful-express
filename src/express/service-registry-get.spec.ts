import { ExpressServiceRegistry } from './service-registry';
import * as express from 'express';
import {expect} from 'chai';
import * as request from 'supertest';
import { Path, GET, PathParam, HeaderParam, QueryParam } from 'js-restful';
import * as util from './test-util.spec';

let anyBook = {a:'b'};

@Path('/books')
class TestService {

    @GET()
    get(){
        return [];
    }

    @GET()
    @Path('/archived')
    getWithAdditionalPath(){
        return [anyBook];
    }

    @GET()
    @Path('/return-a-boolean')
    getBoolean(){
        return true;
    }

    @GET()
    @Path('/return-nothing')
    getNothing(){
    }

    @GET()
    @Path('/return-number')
    getNumber(){
        return 42;
    }

    @GET()
    @Path('/return-string')
    getString(){
        return '42';
    }

    @GET()
    @Path('/:id')
    getWithParam(@PathParam('id') id:number){
        return {id:id};
    }

    @GET()
    @Path('/test/:id')
    getWith3Param(@PathParam('id') id:number, @QueryParam('plain') plain:boolean, @HeaderParam('token') token: string){
        return {id:id, plain:plain, token:token};
    }
}

class TestServiceB{

    @GET()
    get(){
        return [];
    }

}

describe('service-registry: HTTP GET methods', () => {

    var app;
    var testService;
    var testServiceB;
    

    beforeEach( ()=>{
        app = express();
        testService = new TestService();
        testServiceB = new TestServiceB();

        ExpressServiceRegistry.registerService(app, testService);
        ExpressServiceRegistry.registerService(app, testServiceB);
    });

    it('should test a GET method without a path', (done) => {

        request.agent(app).get('/books').end((err:any, res: request.Response) => {

            util.checkDefaultsJson(err, res, done);

            expect(res.body).to.eql([]);

            done();
        });

    });

    it('should test a GET method with a path', (done) => {

        request.agent(app).get('/books/archived').end((err:any, res: request.Response) => {

            util.checkDefaultsJson(err, res, done);

            expect(res.body).to.eql([anyBook]);

            done();
        });
    })

    it('should test a GET method that returns a boolean', (done) => {

        request.agent(app).get('/books/return-a-boolean').end((err:any, res: request.Response) => {

            util.checkDefaultsText(err, res, done);

            expect(res.text).to.eql('true');

            done();
        });

    })

    it('should test a GET method that returns  nothing', (done) => {

        request.agent(app).get('/books/return-nothing').end((err:any, res: request.Response) => {

            util.checkDefaultsText(err, res, done);

            expect(res.text).to.eql('');

            done();
        });

    })

    it('should test a GET method that returns a number', (done) => {

        request.agent(app).get('/books/return-number').end((err:any, res: request.Response) => {

            util.checkDefaultsText(err, res, done);

            expect(res.text).to.eql('42');

            done();
        });

    })

    it('should test a GET method that returns a string', (done) => {

        request.agent(app).get('/books/return-string').end((err:any, res: request.Response) => {

            util.checkDefaultsText(err, res, done);

            expect(res.text).to.eql('42');

            done();
        });

    })

    it('should deal with services with no provided path as the default path', (done) => {
        request.agent(app).get('/').end((err:any, res: request.Response) => {

            util.checkDefaultsJson(err, res, done);

            expect(res.body).to.eql([]);

            done();
        });
    })

    it('should test a GET method with a path and three params', (done) => {

        request.agent(app)
            .get('/books/test/1?plain=true')
            .set('token', 'token-value')
            .end((err:any, res: request.Response) => {

                util.checkDefaultsJson(err, res, done);
                // now it should not be a number - it should be a string
                expect(res.body).to.eql({id:1, plain:true, token:"token-value"});

                done();
            });
    })

    it('should call a GET method with paramater type string if there is no type information available', (done) => {
        // remove the type annotations from the method in question
        let r = Reflect.defineMetadata('design:paramtypes', null, testService, 'getWithParam');

        request.agent(app)
            .get('/books/1')
            .end((err:any, res: request.Response) => {

            util.checkDefaultsJson(err, res, done);
            // now it should not be a number - it should be a string
            expect(res.body).to.eql({id:"1"});

            done();
        });

    })

});