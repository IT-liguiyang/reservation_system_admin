import React, {Component} from 'react';
import {Switch, Route, Redirect} from 'react-router-dom';

import SystemAdmin from './system_admin';
import SystemAdminUpdate from './update';
import SystemAdminAdd from './add';

/*
学校路由
 */
export default class SystemAdminIndex extends Component {
  render() {
    return (
      <Switch>
        <Route path='/admin/system_admin' component={SystemAdmin} exact/> {/*路径完全匹配*/}
        <Route path='/admin/system_admin/add' component={SystemAdminAdd}/>
        <Route path='/admin/system_admin/update' component={SystemAdminUpdate}/>
        <Redirect to='/admin/system_admin'/>
      </Switch>
    );
  }
}