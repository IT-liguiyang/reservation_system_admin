import React from 'react';
import PropTypes from 'prop-types';
import { Modal, Table } from 'antd';

const ShowOpenTime = (props) => {

  const { isShowOpenTime, openTimeDetail } = props;

  // 规定向父元素接收的数据类型
  ShowOpenTime.propTypes ={
    isShowOpenTime: PropTypes.bool.isRequired,
    openTimeDetail: PropTypes.array.isRequired,
    handleCloseShowOpenTimeModal:PropTypes.func.isRequired
  };

  // 向父元素传递关闭模态框
  const closeModal = () => {
    props.handleCloseShowOpenTimeModal(false);
  };

  // 第一层解构
  const [ school_day=[], vacation=[], holiday=[] ] = openTimeDetail || [];

  // 第二层解构
  const [ school_day_saturday = [], school_day_sunday = [] ]  = school_day.school_day || [];
  const [ vacation_workday = [], vacation_saturday = [], vacation_sunday = [] ]  = vacation.vacation || [];
  const [ holiday_am = [], holiday_pm = [] ]  = holiday.holiday || [];
  // console.log(school_day_saturday, school_day_sunday);

  // 第三层解构
  const [ school_day_saturday_am = [], school_day_saturday_pm = [] ] = school_day_saturday.saturday || [];
  const [ school_day_sunday_am = [], school_day_sunday_pm = [] ] = school_day_sunday.sunday || [];

  const [ vacation_workday_am = [], vacation_workday_pm = [] ] = vacation_workday.workday || [];
  const [ vacation_saturday_am = [], vacation_saturday_pm = [] ] = vacation_saturday.saturday || [];
  const [ vacation_sunday_am = [], vacation_sunday_pm = [] ] = vacation_sunday.sunday || [];

  // 构造开放时间数组，方便 columns 中 dataIndex 获取数据
  const open_time_array = [
    {school_day_saturday:school_day_saturday_am, school_day_sunday:school_day_sunday_am,vacation_workday:vacation_workday_am,vacation_saturday:vacation_saturday_am,vacation_sunday:vacation_sunday_am,holiday:holiday_am},
    {school_day_saturday:school_day_saturday_pm, school_day_sunday:school_day_sunday_pm,vacation_workday:vacation_workday_pm,vacation_saturday:vacation_saturday_pm,vacation_sunday:vacation_sunday_pm,holiday:holiday_pm}
  ];

  const columns = [
    {
      title: '教学期间',
      align: 'center',
      children: [
        {
          title: '周六',
          align: 'center',
          dataIndex: 'school_day_saturday',
        },
        {
          align: 'center',
          title: '周日',
          dataIndex: 'school_day_sunday',
        }
      ]
    },
    {
      title: '寒暑假',
      align: 'center',
      children: [
        {
          title: '工作日',
          align: 'center',
          dataIndex: 'vacation_workday',
        },
        {
          title: '周六',
          align: 'center',
          dataIndex: 'vacation_saturday',
        },
        {
          title: '周日',
          align: 'center',
          dataIndex: 'vacation_saturday',
        }
      ]
    },
    {
      title: '节假日',
      align: 'center',
      dataIndex: 'holiday',
    }
  ];

  return (
    <Modal
      title='开放区域'
      visible={isShowOpenTime}
      onCancel={closeModal}
      footer={[]}
      width={1000}
    >
      <span style={{position:'absolute',marginLeft:5+'px',marginTop:130+'px',zIndex:9999}}>上午:</span>
      <span style={{position:'absolute',marginLeft:5+'px',marginTop:180+'px',zIndex:9999}}>下午:</span>
      <Table
        width={500}
        bordered
        rowKey={1}
        dataSource={open_time_array}
        style={{paddingLeft:50+'px'}}
        columns={columns}
      />
    </Modal>
  );
};

export default ShowOpenTime;