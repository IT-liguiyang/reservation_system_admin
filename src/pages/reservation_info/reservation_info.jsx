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
import { reqReservationInfo, reqDeleteReservationInfo, reqSearchReservationInfo } from '../../api';
import {PAGE_SIZE} from '../../utils/constants';

const Option = Select.Option;

/*
reservation_info的默认子路由组件
 */
export default class reservation_info extends Component {

  state = {
    total: 0, // 预约信息的总数量
    reservation_info: [], // 预约信息的数组
    loading: false, // 是否正在加载中
    keyword: '', // 搜索的关键字
    searchType: 'reservation_info_School', // 根据哪个字段搜索
    isShowContent: false, // 是否显示内容详情
    contentDetail:{},  // 内容详情
  };

  componentDidMount () {
    this.getReservationInfo(1);
  }

  /* 显示预约信息内容详情 */
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

  /* 删除预约信息 */
  deleteReservationInfo = (reservation_info) => {
    console.log(reservation_info);
    Modal.confirm({
      title: '确认删除此条预约信息吗吗?',
      onOk: async () => {
        const result = await reqDeleteReservationInfo(reservation_info._id);
        if(result.status===0) {
          message.success('删除预约信息成功!');
          this.getReservationInfo(1);
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
        width: 80,
        dataIndex: 'res_realname',
      },
      {
        title: '手机号',
        width: 70,
        dataIndex: 'res_username',
      },
      {
        title: '提交时间',
        width: 100,
        dataIndex: 'submit_time',
      },
      {
        title: '已约学校',
        width: 150,
        dataIndex: 'res_school',
      },
      {
        title: '已约场地',
        width: 100,
        dataIndex: 'res_area',
      },
      {
        title: '已约时间',
        width: 100,
        dataIndex: 'res_time',
      },
      {
        title: '是否有同行人',
        width: 60,
        dataIndex: 'has_partners',
      },
      {
        title: '同行人关系',
        width: 100,
        dataIndex: 'partnerts_relation',
      },
      {
        title: '交通方式',
        width: 100,
        dataIndex: 'vehicle',
      },
      {
        title: '是否同意安全承诺',
        width: 60,
        dataIndex: 'has_agreed_safety_commitment',
      },
      {
        title: '是否同意防疫承诺',
        width: 60,
        dataIndex: 'has_agreed_antiepidemic_commitment',
      },
      {
        title: '操作',
        width: 100,
        render: (reservation_info) => {
          return (
            <span>
              {/*将 reservation_info 对象使用state传递给目标路由组件*/}
              <LinkButton onClick={() => this.props.history.push('/reservation_info/update', reservation_info)}>修改</LinkButton>
              <LinkButton onClick={() => this.deleteReservationInfo(reservation_info)}>删除</LinkButton>
            </span>
          );
        }
      },
    ];
  }

  /*
    获取指定页码的列表数据显示
  */
  getReservationInfo = async (pageNum) => {
    this.pageNum = pageNum; // 保存pageNum, 让其它方法可以看到
    this.setState({loading: true}); // 显示loading

    const { keyword, searchType } = this.state;

    console.log(keyword, searchType);
    // 如果搜索关键字有值, 说明我们要做搜索分页
    let result;
    if (keyword) {
      result = await reqSearchReservationInfo({pageNum, pageSize: PAGE_SIZE, keyword, searchType});
    } else { // 一般分页请求
      result = await reqReservationInfo(pageNum, PAGE_SIZE);
    }

    this.setState({loading: false}); // 隐藏loading
    if (result.status === 0) {
      // 取出分页数据, 更新状态, 显示分页列表
      // console.log(result.data);
      const {total, list} = result.data;
      this.setState({
        total,
        reservation_info: list
      });
    }
  }

  render() {
    this.initColumns();

    // 取出状态数据
    const { isShowContent, contentDetail, reservation_info, total, loading, searchType, keyword } = this.state;

    const title = (
      <span>
        <Select
          value= {searchType}
          style={{width: 150}}
          onChange={value => this.setState({searchType:value})}
        >
          <Option value='reservation_info_School'>按已约学校搜索</Option>
          <Option value='reservation_info_Name'>按预约姓名搜索</Option>
        </Select>
        <Input
          placeholder='关键字'
          style={{width: 150, margin: '0 15px'}}
          value={keyword}
          onChange={event => this.setState({keyword:event.target.value})}
        />
        <Button type='primary' onClick={() => this.getReservationInfo(1)}>搜索</Button>
      </span>
    );
  
    const extra = (
      <Button type='primary' onClick={() => this.props.history.push('/reservation_info/add')}>
        添加预约信息
      </Button>
    );

    return (
      <Card title={title} extra={extra}>
        <Table
          bordered
          rowKey='_id'
          loading={loading}
          dataSource={reservation_info}
          columns={this.columns}
          pagination={{
            current: this.pageNum,
            total,
            defaultPageSize: 6,
            showQuickJumper: true,
            onChange: this.getReservationInfo
          }}
        />
        <ShowContent contentDetail={contentDetail} handleCloseShowContentModal={this.handleCloseShowContentModal} isShowContent={isShowContent} />
      </Card>
    );
  }
}
