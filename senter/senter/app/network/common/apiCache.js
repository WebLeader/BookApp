/**
 * Created by Evan on 2017/02/15.
 */

import {
    AsyncStorage
} from 'react-native';
import storage from 'react-native-simple-store';

/**
 * @param key
 * @param fetchFunc
 * @param cached 是否从缓存中取
 */
export default apiCache = (key, fetchFunc, cached = true) => {
    if (!cached) {
        //不缓存
        console.log(`禁用缓存模式 = ${key}`);
        return fetchFunc();
    }
    return storage.get(key).then(value => {
        if (value) {
            console.log(`命中缓存 = ${key}`);
            return value;
        } else {
            return fetchFunc().then(value => {
                console.log(`未命中缓存 = ${key}`);
                storage.save(key, value);//存储
                return value;
            });
        }
    });
}