import React, {Component} from 'react';
import {Switch, Route, Redirect} from 'react-router-dom';

import SystemAdminRole from './system_admin';
import SystemAdminRoleUpdate from './update';

/*
用户路由
 */
export default class SystemAdminRoleIndex extends Component {
  render() {
    return (
      <Switch>
        <Route path='/role/system_admin' component={SystemAdminRole} exact/> {/*路径完全匹配*/}
        <Route path='/role/system_admin/update' component={SystemAdminRoleUpdate}/>
        <Redirect to='/role/system_admin'/>
      </Switch>
    );
  }
}