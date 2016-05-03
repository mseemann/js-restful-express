import { JsRestfulRegistry } from './registry';
import * as express from 'express';
import {expect} from 'chai';
import * as request from 'supertest';
import { Path, DELETE, PathParam} from 'js-restful';
import * as util from './test-util.spec';

let anyBook = {name:'simsons'};

@Path('/books')
class TestService {

    @DELETE()
    doPut(){
    }


    @DELETE()
    @Path('/:id')
    postName(@PathParam('id') id:number){
        return true;
    }

}

describe('service-registry: HTTP DELETE methods', () => {

    var app;
    var testService;

    beforeEach( ()=>{
        app = express();
        testService = new TestService();
        new JsRestfulRegistry(app).registerService(testService);
    });

    it('should test a DELETE method without a path', (done) => {

        request.agent(app).delete('/books').end((err:any, res: request.Response) => {

            expect(res.status).to.equal(200);
            expect(res.text).to.eql('');

            done();
        });

    });

    it('should test a DELETE method with a param', (done) => {

        request.agent(app).delete('/books/1').end((err:any, res: request.Response) => {

            util.checkDefaultsText(err, res, done);

            expect(res.text).to.eql('true');

            done();
        })

    })

});