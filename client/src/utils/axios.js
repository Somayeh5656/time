import axios from 'axios';

const instance = axios.create({
  baseURL: 'http://server:5000/api',  // Muista vaihtaa oikea URL tuotantoon
});

export default instance;