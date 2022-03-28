/* eslint-disable react/prop-types */
import React, {Component} from 'react';
import {
  Card,
  Select,
  Input,
  Button,
  Table,
  Modal,
  message
} from 'antd';

import LinkButton from '../../components/link-button';
import ShowImageOrContent from '../../utils/show-image-or-content';
import { reqSchools, reqSearchSchools, reqDeleteSchool} from '../../api';
import {PAGE_SIZE} from '../../utils/constants';

const Option = Select.Option;

/*
School的默认子路由组件
 */
export default class School extends Component {

  state = {
    total: 0, // 学校的总数量
    schools: [], // 学校的数组
    loading: false, // 是否正在加载中
    keyword: '', // 搜索的关键字
    searchType: 'schoolName', // 根据哪个字段搜索
    isShowImageOrContent: false, // 是否显示内容详情
    current_click_item: [] // 当前点击查看的一项
  };
  
  componentDidMount () {
    this.getSchools(1);
  }

  /* 显示开放区域详情 */
  showOpenAreas = (text) => {
    this.setState({
      openAreasDetail: text,
      isShowOpenAreas: true
    });
  }

  /* 用于接收子组件返回的isShowOpenAreas状态 */
  handleCloseShowOpenAreasModal = (isShowOpenAreas) => {
    this.setState({
      isShowOpenAreas
    });
  }

  /* 显示开放时间详情 */
  showOpenTime = (text) => {
    this.setState({
      openTimeDetail: text,
      isShowOpenTime: true
    });
  }

  /* 用于接收子组件返回的isShowOpenAreas状态 */
  handleCloseShowOpenTimeModal = (isShowOpenTime) => {
    this.setState({
      isShowOpenTime
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

  /* 删除学校 */
  deleteSchool = (school) => {
    console.log(school);
    Modal.confirm({
      title: `确认删除${school.school_name}吗?`,
      onOk: async () => {
        const result = await reqDeleteSchool(school._id);
        if(result.status===0) {
          message.success('删除学校成功!');
          this.getSchools(1);
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
        title: '学校名称',
        width: 200,
        dataIndex: 'school',
        render: school => school[1]
      },
      {
        title: '学校图片',
        width: 100,
        dataIndex: 'image',
        render: (text, record, index) => {
          return (
            <LinkButton onClick={ ()=>this.ShowImageOrContent(text, record, index) }>点击查看</LinkButton>
          );
        }
      },
      {
        title: '所在区域',
        width: 70,
        dataIndex: 'school',
        render: school => school[0]
      },
      {
        title: '联系电话',
        width: 100,
        dataIndex: 'telephone',
      },
      {
        title: '学校地址',
        width: 100,
        dataIndex: 'address',
        render: (text, record, index) => {
          return (
            <LinkButton onClick={ ()=>this.ShowImageOrContent(text, record, index) }>点击查看</LinkButton>
          );
        }
      },
      {
        title: '经度',
        width: 60,
        dataIndex: 'longitude',
      },
      {
        title: '纬度',
        width: 60,
        dataIndex: 'latitude',
      },
      {
        title: '交通指引',
        width: 100,
        dataIndex: 'trafficGuidance',
        render: (text, record, index) => {
          return (
            <LinkButton onClick={ ()=>this.ShowImageOrContent(text, record, index) }>点击查看</LinkButton>
          );
        }
      },
      {
        title: '开放时间',
        width: 100,
        dataIndex: 'openTimeInfoStr',
        render: (text, record, index) => {
          return (
            <LinkButton onClick={ ()=>this.ShowImageOrContent(text, record, index) }>点击查看</LinkButton>
          );
        }
      },
      {
        title: '开放区域',
        width: 100,
        dataIndex: 'openAreasInfoStr',
        render: (text, record, index) => {
          return (
            <LinkButton onClick={ ()=>this.ShowImageOrContent(text, record, index) }>点击查看</LinkButton>
          );
        }
      },
      {
        title: '学校介绍',
        width: 100,
        dataIndex: 'schoolIntroduce',
        render: (text, record, index) => {
          return (
            <LinkButton onClick={ ()=>this.ShowImageOrContent(text, record, index) }>点击查看</LinkButton>
          );
        }
      },
      {
        title: '预约须知',
        width: 100,
        dataIndex: 'reservationNotice',
        render: (text, record, index) => {
          return (
            <LinkButton onClick={ ()=>this.ShowImageOrContent(text, record, index) }>点击查看</LinkButton>
          );
        }
      },
      {
        title: '可否预约',
        width: 100,
        dataIndex: 'openBooking',
      },
      {
        title: '操作',
        width: 100,
        render: (school) => {
          return (
            <span>
              {/*将 school 对象使用state传递给目标路由组件*/}
              <LinkButton onClick={() => this.props.history.push('/school/update', school)}>修改</LinkButton>
              <LinkButton onClick={() => this.deleteSchool(school)}>删除</LinkButton>
            </span>
          );
        }
      },
    ];
  }

  /*
    获取指定页码的列表数据显示
  */
  getSchools = async (pageNum) => {
    this.pageNum = pageNum; // 保存pageNum, 让其它方法可以看到
    this.setState({loading: true}); // 显示loading

    const { keyword, searchType } = this.state;

    console.log(keyword, searchType);
    // 如果搜索关键字有值, 说明我们要做搜索分页
    let result;
    if (keyword) {
      result = await reqSearchSchools({pageNum, pageSize: PAGE_SIZE, keyword, searchType});
    } else { // 一般分页请求
      result = await reqSchools(pageNum, PAGE_SIZE);
    }

    this.setState({loading: false}); // 隐藏loading
    if (result.status === 0) {
      // 取出分页数据, 更新状态, 显示分页列表
      // console.log(result.data);
      const {total, list} = result.data;
      this.setState({
        total,
        schools: list
      });
    }
  }

  render() {
    const { isShowImageOrContent, current_click_item } = this.state;
    this.initColumns();

    // 取出状态数据
    const { schools, total, loading, searchType, keyword } = this.state;

    const title = (
      <span>
        <Select
          value= {searchType}
          style={{width: 150}}
          onChange={value => this.setState({searchType:value})}
        >
          <Option value='schoolName'>按名称搜索</Option>
          <Option value='schoolDistrict'>按区域搜索</Option>
        </Select>
        <Input
          placeholder='关键字'
          style={{width: 150, margin: '0 15px'}}
          value={keyword}
          onChange={event => this.setState({keyword:event.target.value})}
        />
        <Button type='primary' onClick={() => this.getSchools(1)}>搜索</Button>
      </span>
    );

    const extra = (
      <Button type='primary' onClick={() => this.props.history.push('/school/add')}>
        添加学校
      </Button>
    );

    return (
      <Card title={title} extra={extra}>
        <Table
          bordered
          rowKey='_id'
          loading={loading}
          dataSource={schools}
          columns={this.columns}
          pagination={{
            current: this.pageNum,
            total,
            defaultPageSize: 6,
            showQuickJumper: true,
            onChange: this.getSchools
          }}
        />
        <ShowImageOrContent current_click_item={current_click_item} handleCloseShowImageOrContentModal={this.handleCloseShowImageOrContentModal} isShowImageOrContent={isShowImageOrContent} />
      </Card>
    );
  }
}