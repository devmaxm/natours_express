/* eslint-disable */
import axios from 'axios';
import {showAlert} from './alerts';

export const updateSettings = async (data, type) => {
    try {
        const url =
            type === 'password'
                ? 'api/users/reset-password'
                : 'api/users/me';

        const res = await axios({
            method: 'PUT',
            url,
            data
        });

        if (res.data.status === 'success') {
            showAlert('success', `${type.toUpperCase()} updated successfully!`);
        }
    } catch (err) {
        showAlert('error', err.response.data.message);
    }
};
