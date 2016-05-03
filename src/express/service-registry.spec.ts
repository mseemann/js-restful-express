import { ExpressServiceRegistry } from './service-registry';
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
            ExpressServiceRegistry.registerService(app, new TestServiceC());
        }

        expect(fn).to.not.throw(Error);
    })
    

});