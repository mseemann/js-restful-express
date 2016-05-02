import { ExpressServiceRegistry } from './service-registry';
import * as express from 'express';
import {expect} from 'chai';
import * as request from 'supertest';
import { Path, POST, PathParam} from 'js-restful';
import * as util from './test-util.spec';

let anyBook = {a:'b'};

@Path('/books')
class TestService {

    @POST()
    doPost(){
    }

    @POST()
    @Path('/archived')
    postWithAdditionalPath(){
        return [anyBook];
    }

    @POST()
    @Path('/:name')
    postName(@PathParam('name') name: string){
        return {id:1, name:name};
    }

}

describe('service-registry: HTTP POST methods', () => {

    var app;
    var testService;

    beforeEach( ()=>{
        app = express();
        testService = new TestService();

        ExpressServiceRegistry.registerService(app, testService);
    });

    it('should test a POST method without a path', (done) => {

        request.agent(app).post('/books').end((err:any, res: request.Response) => {

            expect(res.status).to.equal(200);
            expect(res.text).to.eql('');

            done();
        });

    });

    it('should test a POST method with a path', (done) => {

        request.agent(app).post('/books/archived').end((err:any, res: request.Response) => {

            util.checkDefaultsJson(err, res, done);

            expect(res.body).to.eql([anyBook]);

            done();
        });
    })

    it('should test a POST method with a param', (done) => {

        request.agent(app).post('/books/simsons').end((err:any, res: request.Response) => {

            util.checkDefaultsJson(err, res, done);

            expect(res.body).to.eql({id:1,name:'simsons'});

            done();
        })

    })

});