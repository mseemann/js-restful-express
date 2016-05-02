import { ExpressServiceRegistry } from './service-registry';
import * as express from 'express';
import {expect} from 'chai';
import * as request from 'supertest';
import { Path, PUT, PathParam} from 'js-restful';
import * as util from './test-util.spec';

let anyBook = {name:'simsons'};

@Path('/books')
class TestService {

    @PUT()
    doPut(){
    }

    @PUT()
    @Path('/archived')
    putWithAdditionalPath(){
        return [anyBook];
    }

    @PUT()
    @Path('/:id/:name')
    postName(@PathParam('id') id:number, @PathParam('name') name: string){
        return {id:id, name:name};
    }

}

describe('service-registry: HTTP PUT methods', () => {

    var app;
    var testService;

    beforeEach( ()=>{
        app = express();
        testService = new TestService();

        ExpressServiceRegistry.registerService(app, testService);
    });

    it('should test a PUT method without a path', (done) => {

        request.agent(app).put('/books').end((err:any, res: request.Response) => {

            expect(res.status).to.equal(200);
            expect(res.text).to.eql('');

            done();
        });

    });

    it('should test a PUT method with a path', (done) => {

        request.agent(app).put('/books/archived').end((err:any, res: request.Response) => {

            util.checkDefaultsJson(err, res, done);

            expect(res.body).to.eql([anyBook]);

            done();
        });
    })

    it('should test a PUT method with two params', (done) => {

        request.agent(app).put('/books/1/simsons').end((err:any, res: request.Response) => {

            util.checkDefaultsJson(err, res, done);

            expect(res.body).to.eql({id:1,name:'simsons'});

            done();
        })

    })

});