/* eslint-disable react/prop-types */
import React, { Component } from 'react';
import {
  Card,
  Select,
  Input,
  Button,
  Table,
  Modal,
  message
} from 'antd';

import ShowContent from './show-content';
import LinkButton from '../../components/link-button';
import { reqSystemAdmin, reqDeleteSystemAdmin, reqSearchSystemAdmin } from '../../api';
import {PAGE_SIZE} from '../../utils/constants';

const Option = Select.Option;

/*
system_admin的默认子路由组件
 */
export default class system_admin extends Component {

  state = {
    total: 0, // 系统管理员的总数量
    system_admin: [], // 系统管理员的数组
    loading: false, // 是否正在加载中
    keyword: '', // 搜索的关键字
    searchType: 'username', // 根据哪个字段搜索
    isShowContent: false, // 是否显示内容详情
    contentDetail:{},  // 内容详情
  };

  componentDidMount () {
    this.getSystemAdmin(1);
  }

  /* 显示系统管理员内容详情 */
  showContent = (text, record) => {
    this.setState({
      contentDetail: record,
      isShowContent: true
    });
  }

  /* 用于接收子组件返回的isShowContent状态 */
  handleCloseShowContentModal = (isShowContent) => {
    this.setState({
      isShowContent
    });
  }

  /* 删除系统管理员 */
  deleteSystemAdmin = (system_admin) => {
    console.log(system_admin);
    Modal.confirm({
      title: '确认删除此条系统管理员信息吗?',
      onOk: async () => {
        const result = await reqDeleteSystemAdmin(system_admin._id);
        if(result.status===0) {
          message.success('删除系统管理员信息成功!');
          this.getSystemAdmin(1);
        }
      }
    });
  }

  /*
  初始化table的列的数组
    */
  initColumns = () => {
    this.columns = [
      {
        title: '姓名',
        width: 150,
        dataIndex: 'realname',
      },
      {
        title: '账号',
        width: 150,
        dataIndex: 'username',
      },
      {
        title: '密码',
        width: 150,
        dataIndex: 'password',
      },
      {
        title: '操作',
        width: 150,
        render: (system_admin) => {
          return (
            <span>
              {/*将 system_admin 对象使用state传递给目标路由组件*/}
              <LinkButton onClick={() => this.props.history.push('/admin/system_admin/update', system_admin)}>修改</LinkButton>
              <LinkButton onClick={() => this.deleteSystemAdmin(system_admin)}>删除</LinkButton>
            </span>
          );
        }
      },
    ];
  }

  /*
    获取指定页码的列表数据显示
  */
  getSystemAdmin = async (pageNum) => {
    this.pageNum = pageNum; // 保存pageNum, 让其它方法可以看到
    this.setState({loading: true}); // 显示loading

    const { keyword, searchType } = this.state;

    console.log(keyword, searchType);
    // 如果搜索关键字有值, 说明我们要做搜索分页
    let result;
    if (keyword) {
      result = await reqSearchSystemAdmin({pageNum, pageSize: PAGE_SIZE, keyword, searchType});
    } else { // 一般分页请求
      result = await reqSystemAdmin(pageNum, PAGE_SIZE);
    }

    this.setState({loading: false}); // 隐藏loading
    if (result.status === 0) {
      // 取出分页数据, 更新状态, 显示分页列表
      // console.log(result.data);
      const {total, list} = result.data;
      this.setState({
        total,
        system_admin: list
      });
    }
  }

  render() {
    this.initColumns();

    // 取出状态数据
    const { isShowContent, contentDetail, system_admin, total, loading, searchType, keyword } = this.state;

    const title = (
      <span>
        <Select
          value= {searchType}
          style={{width: 150}}
          onChange={value => this.setState({searchType:value})}
        >
          <Option value='username'>按账号搜索</Option>
          <Option value='realname'>按姓名搜索</Option>
        </Select>
        <Input
          placeholder='关键字'
          style={{width: 150, margin: '0 15px'}}
          value={keyword}
          onChange={event => this.setState({keyword:event.target.value})}
        />
        <Button type='primary' onClick={() => this.getSystemAdmin(1)}>搜索</Button>
      </span>
    );
  
    const extra = (
      <Button type='primary' onClick={() => this.props.history.push('/admin/system_admin/add')}>
        添加系统管理员
      </Button>
    );

    return (
      <Card title={title} extra={extra}>
        <Table
          bordered
          rowKey='_id'
          loading={loading}
          dataSource={system_admin}
          columns={this.columns}
          pagination={{
            current: this.pageNum,
            total,
            defaultPageSize: 6,
            showQuickJumper: true,
            onChange: this.getSystemAdmin
          }}
        />
        <ShowContent contentDetail={contentDetail} handleCloseShowContentModal={this.handleCloseShowContentModal} isShowContent={isShowContent} />
      </Card>
    );
  }
}
