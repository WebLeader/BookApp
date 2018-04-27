/**
 * Created by Evan on 2017/02/15.
 */

import { getFetchNeverCached, postFetchNeverCached } from './common/apiHelper';

export function WechatOAuth(form) {
    return postFetchNeverCached(`/oauth/wxlogin`, form);
}
export function QQOAuth(form) {
    return postFetchNeverCached(`/oauth/qqlogin`, form);
}