import axios from 'axios';


export function request (method, uri, data, headers = null, params = null) {
    let query = {
        method,
        url: uri
    };
    if (headers !== null)
        query.headers = headers;
    if (params !== null)
        query.params = params;
    if (method === 'post' || method === 'put' || method === 'delete' || method === 'patch')
        query.data = data;
    return axios(query);
}
