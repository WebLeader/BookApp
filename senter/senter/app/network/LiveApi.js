/**
 * Created by Evan on 2017/02/15.
 */

import { getFetchNeverCached, postFetchNeverCached } from './common/apiHelper';

export function GetLiveitemList() {
    return getFetchNeverCached(`/live/streamlist`);//直播流列表
}
export function PostPullStreamList(form) {
    return postFetchNeverCached(`/live/pullstream`, form);//拉流地址
}
export function PostPushStreamList(form) {
    return postFetchNeverCached(`/live/pushstream`, form);//推流地址
}
