import axios from 'axios';
// staging server
export default axios.create({
  baseURL: 'http://localhost:4000/api/v1',
});
