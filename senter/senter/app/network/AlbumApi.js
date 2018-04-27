/**
 * Created by Evan on 2017/02/15.
 */

import { getFetchNeverCached, postFetchNeverCached } from './common/apiHelper';

export function GetMedioDetail(id) {
    return getFetchNeverCached(`/album/media?id=${id}`);
}

export function GetAlbumSubList(id) {
    return getFetchNeverCached(`/album/list?id=${id}`);
}

export function GetAlbumList(status = 1) {
    return getFetchNeverCached(`/album?status=${status}`)
}
