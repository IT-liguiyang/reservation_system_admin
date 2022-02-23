import React, {Component} from 'react';
import {Switch, Route, Redirect} from 'react-router-dom';

import SchoolAdminRole from './school_admin';
import SchoolAdminRoleUpdate from './update';

/*
用户路由
 */
export default class SchoolAdminRoleIndex extends Component {
  render() {
    return (
      <Switch>
        <Route path='/role/school_admin' component={SchoolAdminRole} exact/> {/*路径完全匹配*/}
        <Route path='/role/school_admin/update' component={SchoolAdminRoleUpdate}/>
        <Redirect to='/role/school_admin'/>
      </Switch>
    );
  }
}