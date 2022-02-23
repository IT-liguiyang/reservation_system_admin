import React, {Component} from 'react';
import {Switch, Route, Redirect} from 'react-router-dom';

import User from './user';
import UserUpdate from './update';
import UserAdd from './add';

/*
用户路由
 */
export default class UserIndex extends Component {
  render() {
    return (
      <Switch>
        <Route path='/user' component={User} exact/> {/*路径完全匹配*/}
        <Route path='/user/add' component={UserAdd}/>
        <Route path='/user/update' component={UserUpdate}/>
        <Redirect to='/user'/>
      </Switch>
    );
  }
}