import { JsRestfulRegistry } from './registry';
import * as express from 'express';
import {expect} from 'chai';
import * as request from 'supertest';
import { Path, GET, PUT, Context, ContextTypes, SecurityContext, ISecurityContext, PermitAll, RolesAllowed} from 'js-restful';
import { ExpressContext } from './decorators';
import {ExpressContextType, ISecurityContextFactory} from './descriptions';
import * as util from './test-util.spec';

let anyBook = {name:'simsons'};

@Path('/')
class TestService {

    @GET()
    @Path('/get')
    get(){
        return true;
    }
}

@Path('/b')
@PermitAll()
class TestServiceB {

    @GET()
    @Path('/get')
    get(){
        return true;
    }
}

@Path('/c')
@RolesAllowed(['user'])
class TestServiceC {

    @GET()
    @Path('/get')
    get(){
        return true;
    }
}

@Path('/d')
@RolesAllowed(['admin'])
class TestServiceD {

    @GET()
    @Path('/get')
    get(){
        return true;
    }
}

@Path('/e')
class TestServiceE {

    @GET()
    @Path('/get')
    @PermitAll()
    get(){
        return true;
    }
}

@Path('/f')
class TestServiceF {

    @GET()
    @Path('/get')
    @RolesAllowed(['user'])
    get(){
        return true;
    }
}

@Path('/g')
class TestServiceG {

    @GET()
    @Path('/get')
    @RolesAllowed(['admin'])
    get(){
        return true;
    }
}

describe('registry-security', () => {

    var app;
    var testService;

    beforeEach( ()=>{
        app = express();

        let registry = new JsRestfulRegistry(app);
        registry.registerSecurityContextFactory(new util.Factory());
        registry.registerService(new TestService());
        registry.registerService(new TestServiceB());
        registry.registerService(new TestServiceC());
        registry.registerService(new TestServiceD());
        registry.registerService(new TestServiceE());
        registry.registerService(new TestServiceF());
        registry.registerService(new TestServiceG());
    });

    it('should allow access to undecorated service/method', (done) => {

        request.agent(app).get('/get').end((err:any, res: request.Response) => {

            expect(res.status).to.equal(200);

            expect(res.text).to.eql('true');

            done();
        });

    });

    it('should allow access to permitAll at class level service/method', (done) => {

        request.agent(app).get('/b/get').end((err:any, res: request.Response) => {

            expect(res.status).to.equal(200);

            expect(res.text).to.eql('true');

            done();
        });

    });

    it('should allow access to allowedRoles user at class level service/method', (done) => {

        request.agent(app).get('/c/get').end((err:any, res: request.Response) => {

            expect(res.status).to.equal(200);

            expect(res.text).to.eql('true');

            done();
        });

    });

    it('should allow deny access to allowedRoles user at class level service/method', (done) => {

        request.agent(app).get('/d/get').end((err:any, res: request.Response) => {

            expect(res.status).to.equal(403);

            expect(res.text).to.eql('permission denied');

            done();
        });

    });

    it('should allow access to permitAll  at method level service/method', (done) => {

        request.agent(app).get('/e/get').end((err:any, res: request.Response) => {

            expect(res.status).to.equal(200);

            expect(res.text).to.eql('true');

            done();
        });

    });

    it('should allow access to rolesAllowed  at method level service/method', (done) => {

        request.agent(app).get('/f/get').end((err:any, res: request.Response) => {

            expect(res.status).to.equal(200);

            expect(res.text).to.eql('true');

            done();
        });

    });

    it('should allow deny access to allowedRoles user at method level service/method', (done) => {

        request.agent(app).get('/g/get').end((err:any, res: request.Response) => {

            expect(res.status).to.equal(403);

            expect(res.text).to.eql('permission denied');

            done();
        });

    });
});