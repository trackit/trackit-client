import { put, call } from 'redux-saga/effects';
import API from '../../api';
import Constants from '../../constants';
import {getAWSAccounts, getToken} from "../misc";

function addType(values, type) {
  values.forEach(element => {
    element.type = type;
  });
  return values;
}

export function* getRISaga() {

  try {
    const token = yield getToken();
    const accounts = yield getAWSAccounts();
    const resEC2 = yield call(API.AWS.RI.getEC2, token, accounts);
    const resRDS = yield call(API.AWS.RI.getRDS, token, accounts);

    if (resEC2.success === null || resRDS.success === null) {
      yield put({type: Constants.LOGOUT_REQUEST});
      return;
    }
    if (resEC2.success && resEC2.hasOwnProperty("data") && !resEC2.data.hasOwnProperty("error"))
      yield put({ type: Constants.AWS_GET_RI_DATA_SUCCESS_EC2, data: addType(resEC2.data, 'EC2') });
    else
      throw Error("Error with request");
    if (resRDS.success && resRDS.hasOwnProperty("data") && !resRDS.data.hasOwnProperty("error"))
      yield put({ type: Constants.AWS_GET_RI_DATA_SUCCESS_RDS, data: addType(resRDS.data, 'RDS') });
    else
      throw Error("Error with request");



    } catch (error) {
    yield put({ type: Constants.GET_PLUGINS_DATA_ERROR, error });
  }


}