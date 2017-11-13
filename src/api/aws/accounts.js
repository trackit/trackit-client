import { call } from './../misc.js';

export const getAccounts = (token) => {
  return call('/aws', 'GET', null, token);
};

export const newAccount = (account, token) => {
  return call('/aws', 'POST', account, token);
};

export const deleteAccount = (accountID, token) => {
//  return call('/aws/' + accountID, 'DELETE', null, token);
  return { status: true, data: {} };
};

export const newExternal = (token) => {
  return call('/aws/next', 'GET', null, token);
};