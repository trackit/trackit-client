import { call } from './misc.js';

export const login = (email, password, awsToken) => {
  return call('/user/login', 'POST', {email, password, awsToken, origin: "trackit"});
};

export const register = (email, password, awsToken) => {
  return call('/user', 'POST', {email, password, awsToken, origin: "trackit"});
};

export const recoverPassword = (email) => {
  return call('/user/password/forgotten', 'POST', {email, origin: "trackit"});
};

export const renewPassword = (id, password, token) => {
  return call('/user/password/reset', 'POST', {id, password, token});
};
