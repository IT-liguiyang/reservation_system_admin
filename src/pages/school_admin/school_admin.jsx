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
import { reqSchoolAdmin, reqDeleteSchoolAdmin, reqSearchSchoolAdmin } from '../../api';
import {PAGE_SIZE} from '../../utils/constants';

const Option = Select.Option;

/*
school_admin的默认子路由组件
 */
export default class school_admin extends Component {

  state = {
    total: 0, // 学校管理员的总数量
    school_admin: [], // 学校管理员的数组
    loading: false, // 是否正在加载中
    keyword: '', // 搜索的关键字
    searchType: 'school_name', // 根据哪个字段搜索
    isShowContent: false, // 是否显示内容详情
    contentDetail:{},  // 内容详情
  };

  componentDidMount () {
    this.getSchoolAdmin(1);
  }

  /* 显示学校管理员内容详情 */
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

  /* 删除学校管理员 */
  deleteSchoolAdmin = (school_admin) => {
    console.log(school_admin);
    Modal.confirm({
      title: '确认删除此条学校管理员吗吗?',
      onOk: async () => {
        const result = await reqDeleteSchoolAdmin(school_admin._id);
        if(result.status===0) {
          message.success('删除学校管理员成功!');
          this.getSchoolAdmin(1);
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
        width: 100,
        dataIndex: 'username',
      },
      {
        title: '密码',
        width: 70,
        dataIndex: 'password',
      },
      {
        title: '姓名',
        width: 100,
        dataIndex: 'realname',
      },
      {
        title: '学校名称',
        width: 150,
        dataIndex: 'school',
        render: school =>  school[1]
      },
      {
        title: '身份证号',
        width: 100,
        dataIndex: 'ID_number',
      },
      {
        title: '操作',
        width: 100,
        render: (school_admin) => {
          return (
            <span>
              {/*将 school_admin 对象使用state传递给目标路由组件*/}
              <LinkButton onClick={() => this.props.history.push('/admin/school_admin/update', school_admin)}>修改</LinkButton>
              <LinkButton onClick={() => this.deleteSchoolAdmin(school_admin)}>删除</LinkButton>
            </span>
          );
        }
      },
    ];
  }

  /*
    获取指定页码的列表数据显示
  */
  getSchoolAdmin = async (pageNum) => {
    this.pageNum = pageNum; // 保存pageNum, 让其它方法可以看到
    this.setState({loading: true}); // 显示loading

    const { keyword, searchType } = this.state;

    console.log(keyword, searchType);
    // 如果搜索关键字有值, 说明我们要做搜索分页
    let result;
    if (keyword) {
      result = await reqSearchSchoolAdmin({pageNum, pageSize: PAGE_SIZE, keyword, searchType});
    } else { // 一般分页请求
      result = await reqSchoolAdmin(pageNum, PAGE_SIZE);
    }

    this.setState({loading: false}); // 隐藏loading
    if (result.status === 0) {
      // 取出分页数据, 更新状态, 显示分页列表
      // console.log(result.data);
      const {total, list} = result.data;
      this.setState({
        total,
        school_admin: list
      });
    }
  }

  render() {
    this.initColumns();

    // 取出状态数据
    const { isShowContent, contentDetail, school_admin, total, loading, searchType, keyword } = this.state;

    const title = (
      <span>
        <Select
          value= {searchType}
          style={{width: 150}}
          onChange={value => this.setState({searchType:value})}
        >
          <Option value='school_name'>按学校搜索</Option>
          <Option value='realname'>按姓名搜索</Option>
        </Select>
        <Input
          placeholder='关键字'
          style={{width: 150, margin: '0 15px'}}
          value={keyword}
          onChange={event => this.setState({keyword:event.target.value})}
        />
        <Button type='primary' onClick={() => this.getSchoolAdmin(1)}>搜索</Button>
      </span>
    );
  
    const extra = (
      <Button type='primary' onClick={() => this.props.history.push('/admin/school_admin/add')}>
        添加学校管理员
      </Button>
    );

    return (
      <Card title={title} extra={extra}>
        <Table
          bordered
          rowKey='_id'
          loading={loading}
          dataSource={school_admin}
          columns={this.columns}
          pagination={{
            current: this.pageNum,
            total,
            defaultPageSize: 6,
            showQuickJumper: true,
            onChange: this.getSchoolAdmin
          }}
        />
        <ShowContent contentDetail={contentDetail} handleCloseShowContentModal={this.handleCloseShowContentModal} isShowContent={isShowContent} />
      </Card>
    );
  }
}
