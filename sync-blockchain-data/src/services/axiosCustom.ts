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
  requestSignature() {
    return axios.create({
      baseURL: 'http://localhost:3005/',
      headers: {
        'Content-Type': 'application/json',
        signature:
          '0xb91467e570a6466aa9e9876cbcd013baba02900b8979d43fe208a4a4f339f5fd6007e74cd82e037b800186422fc2da167c747ef045e5d18a5f5d4300f8e1a0291c',
        message: 'Some data',
      },
    });
  },
};
export default axiosCustom;
