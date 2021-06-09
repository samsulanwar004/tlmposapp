import axios from 'axios';
import {API_URL} from '@env';

function processResponse(response) {
  const code = response.status;
  const result = response.data;
  return Promise.all([code, result]).then(res => ({
    code: res[0],
    result: res[1]
  }));
}

export const profile = async(token) => {
  console.log(API_URL);
  return axios({
    method: 'get',
    headers: {'Authorization': 'Bearer '+token},
    url: API_URL+'/user/profile',
  }).then(processResponse)
  .then(function (response) {
    return response;
  })
  .catch(error => processResponse(error.response))
  .catch(function (error) {
    return error;
  });
}

export const order = async(token, data) => {
  console.log(API_URL);
  return axios({
    method: 'post',
    headers: {'Authorization': 'Bearer '+token},
    url: API_URL+'/user/order',
    data: data
  }).then(processResponse)
  .then(function (response) {
    return response;
  })
  .catch(error => processResponse(error.response))
  .catch(function (error) {
    return error;
  });
}

export const history = async(token) => {
  console.log(API_URL);
  return axios({
    method: 'get',
    headers: {'Authorization': 'Bearer '+token},
    url: API_URL+'/user/history',
  }).then(processResponse)
  .then(function (response) {
    return response;
  })
  .catch(error => processResponse(error.response))
  .catch(function (error) {
    return error;
  });
}