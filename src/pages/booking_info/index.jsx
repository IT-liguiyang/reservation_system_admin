import React, {Component} from 'react';
import {Switch, Route, Redirect} from 'react-router-dom';

import BookingInfo from './booking_info';

/*
公告路由
 */
export default class BookingInfoIndex extends Component {
  render() {
    return (
      <Switch>
        <Route path='/booking_info' component={BookingInfo} exact/> {/*路径完全匹配*/}
        <Redirect to='/booking_info'/>
      </Switch>
    );
  }
}