import Config from '../../config';
import {ApiGet, ApiPost, ApiJsonp} from './ApiLive';
import {ApiMock} from './ApiMock';

const Domain = Config.baseDomain;
const timeOut = Config.timeOut;

export default (action, params, opt = {}) => {
    let url = action;
    if (!/(http|https):\/\//ig.test(action)) {
        url = Domain + action;
    }
    const options = {timeout: opt.timeout || timeOut};
    return Config.isMock() ?
        ApiMock(action, params, options) :
        ApiJsonp(url, params, options).then((res) => {
            console.log('-----------', res);
            return res;
        });
};
