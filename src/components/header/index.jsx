/* eslint-disable react/prop-types */
import React, {Component} from 'react';
import {withRouter} from 'react-router-dom';
import moment from 'moment';
import { Modal } from 'antd';

import LinkButton from '../link-button';
import PersonalCenter from '../personal-center';
import ChangePassword from '../change-password';
import menuList from '../../configs/menuConfig';
import memoryUtils from '../../utils/memoryUtils';
import storageUtils from '../../utils/storageUtils';
import { reqLoginAdmin } from '../../api/index';
import './index.less';

/*
左侧导航的组件
 */
class Header extends Component {

  state = {
    currentTime: moment().format('YYYY-MM-DD hh:mm:ss'), // 当前时间字符串
    isShowPersonalCenter:false,  // 是否显示个人中心
    isShowChangePassword:false,  // 是否显示修改密码
    LoginAdminInfo:[]  // 保存当前登录的用户信息
  }

  getTime = () => {
    // 每隔1s获取当前时间, 并更新状态数据currentTime
    this.intervalId = setInterval(() => {
      const currentTime = moment().format('YYYY-MM-DD HH:mm:ss');     // 2021 escaped 2021
      this.setState({currentTime});
    }, 1000);
  }

  /* 个人中心 */
  personal_center = () => {
    this.setState({
      isShowPersonalCenter:true
    });

    this.getLoginAdmin();
  }

  /* 修改密码 */
  change_password = () => {
    this.setState({
      isShowChangePassword: true
    });
  }

  /* 获取当前登录的管理员信息 */
  getLoginAdmin = async () => {
    const admin = storageUtils.getAdmin();
    
    console.log('777', admin.role_id);
    // console.log(admin.username);
    const result = await reqLoginAdmin(admin.username, admin.role_id);
    console.log(result);
    if (result.status===0) {
      this.setState({
        LoginAdminInfo:result.data
      });
    }
  }

  /* 获取路径 */
  getTitle = () => {
    // 得到当前请求路径
    const path = this.props.location.pathname;
    let title;
    menuList.forEach(item => {
      if (item.key===path) { // 如果当前item对象的key与path一样,item的title就是需要显示的title
        title = item.title;
      } else if (item.children) {
        // 在所有子item中查找匹配的
        const cItem = item.children.find(cItem => path.indexOf(cItem.key)===0);
        // 如果有值才说明有匹配的
        if(cItem) {
          // 取出它的title
          title = cItem.title;
        }
      }
    });
    return title;
  }

  /* 用于接收子组件返回的isShowPersonalCenter状态 */
  handleClosePersonalCenterModal = (isShowPersonalCenter) => {
    this.setState({
      isShowPersonalCenter
    });
  }

  handleCloseChangePasswordModal = (isShowChangePassword) => {
    this.setState({
      isShowChangePassword
    });
  }

  /* 退出登陆 */
  logout = () => {
    // 显示确认框
    Modal.confirm({
      okText: '确定',
      cancelText: '取消',
      content: '确定退出吗?',
      onOk: () => {
        // console.log('OK', this);
        // 删除保存的admin数据
        storageUtils.removeAdmin();
        memoryUtils.admin = {};

        // 跳转到login
        this.props.history.replace('/login');
      }
    });
  }

  logoutAfterChangePassord = () => {
    this.props.history.replace('/login');
  }

  /*
  第一次render()之后执行一次
  一般在此执行异步操作: 发ajax请求/启动定时器
   */
  componentDidMount () {
    // 获取当前的时间
    this.getTime();
  }

  /*
  当前组件卸载之前调用
   */
  componentWillUnmount () {
    // 清除定时器
    clearInterval(this.intervalId);
  }

  render() {

    const { currentTime, isShowPersonalCenter, isShowChangePassword, LoginAdminInfo } = this.state;

    // 得到当前需要显示的title
    const title = this.getTitle();
    
    return (
      <div className="header">
        <div className="header-top">
          <h2>欢迎访问贵阳市中小学体育场馆预约系统-后台</h2>
          {/* <span>欢迎, admin</span> */}
          <LinkButton onClick={this.personal_center}>个人中心</LinkButton>
          <LinkButton onClick={this.change_password}>修改密码</LinkButton>
          <LinkButton onClick={this.logout}>退出</LinkButton>
        </div>
        <div className="header-bottom">
          <div className="header-bottom-left" style={{fontSize:16+'px'}}>{title}</div>
          <div className="header-bottom-right">
            <span>{currentTime}</span>
          </div>
        </div>
        <PersonalCenter handleClosePersonalCenterModal={this.handleClosePersonalCenterModal} LoginAdminInfo={LoginAdminInfo} isShowPersonalCenter={isShowPersonalCenter} />
        <ChangePassword handleCloseChangePasswordModal={this.handleCloseChangePasswordModal} logoutAfterChangePassord={this.logoutAfterChangePassord} isShowChangePassword={isShowChangePassword} />
      </div>
    );
  }
}

export default withRouter(Header);