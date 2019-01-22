import { call } from "../misc";
import moment from 'moment';

export const getEC2 = (token, accounts=undefined) => {
  let route = `/ri/ec2?date=${moment().startOf('month').format('YYYY-MM-DD')}`;
  if (accounts && accounts.length)
    route += `&accounts=${accounts.join(',')}`;
  return call(route, 'GET', null, token);
};

export const getRDS = (token, accounts=undefined) => {
  let route = `/ri/rds?date=${moment().startOf('month').format('YYYY-MM-DD')}`;
  if (accounts && accounts.length)
    route += `&accounts=${accounts.join(',')}`;
  return call(route, 'GET', null, token);
};
