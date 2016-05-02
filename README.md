# js-restful-express
Create a RESTful service with ES7 decorators for your express based node.js application.


[![CI Status](http://img.shields.io/travis/mseemann/js-restful-express.svg?style=flat)](https://travis-ci.org/mseemann/js-restful-express)
[![npm version](https://badge.fury.io/js/js-restful-express.svg)](http://badge.fury.io/js/js-restful-express)
[![Downloads](http://img.shields.io/npm/dm/js-restful-express.svg)](https://npmjs.org/package/js-restful-express)
[![Coverage Status](https://coveralls.io/repos/github/mseemann/js-restful-express/badge.svg?branch=master)](https://coveralls.io/github/mseemann/js-restful-express?branch=master)
[![Code Climate](https://codeclimate.com/github/mseemann/js-restful-express/badges/gpa.svg)](https://codeclimate.com/github/mseemann/js-restful-express)


**Installation**
```bash
npm install js-restful-express --save
```

**Prerequisites**
- you use TypeScript for your app
- you use express 4.x as your http framework for your node.js application

**Usage**

Decorate your service class with the decorators from the [js-restful](https://github.com/mseemann/js-restful) Github-project.
So far there are the following decorators available:
- @Path
- @GET
- @POST
- @PUT
- @DELETE
- @PathParam
- @HeaderParam
- @QueryParam

For example:

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

After you have done this, setup your express app as you usually would. If done you can register a decorated instance of your service:

```TypeScript
import { ExpressServiceRegistry } from './service-registry';
import * as express from 'express';

let app = express();
ExpressServiceRegistry.registerService(app, new BookService());
```
That's it. Now your service is published as an RESTful service at your express app.

If you start your app you can access the urls:
<pre>
GET     /books                      -> []
POST    /books/simpsons             -> {id:1, name:'simpsons'}
PUT     /books/1/Huckleberry Finn   -> {id:1, name:'Huckleberry Finn'}
DELETE  /books/1                    -> true
</pre>


