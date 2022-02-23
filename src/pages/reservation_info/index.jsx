import React, {Component} from 'react';
import {Switch, Route, Redirect} from 'react-router-dom';

import ReservationInfo from './reservation_info';
import ReservationInfoUpdate from './update';
import ReservationInfoAdd from './add';

/*
学校路由
 */
export default class ReservationInfoIndex extends Component {
  render() {
    return (
      <Switch>
        <Route path='/reservation_info' component={ReservationInfo} exact/> {/*路径完全匹配*/}
        <Route path='/reservation_info/add' component={ReservationInfoAdd}/>
        <Route path='/reservation_info/update' component={ReservationInfoUpdate}/>
        <Redirect to='/reservation_info'/>
      </Switch>
    );
  }
}