import React, {Component} from 'react';
import {Switch, Route, Redirect} from 'react-router-dom';

import OpinionsSuggestions from './opinions_suggestions';
import OpinionsSuggestionsUpdate from './update';
import OpinionsSuggestionsAdd from './add';

/*
公告路由
 */
export default class OpinionsSuggestionsIndex extends Component {
  render() {
    return (
      <Switch>
        <Route path='/opinions_suggestions' component={OpinionsSuggestions} exact/> {/*路径完全匹配*/}
        <Route path='/opinions_suggestions/add' component={OpinionsSuggestionsAdd}/>
        <Route path='/opinions_suggestions/update' component={OpinionsSuggestionsUpdate}/>
        <Redirect to='/opinions_suggestions'/>
      </Switch>
    );
  }
}