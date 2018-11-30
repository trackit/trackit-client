import Constants from '../../constants';

export default {
	getData: () => ({
		type: Constants.AWS_GET_RI_DATA,
	}),
};
