import React,{Component} from 'react';
export default function fetchPostTimeOut(url,data,timeout) {
    return _fetch(fetch_post_promise(url, data), timeout);
}

function _fetch(fetch_promise, timeout) {
    if(timeout)
    var abort_fn = null;
    var abort_promise = new Promise((resolve, reject) => {
        abort_fn = function() {
            reject('timeout');
        };
    });
    var abortable_promise = Promise.race([
        fetch_promise,
        abort_promise
    ]);
    setTimeout(function(){
        abort_fn();
    }, timeout);

    return abortable_promise;
}

/**
 * 分装post
 * @param {*请求url} url 
 * @param {*请求对象} data 
 */
function fetch_post_promise(url, data) {
    console.warn("fetch's data "+JSON.stringify(data));
    return new Promise((resolve, reject) => {
        fetch(url,{
            method: 'POST',
            headers: {
                Accept: '*/*',
                'Content-Type': 'application/json;charset=UTF-8'
            },
            body: JSON.stringify(data)
        }).then((response) => {
            return response.json();
        }).then((jsonData) => {
            resolve(jsonData);
        }).catch((err) => {
            reject(err);//这里可以使用resolve(err),将错误信息传回去
            if (err === 'Network request failed'){
                console.log('网络出错');
            } else if (err === 'fetch timeout'){
                console.log('请求超时');
            }
        })
    })
}