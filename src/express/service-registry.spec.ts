import { BookService } from './test-classes.spec';
import { ExpressServiceRegistry } from './service-registry';
import * as express from 'express';
import {expect} from 'chai';

describe('service-registry', () => {

    var bookService = new BookService();

    it('should test the toolchain', () => {
        let app = express();
        ExpressServiceRegistry.registerService(app, bookService);
        
        expect(true).to.equal(true);
    });
});