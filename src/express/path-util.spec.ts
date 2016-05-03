import * as pathUtil from './path-util';
import {expect} from 'chai';

describe('path-util', () => {

    it('should always return a basepath with a leading slash', () => {

        expect(pathUtil.getPathFromString(null)).to.be.eql('/');
        expect(pathUtil.getPathFromString('/')).to.be.eql('/');
        expect(pathUtil.getPathFromString('books')).to.be.eql('/books');
        expect(pathUtil.getPathFromString('/books')).to.be.eql('/books');
    })

})