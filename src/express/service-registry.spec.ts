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

    it('should always return a basepath with a leading slash', () => {
        expect(ExpressServiceRegistry.getBasePath(null)).to.be.eql('/');
        expect(ExpressServiceRegistry.getBasePath('/')).to.be.eql('/');
        expect(ExpressServiceRegistry.getBasePath('books')).to.be.eql('/books');
        expect(ExpressServiceRegistry.getBasePath('/books')).to.be.eql('/books');
    })

});