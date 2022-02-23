import React, {Component} from 'react';
import {Redirect, Route, Switch} from 'react-router-dom';
import { Layout } from 'antd';

import memoryUtils from '../../utils/memoryUtils';
import LeftNav from '../../components/left-nav';
import Header from '../../components/header';
import Welcome from '../welcome';
import School from '../school';
import Announcement from '../announcement';
import News from '../news';
import DynamicSharing from '../dynamic_sharing';
import OpinionsSuggestions from '../opinions_suggestions';
import ReservationInfo from '../reservation_info';
import SchoolAdmin from '../school_admin';
import SystemAdmin from '../system_admin';
import User from '../user';
import SchoolAdminRole from '../role/school_admin';
import SystemAdminRole from '../role/system_admin';

const { Footer, Sider, Content } = Layout;

/*
后台管理的路由组件
 */
export default class Home extends Component {
  render () {

    const admin = memoryUtils.admin;
    // 如果内存没有存储user ==> 当前没有登陆
    if(!admin || !admin._id) {
      // 自动跳转到登陆(在render()中)
      return <Redirect to='/login'/>;
    }

    return (
      <Layout style={{minHeight: '100%'}}>
        <Sider>
          <LeftNav/>
        </Sider>
        <Layout>
          <Header>Header</Header>
          <Content style={{margin: 15, backgroundColor: '#fff'}}>
            <Switch>
              <Redirect from='/' exact to='/home'/>
              <Route path='/home' component={Welcome}/>
              <Route path='/school' component={School}/>
              <Route path='/announcement' component={Announcement}/>
              <Route path='/news' component={News}/>
              <Route path='/dynamic_sharing' component={DynamicSharing}/>
              <Route path='/opinions_suggestions' component={OpinionsSuggestions}/>
              <Route path='/reservation_info' component={ReservationInfo}/>
              <Route path='/admin/school_admin' component={SchoolAdmin}/>
              <Route path='/admin/system_admin' component={SystemAdmin}/>
              <Route path='/user' component={User}/>
              <Route path='/role/school_admin' component={SchoolAdminRole}/>
              <Route path='/role/system_admin' component={SystemAdminRole}/>
              {/* <Route component={NotFound}/> */}
            </Switch>
          </Content>
          <Footer style={{textAlign: 'center', color: '#808080',paddingTop:0,paddingBottom:15}}>Copyright © 2021 - 2022 IT-GUIYANG. All Rights Reserved. 木子牛八 版权所有</Footer>
        </Layout>
      </Layout>
    );
  }
}