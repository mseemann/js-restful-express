import { JsRestfulRegistry } from './registry';
import * as express from 'express';
import {expect} from 'chai';
import { PermitAll } from 'js-restful';
import { Factory } from './test-util.spec';

class TestServiceC {

}

@PermitAll()
class TestServcieRequireSecurityContext {

}


describe('service-registry', () => {

    var app;

    beforeEach(()=>{
        app = express();
    });

    it('should be possible to register an object', () => {

        var fn = () => {
            new JsRestfulRegistry(app).registerService(new TestServiceC());
        }

        expect(fn).to.not.throw(Error);
    })

    it('should only be possible to register an object of a specific type once', ()=>{

        let registry = new JsRestfulRegistry(app);
        registry.registerService(new TestServiceC());

        var fn = () => {
            registry.registerService(new TestServiceC());
        }

        expect(fn).to.throw(Error);
    })

    it('should only not be possible to register a type', ()=>{

        var fn = () => {
            new JsRestfulRegistry(app).registerService(TestServiceC);
        }

        expect(fn).to.throw(TypeError);

    });

    it('should not be possible to register a service that needs a security context when there is no security context available', ()=>{

        var fn = () => {
            new JsRestfulRegistry(app).registerService(new TestServcieRequireSecurityContext());
        }

        expect(fn).to.throw(Error);
    })
    
    it('should be possible to register a service with sec context if a factory is registered', ()=>{

        var fn = () => {
            let registry = new JsRestfulRegistry(app);
            registry.registerSecurityContextFactory(new Factory());
            registry.registerService(new TestServcieRequireSecurityContext());
        }

        expect(fn).to.not.throw(Error);
    })
});