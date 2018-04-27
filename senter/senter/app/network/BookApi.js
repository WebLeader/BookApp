/**
 * Created by dxxu on 2018/4/8.
 */
import {getFetchNeverCached, getFetchFromCache, postFetchNeverCached} from './common/apiHelper';

//保存
export function check(form) {
    return postFetchNeverCached(`check.do`,form);
}
//图书馆藏位置
export function getBookPositionState(form) {
    return postFetchNeverCached(`getBookPositionState.do`,form);
}
//图书状态和图书信息
export function getBookPositionStateList(form) {
    return postFetchNeverCached(`getBookPositionStateList.do`,form);
}
//获取指定层位图书状态
export function getPositionBookState(form) {
    return postFetchNeverCached(`getPositionBookState.do`,form);
}
//指定层位所有图书信息
export function getPositionBooks(form) {
    return postFetchNeverCached(`getPositionBooks.do`,form);
}
//上架
export function putaway(form) {
    return postFetchNeverCached(`putaway.do`,form);
}
//下架
export function soldOut(form) {
    return postFetchNeverCached(`soldOut.do`,form);
}
//图书数量统计
export function statistics() {
    return getFetchNeverCached(`statistics.do`);
}
//下架页面的扫描
export function getBookPosition() {
    return getFetchNeverCached(`getBookPosition.do`);
}