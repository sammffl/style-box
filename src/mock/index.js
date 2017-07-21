/**
 * Created by SamMFFL on 17/2/28.
 */
import ApiList from '../api/ApiList';
import test from './test.js';
import mobileUsefulObj from './mobileUsefulObj'

export default {
    [ApiList.TEST_API]: test,
    [ApiList.GET_MOBILE_USEFUL]: mobileUsefulObj,
};
