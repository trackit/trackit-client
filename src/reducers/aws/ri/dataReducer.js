import Constants from '../../../constants';

const defaultValue = {status: false, values: []};

export default (state=defaultValue, action) => {
  switch (action.type) {
    case Constants.AWS_GET_RI_DATA:
      return {status: false};
    case Constants.AWS_GET_RI_DATA_SUCCESS:
      return {status: true, values: action.data};
    case Constants.AWS_GET_RI_DATA_ERROR:
      return {status: true, error: action.error};
    default:
      return state;
  }
};
