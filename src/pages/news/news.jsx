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
import { reqNews, reqDeleteNews, reqSearchNews, reqNewsByPublisher } from '../../api';
import {PAGE_SIZE} from '../../utils/constants';
import storageUtils from '../../utils/storageUtils';

const Option = Select.Option;

/*
News的默认子路由组件
 */
export default class News extends Component {

  state = {
    adminInfo: {}, // 保存管理员信息，用于判断是学校管理员还是系统管理员
    total: 0, // 公告的总数量
    news: [], // 公告的数组
    loading: false, // 是否正在加载中
    keyword: '', // 搜索的关键字
    searchType: 'newsTheme', // 根据哪个字段搜索
    isShowPublishContent: false, // 是否显示内容详情
    contentDetail:{},  // 内容详情
    detailTitle: '新闻内容详情', // 设置内容详情的标题
  };

  componentDidMount () {
    // 使用 promise 可以使得先得到 adminInfo 在进行查询学校信息
    this.getLoginAdminInfo().then(() => {
      this.getNews(1);
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
  deleteNews = (news) => {
    console.log(news);
    Modal.confirm({
      title: `确认删除${news.pub_theme}吗?`,
      onOk: async () => {
        const result = await reqDeleteNews(news._id);
        if(result.status===0) {
          message.success('删除公告成功!');
          this.getNews(1);
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
        width: 100,
        dataIndex: 'real_pub_time',
      },
      {
        title: '新闻主题',
        width: 100,
        dataIndex: 'pub_theme',
      },
      {
        title: '新闻来源',
        width: 100,
        dataIndex: 'origin',
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
        title: '操作时间',
        width: 100,
        dataIndex: 'system_pub_time',
      },
      {
        title: '操作',
        width: 100,
        render: (news) => {
          return (
            <span>
              {/*将 news 对象使用state传递给目标路由组件*/}
              <LinkButton onClick={() => this.props.history.push('/news/update', news)}>修改</LinkButton>
              <LinkButton onClick={() => this.deleteNews(news)}>删除</LinkButton>
            </span>
          );
        }
      },
    ];
  }

  /*
    获取指定页码的列表数据显示
  */
  getNews = async (pageNum) => {
    this.pageNum = pageNum; // 保存pageNum, 让其它方法可以看到
    this.setState({loading: true}); // 显示loading

    const { keyword, searchType } = this.state;

    console.log(keyword, searchType);
    // 如果搜索关键字有值, 说明我们要做搜索分页
    let result;
    if (keyword) {
      result = await reqSearchNews({pageNum, pageSize: PAGE_SIZE, keyword, searchType});
    } else { // 一般分页请求
      if(this.state.adminInfo.role_id === '2'){
        // 如果为学校管理员，则只显示所在学校的公告
        const schoolName = this.state.adminInfo.school[1];
        result = await reqNewsByPublisher(schoolName, pageNum, PAGE_SIZE);
      } else {
        result = await reqNews(pageNum, PAGE_SIZE);
      }
    }

    this.setState({loading: false}); // 隐藏loading
    if (result.status === 0) {
      // 取出分页数据, 更新状态, 显示分页列表
      // console.log(result.data);
      const {total, list} = result.data;
      this.setState({
        total,
        news: list
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
      news, 
      total, 
      loading,
      searchType, 
      keyword 
    } = this.state;

    const title = (
      <span>
        {
          // 若为学校管理员则只有按主题搜索
          this.state.adminInfo.role_id === '2'? (
            <Select
              value= {searchType}
              style={{width: 150}}
              onChange={value => this.setState({searchType:value})}
            >
              <Option value='newsTheme'>按主题搜索</Option>
            </Select>):(
            <Select
              value= {searchType}
              style={{width: 150}}
              onChange={value => this.setState({searchType:value})}
            >
              <Option value='newsTheme'>按主题搜索</Option>
              <Option value='newsPublisher'>按发布人搜索</Option>
            </Select>
          )
        }
        <Input
          placeholder='关键字'
          style={{width: 150, margin: '0 15px'}}
          value={keyword}
          onChange={event => this.setState({keyword:event.target.value})}
        />
        <Button type='primary' onClick={() => this.getNews(1)}>搜索</Button>
      </span>
    );
  
    const extra = (
      <Button type='primary' onClick={() => this.props.history.push('/news/add')}>
        添加新闻
      </Button>
    );

    return (
      <Card title={title} extra={extra}>
        <Table
          bordered
          rowKey='_id'
          loading={loading}
          dataSource={news}
          columns={this.columns}
          pagination={{
            current: this.pageNum,
            total,
            defaultPageSize: 6,
            showQuickJumper: true,
            onChange: this.getNews
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
