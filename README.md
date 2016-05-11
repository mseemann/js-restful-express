# js-restful-express
Create a RESTful service with ES7 decorators for your express based node.js application.


[![CI Status](http://img.shields.io/travis/mseemann/js-restful-express.svg?style=flat)](https://travis-ci.org/mseemann/js-restful-express)
[![npm version](https://badge.fury.io/js/js-restful-express.svg)](http://badge.fury.io/js/js-restful-express)
[![Downloads](http://img.shields.io/npm/dm/js-restful-express.svg)](https://npmjs.org/package/js-restful-express)
[![Coverage Status](https://coveralls.io/repos/github/mseemann/js-restful-express/badge.svg?branch=master)](https://coveralls.io/github/mseemann/js-restful-express?branch=master)
[![Code Climate](https://codeclimate.com/github/mseemann/js-restful-express/badges/gpa.svg)](https://codeclimate.com/github/mseemann/js-restful-express)
[![Test Coverage](https://codeclimate.com/github/mseemann/js-restful-express/badges/coverage.svg)](https://codeclimate.com/github/mseemann/js-restful-express/coverage)
[![Issue Count](https://codeclimate.com/github/mseemann/js-restful-express/badges/issue_count.svg)](https://codeclimate.com/github/mseemann/js-restful-express)
[![Issue Stats](http://issuestats.com/github/mseemann/js-restful-express/badge/issue)](http://issuestats.com/github/mseemann/js-restful-express)

## Installation
```bash
npm install js-restful-express --save
```
This module requires reflect-metadata as a peer dependency. This is essential to make the decorators working. It must be ensured
that this module is only loaded once. Otherwise the decorated information will be lost at runtime. Keep in mind that this is
a shim and until now not a language feature!

## Prerequisites
- You use TypeScript for your app
- You use express 4.x as your http framework for your node.js application

## Usage
Decorate your service class with the decorators from the [js-restful](https://github.com/mseemann/js-restful) Github-project.
So far there are the following decorators available:

|   Decorator   |   Description |
| ------------- | ------------- |
| @Path         | The path under which the service will be published. The decorator can be used at class and method level. You need to provide a path as string.|
| @GET          | Decorator that indicates a HTTP GET method.|
| @POST         | Decorator that indicates a HTTP POST method.|
| @PUT          | Decorator that indicates a HTTP PUT method.|
| @DELETE       | Decorator that indicates a HTTP DELETE method.|
| @PathParam    | A method parameter may be decorated with the `@PathParam` decorator. The decorator reuquires a string parameter - the name of the parameter. The name must be present within the Path. For example `/books/:id`. One can access the id parameter parameter with `@PathParam('id')`|
| @HeaderParam  | You can access the http header information in the same way as a path parameter. The difference is, that the value will be determined by a http header entry at runtime. For example if you want to access a token that is stored in the http header use: `@HeaderParam('token)`|
| @QueryParam   | If you want to access url query parameters from your service use this decorator. For example in a url like this: `/books?readed=true` you can use `@QueryParam('readed')`|
| @Context (HttpRequest, HttpResponse)  | Sometime it may be necessary to play around with the original HttpRequest or the HttpResponse. In this case you can use the `@Context` decorator. For Example `@Context(ContextTpyes.HttpRequest)`|
| @SecurityContext  | This module provides decorators that can deal with security concerns out of the box. If this doesn't fits your needs you can inject the SecurityContext manually. For example: `withSecContext(@SecurityContext() context:ISecurityContext)` |
| @RolesAllowed | You may restrict the access to all methods of a class or a specific method. Just use the `@RolesAllowed` decorator: `@RolesAllowed(['admin'])`|
| @PermitAll    | If you want you service or service methods to be called by everyone use `@PermitAll`|

#### Remarks
- The HTTP Method decorators are only marker decorators. They don't have a parameter. The request path must be defined by the `@Path` decorator.
- If you use any of the build in security capabilities you need to register a `ISecurityContextFactory`. See below.
- If you specify `@RolesAllowed` or `@PermitAll` at class level and method level, the decorator at the method overwrites the decorator at class level.

This npm modul adds the following decorators:

|   Decorator   |   Description |
| ------------- | ------------- |
| @RenderWith   | The decorator expects a string as parameter. This is the view that should be used to render the result. For example: `@RenderWith('index')` will render the result of the service method with a view named `index`. You need to configure express with your preferred render engine: `app.set('view engine', 'pug');`. |
| @ExpressContext (HttpNextFunction) | The express framework provides a `next` function. If you need access to this function from within your service you may use this decorator for a method parameter. |


A more elaborate example:

```typescript
import { GET, POST, PUT, DELETE, Path, PathParam, HeaderParam } from 'js-restful';


@Path('/books')
class BookService {

    @GET()
    allBooks() : Book[]{
       return [];
    }

    @Path('/:name')
    @POST()
    createBook(@PathParam('name') name:string, @HeaderParam('token') token:string) :Book {
        return {id:1, name:name};
    }

    @Path('/:id/:name')
    @PUT()
    updateBook(@PathParam('id') id:number, @PathParam('name') name:string) : Book {
        return {id:id, name:name};
    }

    @Path('/:id')
    @DELETE()
    deleteBook(@PathParam('id') id:number): boolean {
        return true;
    }
}
```

After you have done this, setup your express app as you usually would. Then you can register a decorated instance of your service:

```TypeScript
import { ExpressServiceRegistry } from './service-registry';
import * as express from 'express';

let app = express();
ExpressServiceRegistry.registerService(app, new BookService());
```
That's it. Now your service is published as an RESTful service in your express app.

If you start your app you can access the urls:
<pre>
GET     /books                      -> []
POST    /books/simpsons             -> {id:1, name:'simpsons'}
PUT     /books/1/Huckleberry Finn   -> {id:1, name:'Huckleberry Finn'}
DELETE  /books/1                    -> true
</pre>

## Supported Return Types

So far we have seen that all servcie methods are synchronous. You can return simple javascript types or complex objects.
If you simply return a boolean, number, string these values will be returned as text/plain. null or undefined are
returned as text/plain if no HttpResponse-object is injected in the service method (in this case you have full control what should be returned to the client).
If you returns a complex object the result will be send as application/json.

But what if your service method is asynchronous? In this case you can use es6 promises. For example:

```TypeScript
import {Promise} from 'es6-promise';

@Path('/')
class TestService {

    @GET()
    get(){
        const p: Promise<any> = new Promise ((resolve, reject) => {
          resolve([{foo:'bar'}]);
        });
        return p;
    }
}
```
If you access the url '/' you will get `[{foo:'bar'}]` as the result. May be this is too much code for you - for me it is :smirk: .
Keep in mind that there are a lot of node modules that already use promisses. For example mongoose. With this you service could be as short as:

```TypeScript
import {Path, GET, RolesAllowed} from 'js-restful';
import {User} from './../models/userModel';

@Path('/users')
@RolesAllowed(['admin'])
export class UserService {

  @GET()
  users(){
    return User.find({}).exec();
  }

}
```

## Providing a ISecurityContextFactory
If you decorate your service with `@RolesAllowed`, `@PermitAll` or you are using `@SecurityContext` as a parameter
decorator you need to provide a `ISecurityContextFactory`. js-rstful-express need this factory to create a `ISecurityContext` to decide who is permitted to access
the service or service method.

This Factory must be registered at the `ExpressServiceRegistry` before you register your service classes:
```TypeScript
ExpressServiceRegistry.registerSecurityContextFactory(app, new SecurityContextFactory());
```
Here is a sample implementation that assumes you are using passport for authentication:

```TypeScript
class SecurityContextFactory implements ISecurityContextFactory {

  createSecurityContext(req:express.Request):ISecurityContext {
    return new SecurityContext(req);
  }

}
```
The `SecurityContext` needs to be created for every request!
```TypeScript
class SecurityContext implements ISecurityContext {

  user:User;

  constructor(private req:express.Request){
    this.user = new User(req);
  }

  isUserInRole(roleName:string):boolean {
    if(!this.user.isLoggedIn()){
      return false;
    }
    return this.user.hasRole(roleName);
  }
}
```
```TypeScript
export default class User implements IUser {

  private passportUser:any;
  private roles:string[] = [];

  constructor(private req:express.Request){

    if (req.isAuthenticated()){
      this.passportUser = req.user;
    }
  }

  isLoggedIn():boolean{
    return this.passportUser ? true : false;
  }

  hasRole(roleName:string):boolean {
    return this.passportUser.roles.indexOf(roleName) != -1;
  }
}
```

## Advantages
You may ask: what is the advantage of using decorators and TypeScript for your app? Here are some thoughts why it is useful:

- You may write less code you need to maintain and test.
- You can refactor your code with minimal impact at other parts of your application. Just move or rename your service class will not break how your service may be accessed.
- You can change who is allowed to access your service or service method without modifying your code. You just change the decorator.
- You can test your services more easily - if you do not use HttpReqest or HttpResponse directly you don't need to mock these objects.
- May be you have a background in Java and know what [JAX-RS](https://jax-rs-spec.java.net) is. In this case you will be familiar with this approach.