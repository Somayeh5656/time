import axios from 'axios';

const instance = axios.create({
  baseURL: 'https://time-1-1ewx.onrender.com/api',  // Muista vaihtaa oikea URL tuotantoon
});

export default instance;