/**
 * Created by Evan on 2017/02/16.
 */

import {getFetchNeverCached, getFetchFromCache, postFetchNeverCached} from './common/apiHelper';

export function GetVerifyCode(mobile) {
    return getFetchNeverCached(`/UserCenter/GetVerifyCode/${mobile}`);
}

export function UserRegister(form) {
    return postFetchNeverCached(`/user/register`, form);
}

export function UserLogin(form) {
    return postFetchNeverCached(`/user/login`, form);
}

export function UserResetPassword(form){
    return postFetchNeverCached(`/User/resetPassword`, form);
}

export function UserInfo(form) {
    return postFetchNeverCached(`/user/info`, form);
}

export function UserRechargeInfo(form) {
    return postFetchNeverCached(`/User/recharge`, form);
}

export function UserSubscribeInfo(form) {
    return postFetchNeverCached(`/User/subscribe`, form);
}

export function UserWithdrawInfo(form) {
    return postFetchNeverCached(`/User/withdraw`, form);
}

export function UserDividendInfo(form) {
    return postFetchNeverCached(`/User/dividend`, form);
}

export function UserInvestSubmit(form){
    return postFetchNeverCached(`/User/invest`, form);
}

export function UserInvestGet(form){
    return postFetchNeverCached(`/User/investInfo`, form);
}

export function UserProjectActiveList(form){
    return postFetchNeverCached(`/User/activeList`, form);
}

export function UserProjectSubscribeList(form){
    return postFetchNeverCached(`/User/subscribeList`, form);
}

export function UserDividendList(form){
    return postFetchNeverCached(`/User/dividentsList`, form);
}

export function UserProjectBussiness(form){
    return postFetchNeverCached(`/User/projectBussiness`, form);
}

export function UserProjectLaunchList(form){
    return postFetchNeverCached(`/User/launchList`, form);
}

export function UserProjectLendingSubmit(form){
    return postFetchNeverCached(`/User/lending`, form);
}

export function UserRecommendUsers(form) {
    return postFetchNeverCached(`/User/recommendUsers`, form)
}

export function UserRecommendSubscribe(form) {
    return postFetchNeverCached(`/User/recommendSubscribe`, form)
}