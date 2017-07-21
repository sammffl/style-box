import Mock from '../../mock';

export function ApiMock(action, params, opt) {
    const resData = Mock[action];
    return Promise.resolve(resData);
}
