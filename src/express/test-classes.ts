
import {GET, POST, PUT, DELETE, Path, PathParam, HeaderParam } from 'js-restful';

export class Book {
    id:number;
    name: string;
}

@Path('/books')
export class BookService {

    testProperty:number = 2;

    unDecoratedMethod(){}

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
    deleteBook(@PathParam('id') id:number): boolean{
        return true;
    }
}