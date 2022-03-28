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
import ShowPublishContent from '../../utils/show-publish-content';
import ShowComment from './show-comment';
import ShowLove from './show-love';
import LinkButton from '../../components/link-button';
import { reqDynamicSharings, reqDeleteDynamicSharing, reqSearchDynamicSharings } from '../../api';
import {PAGE_SIZE} from '../../utils/constants';

const Option = Select.Option;

/*
DynamicSharing的默认子路由组件
 */
export default class DynamicSharing extends Component {

  state = {
    total: 0, // 动态分享的总数量
    dynamic_sharings: [], // 动态分享的数组
    loading: false, // 是否正在加载中
    keyword: '', // 搜索的关键字
    searchType: 'dynamic_sharingPublisher', // 根据哪个字段搜索
    isShowPublishContent: false, // 是否显示内容详情
    detailTitle: '动态分享详情', // 设置标题
    contentDetail:{},  // 内容详情
    isShowComment: false, // 是否显示评论详情
    commentDetail:{},  // 评论详情
    isShowLove: false, // 是否显示点赞详情
    LoveDetail:{},  // 点赞详情
    isShowImageOrContent: false, // 是否显示图片详情
    imageDetail:{},  // 内容详情
    current_click_item:[] // 当前点击查看的一项
  };

  componentDidMount () {
    this.getDynamicSharings(1);
  }

  /* 显示动态分享内容详情 */
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

  /* 显示动态分享评论详情 */
  showComment = (text, record) => {
    this.setState({
      commentDetail: record,
      isShowComment: true
    });
  }

  /* 用于接收子组件返回的isshowComment状态 */
  handleCloseShowCommentModal = (isShowComment) => {
    this.setState({
      isShowComment
    });
  }

  /* 显示动态分享点赞详情 */
  showLove = (text, record) => {
    this.setState({
      loveDetail: record,
      isShowLove: true
    });
  }

  /* 用于接收子组件返回的isShowLove状态 */
  handleCloseShowLoveModal = (isShowLove) => {
    this.setState({
      isShowLove
    });
  }

  /* 显示内容详情 */
  ShowImageOrContent = (text, record) => {
    console.log(text);
    this.setState({
      current_click_item: text,
      imageDetail: record,
      isShowImageOrContent: true
    });
  }

  /* 用于接收子组件返回的isShowImageOrContent状态 */
  handleCloseShowImageOrContentModal = (isShowImageOrContent) => {
    this.setState({
      isShowImageOrContent
    });
  }

  /* 删除动态分享 */
  deleteDynamicSharing = (dynamic_sharing) => {
    console.log(dynamic_sharing);
    Modal.confirm({
      title: `确认删除${dynamic_sharing.pub_theme}吗?`,
      onOk: async () => {
        const result = await reqDeleteDynamicSharing(dynamic_sharing._id);
        if(result.status===0) {
          message.success('删除动态分享成功!');
          this.getDynamicSharings(1);
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
        title: '发布人手机',
        width: 90,
        dataIndex: 'publish_username',
      },
      {
        title: '发布人姓名',
        width: 90,
        dataIndex: 'publish_realname',
      },
      {
        title: '发布人头像',
        width: 90,
        dataIndex: 'publish_avater',
        render: (text, record, index) => {
          return (
            <LinkButton onClick={ ()=>this.ShowImageOrContent(text, record, index) }>点击查看</LinkButton>
          );
        }
      },
      {
        title: '发布时间',
        width: 120,
        dataIndex: 'pub_time',
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
        title: '图片列表',
        width: 90,
        dataIndex: 'image_list',
        render: (text, record, index) => {
          return (
            <LinkButton onClick={ ()=>this.ShowImageOrContent(text, record, index) }>点击查看</LinkButton>
          );
        }
      },
      {
        title: '点赞',
        width: 80,
        dataIndex: 'love',
        render: (text, record, index) => {
          return (
            <LinkButton onClick={ ()=>this.showLove(text, record, index) }>点击查看</LinkButton>
          );
        }
      },
      {
        title: '评论内容',
        width: 80,
        dataIndex: 'comment',
        render: (text, record, index) => {
          return (
            <LinkButton onClick={ ()=>this.showComment(text, record, index) }>点击查看</LinkButton>
          );
        }
      },
      {
        title: '操作',
        width: 100,
        render: (dynamic_sharing) => {
          return (
            <span>
              {/*将 dynamic_sharing 对象使用state传递给目标路由组件*/}
              <LinkButton onClick={() => this.props.history.push('/dynamic_sharing/update', dynamic_sharing)}>修改</LinkButton>
              <LinkButton onClick={() => this.deleteDynamicSharing(dynamic_sharing)}>删除</LinkButton>
            </span>
          );
        }
      },
    ];
  }

  /*
    获取指定页码的列表数据显示
  */
  getDynamicSharings = async (pageNum) => {
    this.pageNum = pageNum; // 保存pageNum, 让其它方法可以看到
    this.setState({loading: true}); // 显示loading

    const { keyword, searchType } = this.state;

    console.log(keyword, searchType);
    // 如果搜索关键字有值, 说明我们要做搜索分页
    let result;
    if (keyword) {
      result = await reqSearchDynamicSharings({pageNum, pageSize: PAGE_SIZE, keyword, searchType});
    } else { // 一般分页请求
      result = await reqDynamicSharings(pageNum, PAGE_SIZE);
    }

    this.setState({loading: false}); // 隐藏loading
    if (result.status === 0) {
      // 取出分页数据, 更新状态, 显示分页列表
      // console.log(result.data);
      const {total, list} = result.data;
      this.setState({
        total,
        dynamic_sharings: list
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
      isShowComment, 
      commentDetail,  
      dynamic_sharings, 
      total, 
      loading, 
      searchType, 
      keyword, 
      current_click_item, 
      isShowImageOrContent,
      loveDetail,
      isShowLove
    } = this.state;

    const title = (
      <span>
        <Select
          value= {searchType}
          style={{width: 150}}
          onChange={value => this.setState({searchType:value})}
        >
          {/* <Option value='dynamic_sharingTheme'>按标题搜索</Option> */}
          <Option value='dynamic_sharingPublisher'>按发布人搜索</Option>
        </Select>
        <Input
          placeholder='关键字'
          style={{width: 150, margin: '0 15px'}}
          value={keyword}
          onChange={event => this.setState({keyword:event.target.value})}
        />
        <Button type='primary' onClick={() => this.getdynamic_sharings(1)}>搜索</Button>
      </span>
    );
  
    const extra = (
      <Button type='primary' onClick={() => this.props.history.push('/dynamic_sharing/add')}>
        添加动态分享
      </Button>
    );

    return (
      <Card title={title} extra={extra}>
        <Table
          bordered
          rowKey='_id'
          loading={loading}
          dataSource={dynamic_sharings}
          columns={this.columns}
          pagination={{
            current: this.pageNum,
            total,
            defaultPageSize: 6,
            showQuickJumper: true,
            onChange: this.getDynamicSharings
          }}
        />
        <ShowImageOrContent 
          contentDetail={contentDetail} 
          current_click_item={current_click_item} 
          handleCloseShowImageOrContentModal={this.handleCloseShowImageOrContentModal} 
          isShowImageOrContent={isShowImageOrContent} 

        />
        <ShowPublishContent 
          detailTitle={detailTitle} 
          contentDetail={contentDetail} 
          handleCloseShowPublishContentModal={this.handleCloseShowPublishContentModal} 
          isShowPublishContent={isShowPublishContent} 

        />
        <ShowComment 
          commentDetail={commentDetail} 
          handleCloseShowCommentModal={this.handleCloseShowCommentModal} 
          isShowComment={isShowComment} 

        />
        <ShowLove 
          loveDetail={loveDetail} 
          handleCloseShowLoveModal={this.handleCloseShowLoveModal} 
          isShowLove={isShowLove} 
          
        />
      </Card>
    );
  }
}
