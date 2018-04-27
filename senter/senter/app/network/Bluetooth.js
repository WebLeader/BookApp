/**
 * Created by Xionh on 2017/8/15.
 */

import { getFetchNeverCached, postFetchNeverCached } from './common/apiHelper';

export function PostBluetooth(form) {
    return postFetchNeverCached(`/locker/bluetooth`, form);
}