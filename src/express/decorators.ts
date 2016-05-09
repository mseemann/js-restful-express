import * as namings from './namings';
import 'reflect-metadata';
import { ExpressContextType } from './descriptions';
import { DecoratorUtil } from 'js-restful';

/**
 * Specify a view name for a method. The result will of the method will be used to
 * render the view. Everything that can be handled and is configured by express can
 * be used to render the view. For example a jade template.
 *
 * @param viewName The viewName for the method.
 * @returns the decorated function
 */
export function RenderWith (viewName:string) : Function {

    return function(target: Function, propertyKey: string, descriptor: PropertyDescriptor){
        return Reflect.defineMetadata(namings.renderWith, viewName, descriptor.value);
    }
}

export function ExpressContext(contextType:ExpressContextType){ return DecoratorUtil.createParamDecorator(ExpressContextType[contextType], namings.expressContextParam);}
