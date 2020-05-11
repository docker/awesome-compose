import axios from 'axios';
import config from '../config/constants';


export async function request (method, uri, data, headers = null, params = null) {
    let url = (config.API_BASE_URL + uri);
    let query = {
        method: method,
        url: url
    };
    if (headers !== null)
        query.headers = headers;
    if (params !== null)
        query.params = params;
    if (method === 'post' || method === 'put' || method === 'delete' || method === 'patch')
        query.data = data;
    try {
        return await axios(query);
    } catch (e) {
         throw e;
    }
}