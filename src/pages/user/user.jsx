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

import ShowImageOrContent from '../../utils/show-image-or-content';

import LinkButton from '../../components/link-button';
import { reqUser, reqDeleteUser, reqSearchUser } from '../../api';
import {PAGE_SIZE} from '../../utils/constants';

const Option = Select.Option;

/*
user的默认子路由组件
 */
export default class User extends Component {

  state = {
    total: 0, // 用户的总数量
    user: [], // 用户的数组
    loading: false, // 是否正在加载中
    keyword: '', // 搜索的关键字
    searchType: 'username', // 根据哪个字段搜索
    isShowImageOrContent: false, // 是否显示内容详情
    current_click_item:[] // 当前点击查看的一项
  };

  componentDidMount () {
    this.getUser(1);
  }

  /* 显示内容详情 */
  ShowImageOrContent = (text, record) => {
    console.log(text);
    this.setState({
      current_click_item: text,
      contentDetail: record,
      isShowImageOrContent: true
    });
  }

  /* 用于接收子组件返回的isShowImageOrContent状态 */
  handleCloseShowImageOrContentModal = (isShowImageOrContent) => {
    this.setState({
      isShowImageOrContent
    });
  }

  /* 删除用户 */
  deleteUser = (user) => {
    console.log(user);
    Modal.confirm({
      title: `确认删除用户${user.username}吗?`,
      onOk: async () => {
        const result = await reqDeleteUser(user._id);
        if(result.status===0) {
          message.success('删除用户成功!');
          this.getUser(1);
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
        title: '账号',
        width: 50,
        dataIndex: 'username',
      },
      {
        title: '头像',
        width: 110,
        dataIndex: 'head_portrait',
        render: (text, record, index) => {
          return (
            <LinkButton onClick={ ()=>this.ShowImageOrContent(text, record, index) }>点击查看</LinkButton>
          );
        }
      },
      {
        title: '姓名',
        width: 100,
        dataIndex: 'realname',
      },
      {
        title: '身份证号',
        width: 110,
        dataIndex: 'ID_number',
      },
      {
        title: '住址',
        width: 320,
        dataIndex: 'address',
      },
      {
        title: '职业',
        width: 80,
        dataIndex: 'profession',
      },
      {
        title: '实名认证',
        width: 100,
        dataIndex: 'realname_authentication',
      },
      {
        title: '操作',
        width: 140,
        render: (user) => {
          return (
            <span>
              {/*将 user 对象使用state传递给目标路由组件*/}
              <LinkButton onClick={() => this.props.history.push('/user/update', user)}>修改</LinkButton>
              <LinkButton onClick={() => this.deleteUser(user)}>删除</LinkButton>
            </span>
          );
        }
      },
    ];
  }

  /*
    获取指定页码的列表数据显示
  */
  getUser = async (pageNum) => {
    this.pageNum = pageNum; // 保存pageNum, 让其它方法可以看到
    this.setState({loading: true}); // 显示loading

    const { keyword, searchType } = this.state;

    console.log(keyword, searchType);
    // 如果搜索关键字有值, 说明我们要做搜索分页
    let result;
    if (keyword) {
      result = await reqSearchUser({pageNum, pageSize: PAGE_SIZE, keyword, searchType});
    } else { // 一般分页请求
      result = await reqUser(pageNum, PAGE_SIZE);
    }

    this.setState({loading: false}); // 隐藏loading
    if (result.status === 0) {
      // 取出分页数据, 更新状态, 显示分页列表
      // console.log(result.data);
      const {total, list} = result.data;
      this.setState({
        total,
        user: list
      });
    }
  }

  render() {
    this.initColumns();

    // 取出状态数据
    const { isShowImageOrContent, current_click_item, user, total, loading, searchType, keyword } = this.state;

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
        <Button type='primary' onClick={() => this.getUser(1)}>搜索</Button>
      </span>
    );
  
    const extra = (
      <Button type='primary' onClick={() => this.props.history.push('/user/add')}>
        添加用户
      </Button>
    );

    return (
      <Card title={title} extra={extra}>
        <Table
          bordered
          rowKey='_id'
          loading={loading}
          dataSource={user}
          columns={this.columns}
          pagination={{
            current: this.pageNum,
            total,
            defaultPageSize: 6,
            showQuickJumper: true,
            onChange: this.getUser
          }}
        />
        <ShowImageOrContent 
          current_click_item={current_click_item}
          handleCloseShowImageOrContentModal={this.handleCloseShowImageOrContentModal} 
          isShowImageOrContent={isShowImageOrContent}
        />
      </Card>
    );
  }
}
