import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { readFile, Series, DataFrame } from 'data-forge';
import moment from 'moment';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

export default class NegativeRatings extends Component {
  constructor(props) {
    super(props);
    this.state = {
     startDate: moment(),
     numberOfOne: 1,
   };
 }

  handleDateChange = (date) => {
    this.setState({
      startDate: date,
    });
  }

  handleNumberChange = (event) => {
    this.setState({
      numberOfOne: event.target.value,
    })
  }

  checkDate = (checkInDate) => {
    if (checkInDate.isSameOrAfter(this.state.startDate, 'day')) {
      return true;
    }
  }

  render() {
    const filteredTable = this.props.df
      .where(row => row.rating == 1 && this.checkDate(row.check_in_date));

    const countRating = filteredTable
      .groupBy(row => row.email)
      .select(group => ({
        email: group.first().email,
        number_of_one_stars: group.deflate(row => row.rating).count()
      }))
      .inflate()
      .where(row => row.number_of_one_stars >= this.state.numberOfOne);

    return (
      <div>
        <DatePicker
          selected={this.state.startDate}
          onChange={this.handleDateChange}
        />
        <input type='number' value={this.state.numberOfOne} onChange={this.handleNumberChange} />
        <div dangerouslySetInnerHTML={{ __html: countRating.toHTML() }} />
      </div>
    );
  }
}
