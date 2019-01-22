import React, { Component } from 'react';
import moment from 'moment';
import PropTypes from 'prop-types';
import { Popover, OverlayTrigger } from 'react-bootstrap';

// RI Table Component
class TableComponent extends Component {

  constructor() {
    super();
    this.state = {
      asc: true,
      sort: 'usage',
    };
    this.sortData = this.sortData.bind(this);
    this.setSorting = this.setSorting.bind(this);
  }

  getUsage(startDate, endDate, usage) {
    const usable = moment.duration(moment().diff(moment(startDate)));
    const used = moment.duration(parseInt(usage, 10), 's');
    return ({
      usable,
      used
    });
  }

  getPercentage(value, total) {
    return ((value * 100) / total);
  }

  getStatusColor(percentage) {
    if (percentage >= 80)
      return 'green';
    if (percentage >= 40)
      return 'orange';
    return 'red';
  }

  getUsageLabel(usage) {
    const { used, usable } = usage;
    let resUsed = '';
    let resUsable = '';

    // Omitting hours as we are dealing with big timeranges
    if (usable.asMonths() > 1) {
      if (used.years() > 0) {
        resUsed += `${used.years()} ${used.years() > 1 ? 'years' : 'year'} `;
      }
      if (used.months() > 0) {
        resUsed += `${used.months()} ${used.months() > 1 ? 'months' : 'month'} `;
      }  
      resUsed += `${used.days()} ${used.days() > 1 ? 'days' : 'day'} used`;
      if (usable.years() > 0) {
        resUsable += `${usable.years()} ${usable.years() > 1 ? 'years' : 'year'} `;
      }
      if (usable.months() > 0) {
        resUsable += `${usable.months()} ${usable.months() > 1 ? 'months' : 'month'} `;
      }  
      resUsable += `${usable.days()} ${usable.days() > 1 ? 'days' : 'day'} `;
    } else {
      if (used.days() > 0) {
        resUsed += `${used.days()} ${used.days() > 1 ? 'days' : 'year'} `;
      }
      resUsed += `${used.hours()} ${used.hours() > 1 ? 'hours' : 'hour'} used`;
      if (usable.days() > 0) {
        resUsable += `${usable.days()} ${usable.days() > 1 ? 'days' : 'year'} `;
      }
      resUsable += `${usable.hours()} ${usable.hours() > 1 ? 'hours' : 'hour'} `;
    }
    return {used: resUsed, usable: resUsable};
  }

  getRow(item) {
    const usage = this.getUsage(item.reservation.start, item.reservation.end, item.reservation.usageDuration);
    const usageLabel = this.getUsageLabel(usage);
    const tooltip = (
      <Popover id="tooltip" title="Usage">
        <p style={{ textAlign:'center' }}>
          {usageLabel.used}
          <br/>
          <strong>on</strong>
          <br/>
          {usageLabel.usable}
        </p>
      </Popover>
    );

    return (<tr key={item.reservation.id}>
      <td style={{ textAlign : 'center' }}>
        <span className="badge blue-bg">{item.type}</span>
      </td>
      <td>
        <span className="badge white-bg">{item.reservation.instanceCount > 1 ? `${item.reservation.instanceCount} instances` : `${item.reservation.instanceCount} instance` }</span>
      </td>
      <td>{item.reservation.region}</td>
      <td><span className="badge grey-bg">{item.reservation.type}</span></td>
      <td>
        {moment.duration(moment(item.reservation.end).diff(moment(item.reservation.start))).asYears().toFixed(0)} years
        <br />
        {moment(item.reservation.start).format('YYYY-MM-DD')}
        &nbsp;
        <i className="fa fa-long-arrow-right"></i>
        &nbsp;
        {moment(item.reservation.end).format('YYYY-MM-DD')}
      </td>
      <td>
        <OverlayTrigger placement="top" overlay={tooltip}>
          <div className="progress m-t-15" style={{ minWidth: '150px', height: '10px' }}>
              <div
                  className={`progress-bar ${this.getStatusColor(this.getPercentage(usage.used, usage.usable))}-bg`}
                  role="progressbar"
                  aria-valuenow={this.getPercentage(usage.used, usage.usable)}
                  aria-valuemin="0"
                  aria-valuemax="100"
                  style={{
                    width: `${this.getPercentage(usage.used, usage.usable)}%`
                  }}
              >
              </div>
          </div>
        </OverlayTrigger>
      </td>
    </tr>);
  }

  setSorting(label) {
    console.log(label);
    if (this.state.sort === label) {
      this.setState({ asc : !this.state.asc });
    } else {
      this.setState({ sort: label });
    }
  }

  sortData(data) {
    const cloned = JSON.parse(JSON.stringify(data));

    if (this.state.sort === 'usage') {
      cloned.sort((a, b) => {
        const aUsage = this.getUsage(a.purchaseDate, a.endDate, a.duration);
        const bUsage = this.getUsage(b.purchaseDate, b.endDate, b.duration);
        const aPerc = this.getPercentage(aUsage.used, aUsage.usable);
        const bPerc = this.getPercentage(bUsage.used, bUsage.usable);

        if (aPerc > bPerc) {
          return this.state.asc ? 1 : -1;
        } else if (aPerc < bPerc) {
          return this.state.asc ? -1 : 1;
        } else {
          return 0;
        }
      });
    } else {
      cloned.sort((a, b) => {
        if (a[this.state.sort] > b[this.state.sort]) {
          return this.state.asc ? 1 : -1;
        } else if (a[this.state.sort] < b[this.state.sort]) {
          return this.state.asc ? -1 : 1;
        } else {
          return 0;
        }
      });
    }
    return cloned;
  }

  render() {
    console.log(this.props.data);
    let rows;
    const ec2Data = this.props.data.EC2;
    const rdsData = this.props.data.RDS;
    let res = [];
    if (ec2Data)
      res = res.concat(ec2Data);
    if (rdsData)
      res = res.concat(rdsData);
    // const sortedData = this.sortData(res);
    console.log(res);
    rows = res.map(item => this.getRow(item));

    return (
      <div className="white-box">
        <table className="table">
          <thead>
            <tr>
              <th className="clickable" style={{ textAlign : 'center' }} onClick={this.setSorting.bind(this, 'service')}>
                Service
                &nbsp;
                {this.state.sort === 'service' && (this.state.asc ? <i className="fa fa-arrow-down"/> : <i className="fa fa-arrow-up" />)}
              </th>
              <th className="clickable" onClick={this.setSorting.bind(this, 'id')}>
                #
                &nbsp;
                {this.state.sort === 'id' && (this.state.asc ? <i className="fa fa-arrow-down"/> : <i className="fa fa-arrow-up" />)}
              </th>
              <th className="clickable" onClick={this.setSorting.bind(this, 'region')}>
                Region
                &nbsp;
                {this.state.sort === 'region' && (this.state.asc ? <i className="fa fa-arrow-down"/> : <i className="fa fa-arrow-up" />)}
              </th>
              <th className="clickable" onClick={this.setSorting.bind(this, 'type')}>
                Type
                &nbsp;
                {this.state.sort === 'type' && (this.state.asc ? <i className="fa fa-arrow-down"/> : <i className="fa fa-arrow-up" />)}
              </th>
              <th className="clickable" onClick={this.setSorting.bind(this, 'purchaseDate')}>
                Term
                &nbsp;
                {this.state.sort === 'purchaseDate' && (this.state.asc ? <i className="fa fa-arrow-down"/> : <i className="fa fa-arrow-up" />)}
              </th>
              <th className="clickable" onClick={this.setSorting.bind(this, 'usage')}>
                Usage
                &nbsp;
                {this.state.sort === 'usage' && (this.state.asc ? <i className="fa fa-arrow-down"/> : <i className="fa fa-arrow-up" />)}
              </th>
            </tr>
          </thead>
          <tbody>
            {rows}
          </tbody>
        </table>
      </div>
    );
  }

}

TableComponent.propTypes = {
  data: PropTypes.object
};

export default TableComponent;
