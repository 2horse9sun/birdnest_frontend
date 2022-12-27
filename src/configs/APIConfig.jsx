const PROTOCOL_HTTP = "http://";
// const PROTOCOL_HTTPS = "https://";
// const HOSTNAME_LOCALHOST = "localhost";
const PORT = "8080";
const API_PREFIX = "/api";
// const BASE_URL_LOCALHOST = `${PROTOCOL_HTTP}${HOSTNAME_LOCALHOST}:${PORT}${API_PREFIX}`;


// AWS EC2 address
const EC2_HOSTNAME = "ec2-34-245-23-103.eu-west-1.compute.amazonaws.com";
const BASE_URL_EC2 = `${PROTOCOL_HTTP}${EC2_HOSTNAME}:${PORT}${API_PREFIX}`;


//===================================================================
// const BASE_URL = BASE_URL_LOCALHOST;        // if backend run on localhost
const BASE_URL = BASE_URL_EC2;    // if backend run on AWS EC2
//===================================================================


// API routes
const API_ROUTE_VIOLATION = "/violation";


const API = {
    APIPrefix: BASE_URL,
    violationAPIPrefix: `${BASE_URL}${API_ROUTE_VIOLATION}`
};


export default API;