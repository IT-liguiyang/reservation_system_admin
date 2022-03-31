import React, {Component} from 'react';
import {Switch, Route, Redirect} from 'react-router-dom';

import CommonProblems from './common_problems';
import CommonProblemsUpdate from './update';
import CommonProblemsAdd from './add';

/*
常见问题路由
 */
export default class CommonProblemsIndex extends Component {
  render() {
    return (
      <Switch>
        <Route path='/common_problems' component={CommonProblems} exact/> {/*路径完全匹配*/}
        <Route path='/common_problems/add' component={CommonProblemsAdd}/>
        <Route path='/common_problems/update' component={CommonProblemsUpdate}/>
        <Redirect to='/common_problems'/>
      </Switch>
    );
  }
}