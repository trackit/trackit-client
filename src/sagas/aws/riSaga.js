import { put, call } from 'redux-saga/effects';
import API from '../../api';
import Constants from '../../constants';
import {getAWSAccounts, getToken} from "../misc";

export function* getRISaga() {
  // try {
    // const token = yield getToken();
    // const accounts = yield getAWSAccounts();
    // const res = yield call(API.Plugins.getData, token, accounts);
  //   if (res.success === null) {
  //     yield put({type: Constants.LOGOUT_REQUEST});
  //     return;
  //   }
  //   if (res.success && res.hasOwnProperty("data") && !res.data.hasOwnProperty("error"))
  //     yield put({ type: Constants.GET_PLUGINS_DATA_SUCCESS, data: res.data });
  //   else
  //     throw Error("Error with request");
  // } catch (error) {
  //   yield put({ type: Constants.GET_PLUGINS_DATA_ERROR, error });
  // }

  const mockData = [
    {
      id:"i-04c195d19a089e8e9",
      service: "EC2",
      region:"eu-west-2",
      type:"m3.large",
      count:"2",
      purchaseDate:"2018-11-08T08:02:17-05:00",
      endDate:"2019-11-08T08:02:17-05:00",
      duration:"999999",
      purchaseBy:"testUser",
    },
    {
      id:"i-04c195d19a089e8e1",
      service: "EC2",
      region:"eu-west-2",
      type:"m4.large",
      count:"1",
      purchaseDate:"2018-09-08T08:02:17-05:00",
      endDate:"2021-09-08T08:02:17-05:00",
      duration:"5999999",
      purchaseBy:"testUser",
    },
    {
      id:"i-04c195d19a089e8e2",
      service: "EC2",
      region:"eu-west-2",
      type:"t2.micro",
      count:"1",
      purchaseDate:"2017-09-08T08:02:17-05:00",
      endDate:"2020-09-08T08:02:17-05:00",
      duration:"9999999",
      purchaseBy:"testUser",
    },
    {
      id:"i-04c195d19a089e8e3",
      service: "EC2",
      region:"eu-west-2",
      type:"m4.large",
      count:"1",
      purchaseDate:"2017-09-08T08:02:17-05:00",
      endDate:"2020-09-08T08:02:17-05:00",
      duration:"5999999",
      purchaseBy:"testUser",
    },
    {
      id:"i-04c195d19a089e8e4",
      service: "EC2",
      region:"eu-west-2",
      type:"t2.nano",
      count:"1",
      purchaseDate:"2017-09-08T08:02:17-05:00",
      endDate:"2020-09-08T08:02:17-05:00",
      duration:"9999999",
      purchaseBy:"testUser",
    },


    {
      id:"i-04c195d19a089e9e1",
      service: "EC2",
      region:"eu-west-2",
      type:"m4.large",
      count:"1",
      purchaseDate:"2018-09-08T08:02:17-05:00",
      endDate:"2021-09-08T08:02:17-05:00",
      duration:"4999999",
      purchaseBy:"testUser",
    },
    {
      id:"i-04c195d19a089e9e2",
      service: "EC2",
      region:"eu-west-2",
      type:"t2.micro",
      count:"1",
      purchaseDate:"2017-09-08T08:02:17-05:00",
      endDate:"2020-09-08T08:02:17-05:00",
      duration:"32999999",
      purchaseBy:"testUser",
    },
    {
      id:"i-04c195d19a089e9e3",
      service: "EC2",
      region:"eu-west-2",
      type:"m4.large",
      count:"1",
      purchaseDate:"2017-09-08T08:02:17-05:00",
      endDate:"2020-09-08T08:02:17-05:00",
      duration:"29999999",
      purchaseBy:"testUser",
    },
  ];

  yield put({ type: Constants.AWS_GET_RI_DATA_SUCCESS, data: mockData });
}