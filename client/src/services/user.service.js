import axios from 'axios';

axios.defaults.headers.common = {
  "Content-Type": "application/json",
  'Access-Control-Allow-Origin': "http://localhost:8080",
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS, PUT, PATCH, DELETE',
  'Access-Control-Allow-Headers': 'X-Requested-With,content-type',
  'Access-Control-Allow-Credentials': true
};

const baseUrl = 'http://localhost:8080/api/users'; 

const getAllUsers = () => {
  const request = axios.get(baseUrl);
  return request.then(response => response.data);
};

const getAllUsersBySenderId = () => {
  const request = axios.get(baseUrl + "?bySenderId=true");
  return request.then(response => response.data);
};

const createUser = (name) => {
  const request = axios.post(baseUrl, {name});
  return request.then(response => response.data);
}

const getMessage = (user, message_id) => {
  const request = axios.get(`${baseUrl}/${user.id}/messages/${message_id}`);
  return request.then(response => response.data);
}

const getUserMessages = (user) => {
  const request = axios.get(`${baseUrl}/${user.id}/messages`);
  return request.then(response => response.data);
}

const sendMessage = (data) => {
  const request = axios.post(`${baseUrl}/${data.receiver_id}/messages`, data);
  return request.then(response => response.data);
}

// eslint-disable-next-line import/no-anonymous-default-export
export default {
  getAllUsers,
  createUser,
  getMessage,
  getUserMessages,
  getAllUsersBySenderId,
  sendMessage,
};