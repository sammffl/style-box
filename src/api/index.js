/**
 * Created by SamMFFL on 17/2/28.
 */
import Api from './lib/ApiBase';
import ApiList from './ApiList';

function getMobileUseful(mobile) {
    return Api(ApiList.GET_MOBILE_USEFUL, {
        appId: '10901',
        mobileNo: mobile,
    })
}

export default {
    getMobileUseful,
};
