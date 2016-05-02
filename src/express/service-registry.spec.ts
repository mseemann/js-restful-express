import { ExpressServiceRegistry } from './service-registry';
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
            ExpressServiceRegistry.registerService(app, new TestServiceC());
        }

        expect(fn).to.not.throw(Error);
    })

    it('should only be possible to register an object of a specific type once', ()=>{

        ExpressServiceRegistry.registerService(app, new TestServiceC());

        var fn = () => {
            ExpressServiceRegistry.registerService(app, new TestServiceC());
        }

        expect(fn).to.throw(Error);
    })

    it('should only not be possible to register a type', ()=>{

        var fn = () => {
            ExpressServiceRegistry.registerService(app, TestServiceC);
        }

        expect(fn).to.throw(TypeError);

    });

});