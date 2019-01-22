import Constants from '../../../constants';

const defaultValue = {status: false, values: {EC2: null, RDS: null}};

export default (state=defaultValue, action) => {
  switch (action.type) {
    case Constants.AWS_GET_RI_DATA:
      return {status: false, values: {EC2: null, RDS: null}};
    case Constants.AWS_GET_RI_DATA_SUCCESS_EC2:
      return {status: true, values: { EC2: action.data, RDS: state.values.RDS}};
    case Constants.AWS_GET_RI_DATA_SUCCESS_RDS:
    return {status: true, values: { EC2: state.values.EC2, RDS: action.data}};
    case Constants.AWS_GET_RI_DATA_ERROR:
      return {status: true, error: action.error};
    default:
      return state;
  }
};
