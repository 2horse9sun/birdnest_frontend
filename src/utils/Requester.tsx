import API_CONFIG from '../configs/APIConfig';

// Encapsulation of Fetch

export function get(api: string) {
    return async (params?: {}) => {
        const { APIPrefix } = API_CONFIG;
        return handleData(fetch(buildParams(APIPrefix, api, params), {
            headers: {
            }
        }))
    }
}
export function post(api: string) {
    return (params: {}) => {
        return async (queryParams?: {} | string) => {
            const { APIPrefix } = API_CONFIG;
            var data, cType;
            if (params instanceof FormData) {
                data = params;
                cType = 'multipart/form-data';// fix TypeError: Network request failed
            } else {
                data = JSON.stringify(params);
                cType = 'application/json';
            }
            return handleData(fetch(buildParams(APIPrefix, api, queryParams),
                {
                    method: 'POST',
                    body: data,
                    headers: {
                        'content-type': cType
                    }
                }
            ))
        }
    }
}

function handleData(doAction: Promise<any>) {
    return new Promise((resolve, reject) => {
        doAction.then((res) => {
            const type = res.headers.get('Content-Type');
            if ((type || '').indexOf('json') !== -1) {
                return res.json();
            }
            return res.text();
        }).then((result) => {
            // console.log(JSON.stringify(result));
            if (typeof result === 'string') {
                throw new Error(result);
            }
            const { code, msg, data: { list = undefined } = {} } = result;
            if (code === 401) {
                //TODOnavigate to login page
                return;
            }
            resolve(list || result);
        }).catch((error) => {
            reject(error);
        })
    })
}

function buildParams(APIPrefix: string, api: string, params?: {} | string): string {
    let newUrl = new URL(api,APIPrefix), finalUrl;
    if (typeof params === 'object') {
        for (const [key, value] of Object.entries(params)) {
            newUrl.searchParams.append(key, value as string);
        }
        finalUrl = newUrl.toString();
    } else if (typeof params === 'string') {
        finalUrl = APIPrefix.endsWith("/") ? APIPrefix + params : APIPrefix + "/" + params;
    } else {
        finalUrl = newUrl.toString();
    }
    console.log(finalUrl);
    return finalUrl;
}