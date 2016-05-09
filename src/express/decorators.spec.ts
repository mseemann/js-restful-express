import { expect } from 'chai';
import * as namings from './namings';
import { RenderWith, ExpressContext } from "./decorators";
import { ExpressContextType } from './descriptions';
import { GET, ParamDescription } from 'js-restful';

class TestService {

    @RenderWith('view')
    render(){
    }

    @GET()
    nextFunction(@ExpressContext(ExpressContextType.HttpNextFunction) next:Function){

    }
}

describe('decorators', () => {

    let testService = new TestService();

    describe('RenderWith', () => {

        it('should have a decorator RenderWith at method render', () => {
            expect(Reflect.getMetadata(namings.renderWith, testService.render)).to.eql('view');
        })
    })

    describe('ExpressContext', () => {

        it('should have a method with a next Function', () => {
            let contextParams: ParamDescription[] = Reflect.getMetadata(namings.expressContextParam, testService, 'nextFunction');

            expect(contextParams.length).to.equal(1);

            expect(contextParams).to.contains({paramName:'HttpNextFunction', index: 0});
        })
    })

})