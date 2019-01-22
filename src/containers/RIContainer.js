import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Components from '../components';
import Actions from '../actions';
import Spinner from "react-spinkit";

import "../styles/Plugins.css";

// RIContainer Component
class RIContainer extends Component {
  componentDidMount() {
    this.props.getData();
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.accounts !== nextProps.accounts)
      nextProps.getData();
  }

  render() {
    const loading = (!this.props.data.status ? (<Spinner className="spinner" name='circle'/>) : null);

    const error = (this.props.data.error ? ` (${this.props.data.error.message})` : null);
    const noData = (this.props.data.status && ((!this.props.data.values.EC2 && !this.props.data.values.RDS) || error) ? <div className="alert alert-warning" role="alert">No data available{error}</div> : "");

    const spinnerAndError = (loading || noData ? (
      <div className="white-box">
        {loading}
        {noData}
      </div>
    ) : null);

    let table;
    if (this.props.data.status && this.props.data.values && (this.props.data.values.EC2 || this.props.data.values.RDS)) {
      table = <Components.AWS.RI.Table
        data={this.props.data.values}
      />;
    }

    return (
      <div>
        <div className="row">
          <div className="col-md-12">
            <div className="white-box">
              <h3 className="white-box-title no-padding inline-block">
                <i className="fa fa-calendar"></i>
                &nbsp;
                Reserved instances
              </h3>
            </div>
            {spinnerAndError}
            {table}
          </div>
        </div>
      </div>
    );
  }

}

RIContainer.propTypes = {
  data: PropTypes.object.isRequired,
  accounts: PropTypes.arrayOf(PropTypes.object),
  allAccounts: PropTypes.object,
  getData: PropTypes.func.isRequired,
};

/* istanbul ignore next */
const mapStateToProps = ({aws}) => ({
  data: aws.ri.data,
  accounts: aws.accounts.selection,
  allAccounts: aws.accounts.all,
});

/* istanbul ignore next */
const mapDispatchToProps = (dispatch) => ({
  getData: () => {
    dispatch(Actions.AWS.RI.getData());
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(RIContainer);
