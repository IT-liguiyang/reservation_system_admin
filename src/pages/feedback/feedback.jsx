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

import ShowPublishContent from '../../utils/show-publish-content';
import ShowImageOrContent from '../../utils/show-image-or-content';
import LinkButton from '../../components/link-button';
import { reqFeedback, reqDeleteFeedback, reqSearchFeedback, reqFeedbackByAcceptor } from '../../api';
import {PAGE_SIZE} from '../../utils/constants';
import storageUtils from '../../utils/storageUtils';

const Option = Select.Option;

/*
Feedback的默认子路由组件
 */
export default class Feedback extends Component {

  state = {
    adminInfo: {}, // 保存管理员信息，用于判断是学校管理员还是系统管理员
    total: 0, // 意见建议的总数量
    feedback: [], // 意见建议的数组
    loading: false, // 是否正在加载中
    keyword: '', // 搜索的关键字
    searchType: 'feedbackPublisher', // 根据哪个字段搜索
    isShowPublishContent: false, // 是否显示内容详情
    contentDetail:{},  // 内容详情
    detailTitle: '反馈意见内容详情', // 设置内容详情的标题
    isShowImageOrContent: false, // 是否显示内容详情
    current_click_item: [] // 当前点击查看的一项
  };

  componentDidMount () {
    // 使用 promise 可以使得先得到 adminInfo 在进行查询学校信息
    this.getLoginAdminInfo().then(() => {
      this.getFeedback(1);
    }).catch((err) => {
      console.log(err);
    });
  }

  // 保存当前登录管理员信息
  getLoginAdminInfo = () => {
    return new Promise((resolve) => {
      const adminInfo = storageUtils.getAdmin();
      console.log('adminInfo', adminInfo);
      this.setState({
        adminInfo: adminInfo
      });
      resolve(adminInfo);
    });
  }

  /* 显示意见建议内容详情 */
  ShowPublishContent = (text, record) => {
    this.setState({
      contentDetail: record,
      isShowPublishContent: true
    });
  }

  /* 用于接收子组件返回的isShowPublishContent状态 */
  handleCloseShowPublishContentModal = (isShowPublishContent) => {
    this.setState({
      isShowPublishContent
    });
  }

  /* 显示内容详情 */
  ShowImageOrContent = (text) => {
    console.log(text);
    this.setState({
      current_click_item: text,
      isShowImageOrContent: true
    });
  }

  /* 用于接收子组件返回的isShowImageOrContent状态 */
  handleCloseShowImageOrContentModal = (isShowImageOrContent) => {
    this.setState({
      isShowImageOrContent
    });
  }

  /* 删除意见建议 */
  deleteFeedback = (feedback) => {
    console.log(feedback);
    Modal.confirm({
      title: `确认删除${feedback.pub_theme}吗?`,
      onOk: async () => {
        const result = await reqDeleteFeedback(feedback._id);
        if(result.status===0) {
          message.success('删除意见建议成功!');
          this.getFeedback(1);
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
        title: '发布人姓名',
        width: 90,
        dataIndex: 'pub_realname',
      },
      {
        title: '发布人手机号',
        width: 80,
        dataIndex: 'pub_username',
      },
      {
        title: '反馈类型',
        width: 80,
        dataIndex: 'type',
      },
      {
        title: '受理人',
        width: 150,
        dataIndex: 'acceptor',
      },
      {
        title: '发布时间',
        width: 150,
        dataIndex: 'pub_time',
      },
      {
        title: '发布内容',
        width: 100,
        dataIndex: 'pub_content',
        render: (text, record, index) => {
          return (
            <LinkButton onClick={ ()=>this.ShowPublishContent(text, record, index) }>点击查看</LinkButton>
          );
        }
      },
      {
        title: '反馈图片',
        width: 100,
        dataIndex: 'image_list',
        render: (text, record, index) => {
          return (
            <LinkButton onClick={ ()=>this.ShowImageOrContent(text, record, index) }>点击查看</LinkButton>
          );
        }
      },
      {
        title: '操作',
        width: 100,
        render: (feedback) => {
          return (
            <span>
              {/*将 feedback 对象使用state传递给目标路由组件*/}
              <LinkButton onClick={() => this.props.history.push('/feedback/update', feedback)}>修改</LinkButton>
              <LinkButton onClick={() => this.deleteFeedback(feedback)}>删除</LinkButton>
            </span>
          );
        }
      },
    ];
  }

  /*
    获取指定页码的列表数据显示
  */
  getFeedback = async (pageNum) => {
    this.pageNum = pageNum; // 保存pageNum, 让其它方法可以看到
    this.setState({loading: true}); // 显示loading

    const { keyword, searchType } = this.state;

    console.log(keyword, searchType);
    // 如果搜索关键字有值, 说明我们要做搜索分页
    let result;
    if (keyword) {
      result = await reqSearchFeedback({pageNum, pageSize: PAGE_SIZE, keyword, searchType});
    } else { // 一般分页请求
      if(this.state.adminInfo.role_id === '2'){
        // 如果为学校管理员，则只显示所在学校的公告
        const acceptor = this.state.adminInfo.school[1];
        result = await reqFeedbackByAcceptor(acceptor, pageNum, PAGE_SIZE);
      } else {
        result = await reqFeedback(pageNum, PAGE_SIZE);
      }
    }

    this.setState({loading: false}); // 隐藏loading
    if (result.status === 0) {
      // 取出分页数据, 更新状态, 显示分页列表
      // console.log(result.data);
      const {total, list} = result.data;
      this.setState({
        total,
        feedback: list
      });
    }
  }

  render() {
    this.initColumns();

    // 取出状态数据
    const { 
      isShowPublishContent, 
      contentDetail, 
      detailTitle,
      feedback,
      total, 
      loading, 
      searchType,
      keyword,
      isShowImageOrContent, 
      current_click_item
    } = this.state;

    const title = (
      <span>
        {
          // 若为学校管理员则只有按发布人搜索
          this.state.adminInfo.role_id === '2'? (
            <Select
              value= {searchType}
              style={{width: 150}}
              onChange={value => this.setState({searchType:value})}
            >
              <Option value='feedbackPublisher'>按发布人搜索</Option>
            </Select>):(
            <Select
              value= {searchType}
              style={{width: 150}}
              onChange={value => this.setState({searchType:value})}
            >
              <Option value='feedbackPublisher'>按发布人搜索</Option>
              <Option value='feedbackAcceptor'>按受理人搜索</Option>
            </Select>
          )
        }
        <Input
          placeholder='关键字'
          style={{width: 150, margin: '0 15px'}}
          value={keyword}
          onChange={event => this.setState({keyword:event.target.value})}
        />
        <Button type='primary' onClick={() => this.getFeedback(1)}>搜索</Button>
      </span>
    );
  
    const extra = (
      <Button type='primary' onClick={() => this.props.history.push('/feedback/add')}>
        添加意见反馈
      </Button>
    );

    return (
      <Card title={title} extra={extra}>
        <Table
          bordered
          rowKey='_id'
          loading={loading}
          dataSource={feedback}
          columns={this.columns}
          pagination={{
            current: this.pageNum,
            total,
            defaultPageSize: 6,
            showQuickJumper: true,
            onChange: this.getFeedback
          }}
        />
        <ShowPublishContent detailTitle={detailTitle} contentDetail={contentDetail} handleCloseShowPublishContentModal={this.handleCloseShowPublishContentModal} isShowPublishContent={isShowPublishContent} />
        <ShowImageOrContent current_click_item={current_click_item} handleCloseShowImageOrContentModal={this.handleCloseShowImageOrContentModal} isShowImageOrContent={isShowImageOrContent} />
      </Card>
    );
  }
}
