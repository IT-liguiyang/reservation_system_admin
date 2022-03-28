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
import LinkButton from '../../components/link-button';
import { reqAnnouncements, reqDeleteAnnouncement, reqSearchAnnouncements } from '../../api';
import {PAGE_SIZE} from '../../utils/constants';

const Option = Select.Option;

/*
Announcement的默认子路由组件
 */
export default class Announcement extends Component {

  state = {
    total: 0, // 公告的总数量
    announcements: [], // 公告的数组
    loading: false, // 是否正在加载中
    keyword: '', // 搜索的关键字
    searchType: 'announcementTheme', // 根据哪个字段搜索
    isShowPublishContent: false, // 是否显示内容详情
    contentDetail:{},  // 内容详情
    detailTitle: '公告内容详情'
  };

  componentDidMount () {
    this.getAnnouncements(1);
  }

  /* 显示公告内容详情 */
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

  /* 删除公告 */
  deleteAnnouncement = (announcement) => {
    console.log(announcement);
    Modal.confirm({
      title: `确认删除${announcement.pub_theme}吗?`,
      onOk: async () => {
        const result = await reqDeleteAnnouncement(announcement._id);
        if(result.status===0) {
          message.success('删除公告成功!');
          this.getAnnouncements(1);
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
        title: '发布人',
        width: 120,
        dataIndex: 'publisher',
      },
      {
        title: '发布时间',
        width: 120,
        dataIndex: 'pub_time',
      },
      {
        title: '公告主题',
        width: 120,
        dataIndex: 'pub_theme',
      },
      {
        title: '发布内容',
        width: 80,
        dataIndex: 'pub_content',
        render: (text, record, index) => {
          return (
            <LinkButton onClick={ ()=>this.ShowPublishContent(text, record, index) }>点击查看</LinkButton>
          );
        }
      },
      {
        title: '操作',
        width: 100,
        render: (announcement) => {
          return (
            <span>
              {/*将 announcement 对象使用state传递给目标路由组件*/}
              <LinkButton onClick={() => this.props.history.push('/announcement/update', announcement)}>修改</LinkButton>
              <LinkButton onClick={() => this.deleteAnnouncement(announcement)}>删除</LinkButton>
            </span>
          );
        }
      },
    ];
  }

  /*
    获取指定页码的列表数据显示
  */
  getAnnouncements = async (pageNum) => {
    this.pageNum = pageNum; // 保存pageNum, 让其它方法可以看到
    this.setState({loading: true}); // 显示loading

    const { keyword, searchType } = this.state;

    console.log(keyword, searchType);
    // 如果搜索关键字有值, 说明我们要做搜索分页
    let result;
    if (keyword) {
      result = await reqSearchAnnouncements({pageNum, pageSize: PAGE_SIZE, keyword, searchType});
    } else { // 一般分页请求
      result = await reqAnnouncements(pageNum, PAGE_SIZE);
    }

    this.setState({loading: false}); // 隐藏loading
    if (result.status === 0) {
      // 取出分页数据, 更新状态, 显示分页列表
      // console.log(result.data);
      const {total, list} = result.data;
      this.setState({
        total,
        announcements: list
      });
    }
  }

  render() {
    this.initColumns();

    // 取出状态数据
    const { 
      isShowPublishContent, 
      detailTitle, 
      contentDetail, 
      announcements, 
      total, 
      loading, 
      searchType, 
      keyword 
    } = this.state;

    const title = (
      <span>
        <Select
          value= {searchType}
          style={{width: 150}}
          onChange={value => this.setState({searchType:value})}
        >
          <Option value='announcementTheme'>按标题搜索</Option>
          <Option value='announcementPublisher'>按发布人搜索</Option>
        </Select>
        <Input
          placeholder='关键字'
          style={{width: 150, margin: '0 15px'}}
          value={keyword}
          onChange={event => this.setState({keyword:event.target.value})}
        />
        <Button type='primary' onClick={() => this.getAnnouncements(1)}>搜索</Button>
      </span>
    );
  
    const extra = (
      <Button type='primary' onClick={() => this.props.history.push('/announcement/add')}>
        添加公告
      </Button>
    );

    return (
      <Card title={title} extra={extra}>
        <Table
          bordered
          rowKey='_id'
          loading={loading}
          dataSource={announcements}
          columns={this.columns}
          pagination={{
            current: this.pageNum,
            total,
            defaultPageSize: 6,
            showQuickJumper: true,
            onChange: this.getAnnouncements
          }}
        />
        <ShowPublishContent 
          detailTitle={detailTitle} 
          contentDetail={contentDetail} 
          handleCloseShowPublishContentModal={this.handleCloseShowPublishContentModal} 
          isShowPublishContent={isShowPublishContent} 
        />
      </Card>
    );
  }
}
