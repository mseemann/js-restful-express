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
| @PathParam    | A method parameter may be decorated with the PathParam decorator. The decorator reuquires a name as a string parameter. The name must be present within the Path. For example `/books/:id`. One can access the parameter with `@PathParam('id')`|
| @HeaderParam  | You can access the http header information in the same way as a path parameter. The difference is, that the value will be determined by a http header entry ar run time. For example if ypu want to access a token that is stored in the http header use: `@HeaderParam('token)`|
| @QueryParam   | If you want to access url query params from your service use this decorator. For example in a url like this: `/books?readed=true` you can use `@QueryParam('readed')|
| @Context (HttpRequest, HttpResponse)  | Sometime it may be necessary to play around with the original HttpRequest or the HttpResponse. In this case you can use the @Context decorator. For Example `@Context(ContextTpyes.HttpRequest)`|
| @SecurityContext  | This module provides decorator that can deal with security concerns. If this doesn't fits your needs you can inject the SecurityContext manuall. For example: `withSecContext(@SecurityContext() context:ISecurityContext)` |
| @RolesAllowed | You may restrict the access to all methods of a class or a specific method. Just use the `@RolesAllowed` decorator: `@RolesAllowed(['admin'])`|
| @PermitAll    | If you want you service or service methods to be called by everyone use `@PermitAll`|

#### Remarks
- The HTTP Method decorator are only marker decorators. They don't have a parameter. The request path must be defined by the @Path decorator.
- If you use any of the build in security capabilities you need to register a `ISecurityContextFactory`.

This npm modul adds the following decorators:

|   Decorator   |   Description |
| ------------- | ------------- |
| @RenderWith   | The decorator expects a string as parameter. This is the view that should be used to render the result. For example: `@RenderWith('index')` will render the result of the service method with a view named index. You need to configure express with your preferred render engine: `app.set('view engine', 'pug');`. |
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

## Supported Return types

So far we have seen that all servcie methods are synchronous. You can return simple javascript types or complex objects.
If you simply return a boolean, number, string, null or undefined these values will be returned as text/plain. If you return
a complex object the result will be send as application/json.

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