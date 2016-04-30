import { BookService } from './test-classes';
import { ExpressServiceRegistry } from './service-registry';

describe('service-registry', () => {

    var bookService = new BookService();

    it('should test the toolchain', () => {

        ExpressServiceRegistry.registerService(null, bookService);
        
        expect(true).toBe(true);
    });
});