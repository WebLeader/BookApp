
import apiCache from './apiCache'

const showLog = __DEV__;

/**
 * @param url 完整路径
 */
const getFetch = (url, cached) => {
    const fetchFunc = () => {
        return fetch(url, {
            method: 'GET',
            headers: {
                Accept: '*/*',
                'Content-Type': 'application/json;charset=UTF-8'
            }
        }).then(convertRespToJson)
    };
    return apiCache(url, fetchFunc, cached).then(defaultAnalyse);
};

/**
 * @param url 完整路径
 */
//后台获取json数据调用
// const postFetch = url => jsonData => {
//     return fetch(url, {
//         method: 'POST',
//         headers: {
//             Accept: '*/*',
//             'Content-Type': 'application/json;charset=UTF-8'
//         },
//         body: jsonData
//     }).then(convertRespToJson).then(defaultAnalyse);
// };

//做了特殊处理，前台传过来的参数，先转成字符串格式，再转json格式，再做数据拼接，该接口只适用于后台获取字符串的数据
const postFetch = url => jsonData => {
    // console.warn(jsonData);
    // console.warn(getParam(JSON.parse(jsonData)));
    return fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
        },
        body: getParam(JSON.parse(jsonData)) //字符串转json
    }).then(convertRespToJson).then(defaultAnalyse);
};

/**
 * @param url 完整路径
 */
const postForm = url => data => {
    return fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
        },
        body: getParam(data)
    }).then(convertRespToJson).then(defaultAnalyse);
};

//拼接参数
 const getParam = data => {
     return Object.entries(data).map(([key, value]) => {
         return `${key}=${value}`//TODO 是否得用encodeURI函数
     }).join('&');
 };

/**
 * @param cached 是否优先本地缓存
 * @param path 相对路径
 */
const get = cached => (path, data) => {
    let url = `${baseURL}${path}`;
    if (data) {
        url.append(`?${getParam(data)}`)
    }
    return loggerWrap(`GET ${url}`)(() => {
        return getFetch(url, cached);
    });
};

/**
 * @param path 相对路径
 */
const post = cached =>(path, data) => {
    var jsonData = JSON.stringify(data);
    var url = baseURL + path;
    return loggerWrap(`POST ${url} ${jsonData}`)(() => {
        return postFetch(url)(jsonData);
    });
};

const form = cached =>(path, data) => {
    var jsonData = JSON.stringify(data);
    var url = baseURL + path;
    return loggerWrap(`POST ${url} ${jsonData}`)(() => {
        return postForm(url)(data);
    });
};

/**
 * 日志打印
 * @param requestInfo
 */
const loggerWrap = requestInfo => fetchFunc => {
    if (showLog) {
        let startTime = new Date().getTime();//开始请求时间
        return fetchFunc().then(result => {
            console.log(`【请求接口成功】\r\n【请求接口】${requestInfo}\r\n【耗费时间】${new Date().getTime() - startTime}ms\r\n【收到数据】${JSON.stringify(result)}`);
            return result;
        }).catch(err => {
            console.log(`【请求接口失败】\r\n【请求接口】${requestInfo}\r\n【错误信息】${err}`);
            return Promise.reject(err);
        });
    }
    return fetchFunc();
};

const convertRespToJson = response => {
    return response.json();
};

const defaultAnalyse = response => {
    return response;
};

export const getFetchFromCache = get(true);//缓存
export const getFetchNeverCached = get(false);//不缓存
export const postFetchFromCache = post(true);//缓存
export const postFetchNeverCached = post(false);//不缓存

export const formFetchNeverCached = form(false);