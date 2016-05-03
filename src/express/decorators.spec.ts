import {expect} from 'chai';
import * as namings from './namings';
import {RenderWith} from "./decorators";

class TestService {

    @RenderWith('view')
    render(){
    }
}

describe('decorators', () => {

    let testService = new TestService();

    describe('RenderWith', () => {

        it('should have a decorator RenderWith at method render', () => {
            expect(Reflect.getMetadata(namings.renderWith, testService.render)).to.eql('view');
        })
    })

})