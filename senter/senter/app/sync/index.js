import {GetMedioDetail,GetAlbumList,GetAlbumSubList} from '../network/AlbumApi';

import {GetBannerList} from '../network/CommonApi';

import {GetArtistList} from '../network/ArtistApi';

import {GetLiveitemList} from '../network/LiveApi'
const sync = {
    media(params) {
        const { id, resolve, reject } = params;
        GetMedioDetail(id).then(response => {
            switch (response.status) {
                case 200:
                    storage.save({
                        key: 'media',
                        id,
                        data: response.data
                    });

                    resolve && resolve(response.data);
                    break;
                default:
                    reject && reject(new Error('媒体信息获取失败！'));
                    break;
            }
        }).catch(error => {
            console.warn(error);
            reject && reject(error);
        });
    },

    albumlist(params) {
        const { id, resolve, reject } = params;
        GetAlbumSubList(id).then(response => {
            switch (response.status) {
                case 200:
                    storage.save({
                        key: 'albumlist',
                        id,
                        data: response.data
                    });
                    resolve && resolve(response.data);
                    break;
                default:
                    reject && reject(new Error('专辑清单获取失败!'));
                    break;
            }
        }).catch(error => {
            console.warn(error);
            reject && reject(error);
        });
    },

    albums(params) {
        const { id, resolve, reject } = params;
        GetAlbumList(id).then(response => {
            console.warn(JSON.stringify(response));
            switch (response.status) {
                case 200:
                    storage.save({
                        key: 'albums',
                        id,
                        data: response.data
                    });
                    resolve && resolve(response.data);
                    break;
                default:
                    reject && reject(new Error('专辑清单获取失败!'));
                    break;
            }
        }).catch(error => {
            console.warn(error);
            reject && reject(error);
        });
    },
    //轮播图获取数据
    bannerList(params) {
        const { resolve, reject } = params;
        GetBannerList().then(response => {
            console.warn(JSON.stringify(response));
            switch (response.status) {
                case 200:
                    storage.save({
                        key: 'bannerList',
                        data: response.data
                    });
                    resolve && resolve(response.data);
                    break;
                default:
                    reject && reject(new Error('专辑清单获取失败!'));
                    break;
            }
        }).catch(error => {
            console.warn(error);
            reject && reject(error);
        });
    },

    //好文
    artistList(params) {
        const { resolve, reject } = params;
        GetArtistList().then(response => {
            console.warn(JSON.stringify(response));
            switch (response.status) {
                case 200:
                    storage.save({
                        key: 'artistList',
                        data: response.data
                    });
                    resolve && resolve(response.data);
                    break;
                default:
                    reject && reject(new Error('文章清单获取失败!'));
                    break;
            }
        }).catch(error => {
            console.warn(error);
            reject && reject(error);
        });
    },

    //直播列表
    liveitemList(params) {
        const { resolve, reject } = params;
        GetLiveitemList().then(response => {
            console.warn(JSON.stringify(response));
            switch (response.status) {
                case 200:
                    storage.save({
                        key: 'liveitemList',
                        data: response.data
                    });
                    resolve && resolve(response.data);
                    break;
                default:
                    reject && reject(new Error('直播清单获取失败!'));
                    break;
            }
        }).catch(error => {
            console.warn(error);
            reject && reject(error);
        });
    },
}

export default sync;