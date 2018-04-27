
import {getFetchNeverCached, postFetchNeverCached, formFetchNeverCached} from './common/apiHelper';

export function getTradingList(){
    return getFetchNeverCached(`/EquityTrading/list`);
}

export function postTrading(form){
    return postFetchNeverCached(`/EquityTrading/add`, form);
}