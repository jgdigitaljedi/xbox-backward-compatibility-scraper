import axios from 'axios';

export default {
  search(name, platform) {
    return axios.post('http://localhost:4001/api/search', { name, platform });
  },
  fuzzy(name) {
    return axios.post('http://localhost:4001/api/fuzzy', { name });
  },
  XbToXb360() {
    return axios.get('http://localhost:4001/api/xbto360');
  },
  XbToXbOne() {
    return axios.get('http://localhost:4001/api/xbtoone');
  },
  Xb360ToXbOne() {
    return axios.get('http://localhost:4001/api/xb360toone');
  },
  saveGame(oldData, newData, list) {
    return axios.post('http://localhost:4001/api/saveGame', { oldData, newData, list });
  }
};
