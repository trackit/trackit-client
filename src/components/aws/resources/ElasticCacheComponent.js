import React, {Component} from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Actions from "../../../actions";
import Spinner from "react-spinkit";
import Moment from 'moment';
import ReactTable from 'react-table';
import Popover from '@material-ui/core/Popover';
import {formatPrice} from '../../../common/formatters';
import Misc from '../../misc';

const Tooltip = Misc.Popover;

export class Nodes extends Component {

  constructor(props) {
    super(props);
    this.state = {
      showPopOver: false
    };
    this.handlePopoverOpen = this.handlePopoverOpen.bind(this);
    this.handlePopoverClose = this.handlePopoverClose.bind(this);
  }

  handlePopoverOpen = (e) => {
    e.preventDefault();
    this.setState({ showPopOver: true });
  };

  handlePopoverClose = (e) => {
    e.preventDefault();
    this.setState({ showPopOver: false });
  };

  render() {
    return (
      <div>
        <Popover
          open={this.state.showPopOver}
          anchorEl={this.anchor}
          onClose={this.handlePopoverClose}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'center',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'center',
          }}
        >
          <div
            className="nodes-list"
            onClick={this.handlePopoverClose}
          >
            {this.props.nodes.map((node, index) => (<div key={index} className="nodes-item">ID {node.id} : {node.region}</div>))}
          </div>
        </Popover>
        <div
          ref={node => {
            this.anchor = node;
          }}
          onClick={this.handlePopoverOpen}
        >
          <Tooltip placement="bottom" icon={<i className="fa fa-server"/>} tooltip="Click to see more details"/>
        </div>
      </div>
    );
  }

}

Nodes.propTypes = {
  nodes: PropTypes.arrayOf(PropTypes.object).isRequired
};

export class ElasticCacheComponent extends Component {

  componentWillMount() {
    this.props.getData(this.props.dates.startDate);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.accounts !== this.props.accounts || nextProps.dates !== this.props.dates)
      nextProps.getData(nextProps.dates.startDate);
  }

  render() {
    const loading = (!this.props.data.status ? (<Spinner className="spinner" name='circle'/>) : null);
    const error = (this.props.data.error ? (<div className="alert alert-warning" role="alert">Error while getting data ({this.props.data.error.message})</div>) : null);

    let reportDate = null;
    let instances = [];
    if (this.props.data.status && this.props.data.hasOwnProperty("value") && this.props.data.value) {
      const reportsDates = this.props.data.value.map((account) => (Moment(account.reportDate)));
      const oldestReport = Moment.min(reportsDates);
      const newestReport = Moment.max(reportsDates);
      reportDate = (<Tooltip info tooltip={"Reports created between " + oldestReport.format("ddd D MMM HH:mm") + " and " + newestReport.format("ddd D MMM HH:mm")}/>);
      instances = [].concat.apply([], this.props.data.value.map((account) => (account.instances)));
    }

    const regions = [];
    const types = [];
    const engines = [];
    if (instances)
      instances.forEach((instance) => {
        if (regions.indexOf(instance.region) === -1)
          regions.push(instance.region);
        if (types.indexOf(instance.type) === -1)
          types.push(instance.type);
        if (engines.indexOf(instance.engine) === -1)
          engines.push(instance.engine);
      });
    regions.sort();
    types.sort();
    engines.sort();

    const list = (!loading && !error ? (
      <ReactTable
        data={instances}
        noDataText="No instances available"
        filterable
        defaultFilterMethod={(filter, row) => String(row[filter.id]).toLowerCase().includes(filter.value)}
        columns={[
          {
            Header: 'Name',
            accessor: 'id',
            minWidth: 150,
            Cell: row => (<strong>{row.value}</strong>)
          },
          {
            Header: 'Type',
            accessor: 'nodeType',
            filterMethod: (filter, row) => (filter.value === "all" ? true : (filter.value === row[filter.id])),
            Filter: ({ filter, onChange }) => (
              <select
                onChange={event => onChange(event.target.value)}
                style={{ width: "100%" }}
                value={filter ? filter.value : "all"}
              >
                <option value="all">Show All</option>
                {types.map((type, index) => (<option key={index} value={type}>{type}</option>))}
              </select>
            )
          },
          {
            Header: 'Region',
            accessor: 'region',
            filterMethod: (filter, row) => (filter.value === "all" ? true : (filter.value === row[filter.id])),
            Filter: ({ filter, onChange }) => (
              <select
                onChange={event => onChange(event.target.value)}
                style={{ width: "100%" }}
                value={filter ? filter.value : "all"}
              >
                <option value="all">Show All</option>
                {regions.map((region, index) => (<option key={index} value={region}>{region}</option>))}
              </select>
            )
          },
          {
            Header: 'Cost',
            accessor: 'cost',
            filterable: false,
            Cell: row => (formatPrice(row.value))
          },
          {
            Header: 'Engine',
            columns: [
              {
                Header: 'Name',
                accessor: 'engine',
                filterMethod: (filter, row) => (filter.value === "all" ? true : (filter.value === row[filter.id])),
                Filter: ({ filter, onChange }) => (
                  <select
                    onChange={event => onChange(event.target.value)}
                    style={{ width: "100%" }}
                    value={filter ? filter.value : "all"}
                  >
                    <option value="all">Show All</option>
                    {engines.map((region, index) => (<option key={index} value={region}>{region}</option>))}
                  </select>
                )
              },
              {
                Header: 'Version',
                accessor: 'engineVersion',
                filterable: false
              },
            ]
          },
          {
            Header: 'Nodes',
            accessor: 'nodes',
            maxWidth: 75,
            filterable: false,
            Cell: row => ((row.value && row.value.length) ?
              (<Nodes nodes={row.value}/>) :
              (<Tooltip placement="left" icon={<i className="fa fa-server disabled"/>} tooltip="No nodes"/>))
          },
        ]}
        defaultSorted={[{
          id: 'name'
        }]}
        defaultPageSize={10}
        className=" -highlight"
      />
    ) : null);

    return (
      <div className="clearfix resources elasticache">
        <h3 className="white-box-title no-padding inline-block">
          <i className="menu-icon fa fa-database"/>
          &nbsp;
          ElastiCache
          {reportDate}
        </h3>
        {loading}
        {error}
        {list}
      </div>
    )
  }

}

ElasticCacheComponent.propTypes = {
  accounts: PropTypes.arrayOf(PropTypes.object),
  data: PropTypes.shape({
    status: PropTypes.bool.isRequired,
    error: PropTypes.instanceOf(Error),
    value: PropTypes.arrayOf(PropTypes.shape({
      account: PropTypes.string.isRequired,
      reportDate: PropTypes.string.isRequired,
      instances: PropTypes.arrayOf(
        PropTypes.shape({
          id: PropTypes.string.isRequired,
          region: PropTypes.string.isRequired,
          nodeType: PropTypes.string.isRequired,
          nodes: PropTypes.arrayOf(PropTypes.object),
          engine: PropTypes.string.isRequired,
          engineVersion: PropTypes.string.isRequired,
          cost: PropTypes.number.isRequired,
        })
      )
    }))
  }),
  getData: PropTypes.func.isRequired,
  clear: PropTypes.func.isRequired,
  dates: PropTypes.object,
};

/* istanbul ignore next */
const mapStateToProps = ({aws}) => ({
  accounts: aws.accounts.selection,
  dates: aws.resources.dates,
  data: aws.resources.EC
});

/* istanbul ignore next */
const mapDispatchToProps = (dispatch) => ({
  getData: (date) => {
    dispatch(Actions.AWS.Resources.get.EC(date));
  },
  clear: () => {
    dispatch(Actions.AWS.Resources.clear.EC());
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(ElasticCacheComponent);
