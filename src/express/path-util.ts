

export function getPathFromString(path: string| void): string{
    let result =  <string>(path ? path : "/");
    return result.indexOf('/') === 0 ? result : '/'+result;
}