export { ExpressServiceRegistry } from './express/service-registry';
export { RenderWith, ExpressContext } from './express/decorators';
export { ExpressContextType, ISecurityContextFactory } from './express/descriptions';
// reexport js-restful to make usage easier.
export {
    GET,
    POST,
    PUT,
    DELETE,
    Path,
    PathParam,
    HeaderParam,
    QueryParam,
    Context,
    PermitAll,
    SecurityContext,
    RolesAllowed,
    HttpMethod,
    ContextTypes,
    ISecurityContext,
    IUser } from 'js-restful';



