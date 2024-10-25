import axios from 'axios';
import { PublicRequestParams } from '../typings/utility.types';

export const useRequest = () => {
    const makePublicRequest = async (publicRequestParams: PublicRequestParams) => {
        return axios.request(publicRequestParams);
    };

    const parseErrorMessage = (e: any) => {
        let message = 'Oops, looks like something went wrong!';

        if (e.response && typeof e.response.data.message === 'string') {
            message = e.response.data.message;
        } else if (e.response && typeof e.response.data === 'string') {
            message = e.response.data;
        }

        return message;
    };

    return { makePublicRequest, parseErrorMessage };
};
