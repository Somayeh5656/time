import axios from 'axios';

const instance = axios.create({
  baseURL: 'http://localhost:5000/api',  // Muista vaihtaa oikea URL tuotantoon
});

export default instance;