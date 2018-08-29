import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Components from '../components';
import Actions from '../actions';
import NVD3Chart from 'react-nvd3';
import * as d3 from 'd3';


const TimerangeSelector = Components.Misc.TimerangeSelector;


const context = {
  formatXAxis: (d) => (d3.time.format('%x')(new Date(d))),
  formatYAxis: (d) => ('$' + d3.format(',.2f')(d)),
};

const xAxis = {
  tickFormat: {
    name:'formatXAxis',
    type:'function',
  }
};

const yAxis = {
  tickFormat: {
    name:'formatYAxis',
    type:'function',
  }
};

/* istanbul ignore next */
const formatX = (d) => {
  const date = new Date(d[0]);
  return date.getTime();
};

/* istanbul ignore next */
const formatY = (d) => (d[1]);

const margin = {
  right: 10,
  left: 70,
};

// EventsContainer Component
class EventsContainer extends Component {
  componentDidMount() {
    if (this.props.dates) {
      const dates = this.props.dates;
      this.props.getData(dates.startDate, dates.endDate);
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.dates && (this.props.dates !== nextProps.dates || this.props.accounts !== nextProps.accounts))
      nextProps.getData(nextProps.dates.startDate, nextProps.dates.endDate);
  }

  formatData(data) {
    const res = [
      {
        key: "Cost",
        values: [],
      },
      {
        key: "Anomaly",
        values: [],
        color: '#ff0000'
      },
    ];
    for (let i = 0; i < data.length; i++) {
      const element = data[i];
      res[0].values.push([element.date, element.cost]);
      res[1].values.push([element.date, element.abnormal ? element.cost : 0]);
    }
    return res;
  }

  getChartPanel(title, data) {
    return(
      <div className="white-box" key={title}>
        <h4>{title}</h4>
        <NVD3Chart
          id="barChart"
          type="multiBarChart"
          datum={data}
          context={context}
          xAxis={xAxis}
          yAxis={yAxis}
          margin={margin}
          rightAlignYAxis={false}
          clipEdge={false}
          showControls={true}
          showLegend={true}
          stacked={false}
          x={formatX}
          y={formatY}
          height={300}
        />
      </div>
    )
  }

  render() {
    const timerange = (this.props.dates ?  (
      <TimerangeSelector
        startDate={this.props.dates.startDate}
        endDate={this.props.dates.endDate}
        setDatesFunc={this.props.setDates}
      />
    ) : null);

    let charts = [];
    if (this.props.values && this.props.values.status && this.props.values.values) {
      for (var key in this.props.values.values) {
        if (this.props.values.values.hasOwnProperty(key)) {
            charts.push(this.getChartPanel(key, this.formatData(this.props.values.values[key])));
        }
      }
    }

    return (
      <div>
        {timerange}
        <hr />
        {charts}
      </div>
    );
  }

}

EventsContainer.propTypes = {
  dates: PropTypes.object.isRequired,
  values: PropTypes.object.isRequired,
  accounts: PropTypes.arrayOf(PropTypes.object),
  getData: PropTypes.func.isRequired,
  setDates: PropTypes.func.isRequired,
};

/* istanbul ignore next */
const mapStateToProps = ({aws, events}) => ({
  dates: events.dates,
  accounts: aws.accounts.selection,
  values: events.values,
});

/* istanbul ignore next */
const mapDispatchToProps = (dispatch) => ({
  getData: (begin, end) => {
    dispatch(Actions.Events.getData(begin, end));
  },
  setDates: (startDate, endDate) => {
    dispatch(Actions.Events.setDates(startDate, endDate));
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(EventsContainer);

