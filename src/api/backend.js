import axios from 'axios';

export default axios.create({
    baseURL : process.env.NODE_ENV ===  "production" ? 'PRODUCTION' : "http://localhost:4002"
});

