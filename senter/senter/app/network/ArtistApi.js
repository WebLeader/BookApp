/**
 * Created by Evan on 2017/02/15.
 */

import { getFetchNeverCached, postFetchNeverCached } from './common/apiHelper';

export function GetArtistList(id) {
    return getFetchNeverCached(`/artist/list`);
}
