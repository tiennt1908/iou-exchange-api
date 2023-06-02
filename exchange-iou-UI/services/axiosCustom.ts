import axios from 'axios';

const axiosCustom = {
  request() {
    return axios.create({
      headers: {
        'Content-Type': 'application/json',
      },
      baseURL: 'http://localhost:3005/',
    });
  },
};
export default axiosCustom;
