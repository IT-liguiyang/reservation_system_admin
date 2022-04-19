/* eslint-disable react/prop-types */
import React, {Component} from 'react';
import {Link, withRouter} from 'react-router-dom';
import {Menu} from 'antd';

import menuList from '../../configs/menuConfig';
import li_logo from '../../assets/images/li.png';
import storageUtils from '../../utils/storageUtils';
import memoryUtils from '../../utils/memoryUtils';
import './index.less';

const SubMenu = Menu.SubMenu;

/*
左侧导航的组件
 */
class LeftNav extends Component {

  /*
  判断当前登陆用户对item是否有权限
   */
  hasAuth = (item) => {
    const {key, isPublic} = item;

    const auth_menus = memoryUtils.admin.auth_menus || [];
    /*
    1. 如果当前用户是admin
    2. 如果当前item是公开的
    3. 当前用户有此item的权限: key有没有menus中
     */
    if(isPublic || auth_menus.indexOf(key)!==-1) {
      return true;
    } else if(item.children){ // 4. 如果当前用户有此item的某个子item的权限
      return !!item.children.find(child =>  auth_menus.indexOf(child.key)!==-1);
    }

    return false;
  }

  /*
  根据menu的数据数组生成对应的标签数组
  使用map() + 递归调用
  */
  // getMenuNodes = (menuList) => {

  //   return menuList.map(item => {
  //     if(!item.children) {
  //       return (
  //         <Menu.Item key={item.key}>
  //           <Link to={item.key}>
  //             {item.icon}
  //             <span>{item.title}</span>
  //           </Link>
  //         </Menu.Item>
  //       );
  //     } else {
  //       return (
  //         <SubMenu
  //           key={item.key}
  //           title={
  //             <span>
  //               {item.icon}
  //               <span>{item.title}</span>
  //             </span>
  //           }
  //         >
  //           {this.getMenuNodes(item.children)}
  //         </SubMenu>
  //       );
  //     }

  //   });
  // }

  /*
  根据menu的数据数组生成对应的标签数组
  使用reduce() + 递归调用
  */
  getMenuNodes = (menuList) => {
    // 得到当前请求的路由路径
    const path = this.props.location.pathname;

    return menuList.reduce((pre, item) => {

      // 如果当前用户有当前item菜单项对应的权限, 才需要显示对应的菜单项
      if (this.hasAuth(item)) {
      // 向pre添加<Menu.Item>
        if(!item.children) {
          pre.push((
            <Menu.Item key={item.key}>
              <Link to={item.key}>
                {item.icon}
                <span>{item.title}</span>
              </Link>
            </Menu.Item>
          ));
        } else {

          // 查找一个与当前请求路径匹配的子Item
          const cItem = item.children.find(cItem => path.indexOf(cItem.key)===0);
          // 如果存在, 说明当前item的子列表需要打开
          if (cItem) {
            this.openKey = item.key;
          }

          // 向pre添加<SubMenu>
          pre.push((
            <SubMenu
              key={item.key}
              title={
                <span>
                  {item.icon}
                  <span>{item.title}</span>
                </span>
              }
            >
              {this.getMenuNodes(item.children)}
            </SubMenu>
          ));
        }
      }

      return pre;
    }, []);
  }
  
  render() {

    // 得到当前请求的路由路径
    let currentPath = this.props.location.pathname;
    if(currentPath.indexOf('/school')===0) {  // 当前请求的是学校或其子路由界面
      currentPath = '/school';
    }
    if(currentPath.indexOf('/announcement')===0) { 
      currentPath = '/announcement';
    }
    if(currentPath.indexOf('/news')===0) { 
      currentPath = '/news';
    }
    if(currentPath.indexOf('/dynamic_sharing')===0) { 
      currentPath = '/dynamic_sharing';
    }
    if(currentPath.indexOf('/feedback')===0) { 
      currentPath = '/feedback';
    }
    if(currentPath.indexOf('/common_problems')===0) { 
      currentPath = '/common_problems';
    }
    if(currentPath.indexOf('/reservation_info')===0) { 
      currentPath = '/reservation_info';
    }
    if(currentPath.indexOf('/user')===0) { 
      currentPath = '/user';
    }
    if(currentPath.indexOf('/message')===0) { 
      currentPath = '/message';
    }
    if(currentPath.indexOf('/admin/school_admin')===0) { 
      currentPath = '/admin/school_admin';
    }
    if(currentPath.indexOf('/admin/system_admin')===0) { 
      currentPath = '/admin/system_admin';
    }
    if(currentPath.indexOf('/role/system_admin')===0) { 
      currentPath = '/role/system_admin';
    }
    if(currentPath.indexOf('/role/school_admin')===0) { 
      currentPath = '/role/school_admin';
    }
    if(currentPath.indexOf('/booking_info')===0) { 
      currentPath = '/booking_info';
    }

    // 准备数据(必须同步的)
    this.menuNodes = this.getMenuNodes(menuList);
    // 得到需要打开菜单项的key
    const openKey = this.openKey;

    const { realname } = storageUtils.getAdmin();

    return (
      <div className="left-nav">
        <Link to='/' className="left-nav-header">
          <img src={li_logo} alt="li_logo"/>
          <h1>Hi, {realname||'Admin'}</h1>
        </Link>

        <Menu
          mode="inline"
          theme="dark"
          selectedKeys={[currentPath]} // 设置默认选中
          defaultOpenKeys={[openKey]}
        >
          {
            this.menuNodes
          }

        </Menu>
      </div>
    );
  }
}

/*
withRouter高阶组件:
包装非路由组件, 返回一个新的组件
新的组件向非路由组件传递3个属性: history/location/match
 */
export default withRouter(LeftNav);