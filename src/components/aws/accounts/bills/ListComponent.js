import React, { Component } from 'react';
import { connect } from 'react-redux';
import List, {
  ListItem,
  ListItemText,
} from 'material-ui/List';
import Spinner from 'react-spinkit';
import Misc from '../../../misc';
import PropTypes from 'prop-types';
import Form from './FormComponent';
import Actions from "../../../../actions";

const Dialog = Misc.Dialog;
const DeleteConfirmation = Misc.DeleteConfirmation;

export class Item extends Component {

  constructor(props) {
    super(props);
    this.editBill = this.editBill.bind(this);
    this.deleteBill = this.deleteBill.bind(this);
  }

  editBill = (body) => {
    body.id = this.props.bill.id;
    this.props.editBill(this.props.account, body);
  };

  deleteBill = () => {
    this.props.deleteBill(this.props.account, this.props.bill.id);
  };

  render() {
    const status = (this.props.bill && this.props.bill.status ? (
        <div className="alert alert-danger">
		{this.props.bill.status}
	</div>
    ) : null);

    return (
      <ListItem divider>

	    <div>
            {status}

            <ListItemText
              disableTypography
              primary={`s3://${this.props.bill.bucket}/${this.props.bill.prefix}`}
        	/>
	    </div>

        <div className="actions">

          <div className="inline-block">
            <Form
              account={this.props.account}
              bill={this.props.bill}
              submit={this.editBill}
            />
          </div>
          &nbsp;
          <div className="inline-block">
            <DeleteConfirmation entity="account" confirm={this.deleteBill}/>
          </div>

        </div>

      </ListItem>
    );
  }

}

Item.propTypes = {
  account: PropTypes.number.isRequired,
  bill: PropTypes.shape({
    bucket: PropTypes.string.isRequired,
    prefix: PropTypes.string.isRequired
  }),
  editBill: PropTypes.func.isRequired,
  deleteBill: PropTypes.func.isRequired
};

// List Component for AWS Accounts
export class ListComponent extends Component {

  constructor(props) {
    super(props);
    this.getBills = this.getBills.bind(this);
    this.clearBills = this.clearBills.bind(this);
	  this.newBill = this.newBill.bind(this);
  }

  getBills() {
    this.props.getBills(this.props.account);
  }

  clearBills() {
    this.props.clearBills();
  }

  newBill = (body) => {
	  this.props.newBill(this.props.account, body);
  };

  render() {
    const loading = (!this.props.bills.status ? (<Spinner className="spinner" name='circle'/>) : null);

    const error = (this.props.bills.error ? ` (${this.props.bills.error.message})` : null);
    const noBills = (this.props.bills.status && (!this.props.bills.values || !this.props.bills.values.length || error) ? <div className="alert alert-warning" role="alert">No bills available{error}</div> : "");

    const bills = (this.props.bills.status && this.props.bills.values && this.props.bills.values.length ? (
      this.props.bills.values.map((bill, index) => (
        <Item
          key={index}
          bill={bill}
          account={this.props.account}
          editBill={this.props.editBill}
          deleteBill={this.props.deleteBill}/>
      ))
    ) : null);

    const form = (<Form
      account={this.props.account}
      submit={this.newBill}
    />);

    return (
      <Dialog
        buttonName="Bills locations"
        title="Bills locations"
        secondActionName="Close"
        onOpen={this.getBills}
        onClose={this.clearBills}
        titleChildren={form}
      >

        <List className="bills-list">
          {loading}
          {noBills}
          {bills}
        </List>

      </Dialog>
    );
  }

}

ListComponent.propTypes = {
  account: PropTypes.number.isRequired,
  bills: PropTypes.shape({
    status: PropTypes.bool.isRequired,
    error: PropTypes.instanceOf(Error),
    values: PropTypes.arrayOf(
      PropTypes.shape({
        bucket: PropTypes.string.isRequired,
        prefix: PropTypes.string.isRequired
      })
    )
  }),
  getBills: PropTypes.func.isRequired,
	newBill: PropTypes.func.isRequired,
  editBill: PropTypes.func.isRequired,
  deleteBill: PropTypes.func.isRequired,
  clearBills: PropTypes.func.isRequired
};

/* istanbul ignore next */
const mapStateToProps = (state) => ({
  bills: state.aws.accounts.bills
});

/* istanbul ignore next */
const mapDispatchToProps = (dispatch) => ({
  getBills: (accountID) => {
    dispatch(Actions.AWS.Accounts.getAccountBills(accountID));
  },
  newBill: (accountID, bill) => {
    dispatch(Actions.AWS.Accounts.newAccountBill(accountID, bill))
  },
  editBill: (accountID, bill) => {
    dispatch(Actions.AWS.Accounts.editAccountBill(accountID, bill))
  },
  deleteBill: (accountID, billID) => {
    dispatch(Actions.AWS.Accounts.deleteAccountBill(accountID, billID));
  },
  clearBills: () => {
    dispatch(Actions.AWS.Accounts.clearAccountBills());
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(ListComponent);
