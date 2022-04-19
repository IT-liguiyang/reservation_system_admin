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

import storageUtils from '../../utils/storageUtils';
import LinkButton from '../../components/link-button';
import ShowImageOrContent from '../../utils/show-image-or-content';
import { 
  reqReservationInfo,
  reqReservationInfoBySchoolId, 
  reqSearchReservationInfo,
  reqSearchReservationInfoBySchoolId,
  reqDeleteReservationInfo, 
  reqBookingInfoBySchoolId, 
  reqUpdateOpenInfoInfoBySchoolId,
  reqSchoolByName
} from '../../api';
import {PAGE_SIZE} from '../../utils/constants';

const Option = Select.Option;

/*
reservation_info的默认子路由组件
 */
export default class reservation_info extends Component {

  state = {
    adminInfo: {}, // 保存管理员信息，用于判断是学校管理员还是系统管理员
    total: 0, // 预约信息的总数量
    reservation_info: [], // 预约信息的数组
    loading: false, // 是否正在加载中
    keyword: '', // 搜索的关键字
    searchType: 'reservation_info_School', // 根据哪个字段搜索
    isShowImageOrContent: false, // 是否显示内容详情
    current_click_item:[], // 当前点击查看的一项
  };

  componentDidMount () {
    // 使用 promise 可以使得先得到 adminInfo 在进行查询学校信息
    this.getLoginAdminInfo().then(() => {
      this.getReservationInfo(1);
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

   //  // 获取当前登录的学校管理员所在学校的schoolId
   //  getSchoolInfoByUsername = async (schoolName) => {
   //    const result = await reqSchoolByName(schoolName);
   //    console.log(result);
   //    return result.data[0]._id;
   //  }

  /* 删除预约信息 */
  deleteReservationInfo = async (reservation_info) => {
    console.log('reservation_info', reservation_info);
    const { res_school_id, res_date, res_place, res_time } = reservation_info || {};
    // 得到原本的 open_info，修改已预定数量后，在根据 school_id 更新
    const school_id = res_school_id;
    const booking_info = await reqBookingInfoBySchoolId(school_id); 
    const { open_info } = booking_info.data[0] || {}; 
    
    Modal.confirm({
      title: '确认删除此条预约信息吗吗?',
      onOk: async () => {
        const result = await reqDeleteReservationInfo(reservation_info._id);
        if(result.status===0) {
          message.success('删除预约信息成功!');
          // 对应的场馆已预订数量要减1
          open_info.map((item) => {
            item.map((item1) => {
              if(item1.day === res_date && item1.placeName === res_place) {
                item1.timeIntervals.map((item2) => {
                  item2.map((item3) => {
                    if(item3.beginTime === res_time.split('-')[0] && item3.endTime === res_time.split('-')[1]){
                      item3.bookedCount = (item3.bookedCount*1-1).toString();
                    }
                  });
                });
              }
            });
          });
          const newOpenInfo = open_info;
          // 更新 open_info
          const updatedBookingInfo = await reqUpdateOpenInfoInfoBySchoolId({newOpenInfo ,school_id}); 
          console.log('updatedBookingInfo', updatedBookingInfo);
          
          // 重新获取预定信息
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
        width: 80,
        dataIndex: 'res_username',
      },
      {
        title: '头像',
        width: 80,
        dataIndex: 'res_avater',
        render: (text, record, index) => {
          return (
            <LinkButton onClick={ ()=>this.ShowImageOrContent(text, record, index) }>点击查看</LinkButton>
          );
        }
      },
      {
        title: '已约学校名称',
        width: 150,
        dataIndex: 'res_school_name',
      },
      // {
      //   title: '已约学校编号',
      //   width: 100,
      //   dataIndex: 'res_school_id',
      // },
      {
        title: '已约日期',
        width: 100,
        dataIndex: 'res_date',
      },
      {
        title: '已约场地',
        width: 90,
        dataIndex: 'res_place',
      },
      {
        title: '已约时段',
        width: 100,
        dataIndex: 'res_time',
      },
      {
        title: '交通方式',
        width: 80,
        dataIndex: 'vehicle',
      },
      {
        title: '预约状态',
        width: 60,
        dataIndex: 'status',
      },
      {
        title: '提交时间',
        width: 100,
        dataIndex: 'submit_time',
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
    var school_id = '';
    if(this.state.adminInfo.role_id === '2') {
      const schoolName =  storageUtils.getAdmin().school[1];
      const result = await reqSchoolByName(schoolName);
      console.log('result', result);
      school_id = result.data[0]._id;
    }
    this.pageNum = pageNum; // 保存pageNum, 让其它方法可以看到
    this.setState({loading: true}); // 显示loading

    const { keyword, searchType } = this.state;

    console.log(keyword, searchType);
    // 如果搜索关键字有值, 说明我们要做搜索分页
    let result;
    if (keyword) {
      if(this.state.adminInfo.role_id === '2') {
        console.log('school_id', school_id);
        result = await reqSearchReservationInfoBySchoolId({pageNum, pageSize: PAGE_SIZE, keyword, searchType, school_id});
      } else {
        result = await reqSearchReservationInfo({pageNum, pageSize: PAGE_SIZE, keyword, searchType});
      }
    } else { // 一般分页请求
      if(this.state.adminInfo.role_id === '2') {
        console.log('school_id', school_id);
        result = await reqReservationInfoBySchoolId(pageNum, PAGE_SIZE, school_id);
      } else {
        result = await reqReservationInfo(pageNum, PAGE_SIZE);
      }
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

  render() {
    this.initColumns();

    // 取出状态数据
    const { 
      reservation_info, 
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
          // 若为学校管理员则只有按标题搜索
          this.state.adminInfo.role_id === '2'? (
            <Select
              value= {searchType}
              style={{width: 150}}
              onChange={value => this.setState({searchType:value})}
            >
              <Option value='reservation_info_School'>按已约学校搜索</Option>
            </Select>):(
            <Select
              value= {searchType}
              style={{width: 150}}
              onChange={value => this.setState({searchType:value})}
            >
              <Option value='reservation_info_School'>按已约学校搜索</Option>
              <Option value='reservation_info_Name'>按预约姓名搜索</Option>
            </Select>
          )
        }
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
        <ShowImageOrContent 
          current_click_item={current_click_item}
          handleCloseShowImageOrContentModal={this.handleCloseShowImageOrContentModal} 
          isShowImageOrContent={isShowImageOrContent}
        />
      </Card>
    );
  }
}
