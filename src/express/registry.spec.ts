import { JsRestfulRegistry } from './registry';
import * as express from 'express';
import {expect} from 'chai';

class TestServiceC {

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
    
});