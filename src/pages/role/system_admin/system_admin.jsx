/* eslint-disable react/prop-types */
import React, {Component} from 'react';
import {
  Card,
  Button,
  Table,
  Modal,
  message
} from 'antd';

import moment from 'moment';
import {PAGE_SIZE} from '../../../utils/constants';
import {reqSystemAdminRoles, reqUpdateSystemAdminRole} from '../../../api';
// import AddForm from './add-form';
import SystemAdminRoleUpdate from './update';
import memoryUtils from '../../../utils/memoryUtils';
import storageUtils from '../../../utils/storageUtils';

/*
角色路由
 */
export default class SystemAdminRole extends Component {

  state = {
    roles: [], // 所有角色的列表
    role: {}, // 选中的role
    // isShowAdd: false, // 是否显示添加界面
    isShowAuth: false, // 是否显示设置权限界面
  }

  constructor (props) {
    super(props);

    this.auth = React.createRef();
  }

  initColumn = () => {
    this.columns = [
      {
        title: '类型',
        render: () => {return '系统管理员';} 
      },
      {
        title: '账号',
        dataIndex: 'username'
      },
      {
        title: '姓名',
        dataIndex: 'realname'
      },
      {
        title: '授权时间',
        dataIndex: 'auth_time',
      },
      {
        title: '授权人',
        dataIndex: 'auth_person'
      },
    ];
  }

  getSystemAdminRoles = async () => {
    const result = await reqSystemAdminRoles();
    if (result.status===0) {
      const roles = result.data;
      this.setState({
        roles
      });
    }
  }

  onRow = (role) => {
    return {
      onClick: event => { // 点击行
        console.log('row onClick()', role, event);
        // alert('点击行')
        this.setState({
          role
        });
      },
    };
  }

  /*
  更新角色
   */
  updateSystemAdminRole = async () => {

    // 1. 得到当前时间
    const auth_time = moment().format('YYYY-MM-DD HH:mm:ss'); 

    // 隐藏确认框
    this.setState({
      isShowAuth: false
    });

    const role = this.state.role;
    // 得到最新的auth_menus
    const auth_menus = this.auth.current.getMenus();
    role.auth_menus = auth_menus;
    role.auth_time = auth_time;
    role.auth_person = memoryUtils.admin.realname;

    // 请求更新
    const result = await reqUpdateSystemAdminRole(role);
    if (result.status===0) {
      // this.getSystemAdminRoles()
      // 如果当前更新的是自己角色的权限, 强制退出
      if (role._id === memoryUtils.admin.role_id) {
        memoryUtils.admin = {};
        storageUtils.removeAdmin();
        this.props.history.replace('/login');
        message.success('当前用户角色权限成功');
      } else {
        message.success('设置角色权限成功');
        this.setState({
          roles: [...this.state.roles]
        });
      }

    }
  }

  componentDidMount () {
    this.getSystemAdminRoles();
  }

  render() {

    this.initColumn();

    const {roles, role, isShowAuth} = this.state;

    const title = (
      <span>
        {/* <Button type='primary' onClick={() => this.setState({isShowAdd: true})}>创建角色</Button> &nbsp;&nbsp; */}
        <Button type='primary' disabled={!role._id} onClick={() => this.setState({isShowAuth: true})}>设置角色权限</Button>
      </span>
    );

    return (
      <Card title={title}>
        <Table
          bordered
          rowKey='_id'
          dataSource={roles}
          columns={this.columns}
          pagination={{defaultPageSize: PAGE_SIZE}}
          rowSelection={{
            type: 'radio',
            selectedRowKeys: [role._id],
            onSelect: (role) => { // 选择某个radio时回调
              this.setState({
                role
              });
            }

          }}
          onRow={this.onRow}
        />

        <Modal
          title="设置角色权限"
          visible={isShowAuth}
          onOk={this.updateSystemAdminRole}
          onCancel={() => {
            this.props.history.push('/role/system_admin');
            this.setState({isShowAuth: false});
          }}
        >
          <SystemAdminRoleUpdate ref={this.auth} role={role}/>
        </Modal>
      </Card>
    );
  }
}