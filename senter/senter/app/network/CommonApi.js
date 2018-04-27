/**
 * Created by Evan on 2017/02/15.
 */

import { getFetchNeverCached, postFetchNeverCached } from './common/apiHelper';

export function GetBannerList() {
    return getFetchNeverCached(`/common/banner`);
}
export function GetVerifyCode(form) {
    return postFetchNeverCached(`/user/getsms`, form);
}