import React, { useState, useEffect } from 'react';
import { 
  Drawer, 
  Button, 
  Tabs, 
  message,
  Pagination
} from 'antd';

const { TabPane } = Tabs;
import SchooldayWorkday from './schoolday_workday';
import SchooldayWeekend from './schoolday_weekend';
import VacationWorkday from './vacation_workday';
import VacationWeekend from './vacation_weekend';
import Holiday from './holiday';

import { isSchooldayWorkday, isSchooldayWeekend, isSaturday, isHoliday } from '../../utils/date-partition';
import { 
  reqBookingInfoBySchoolId, 
  reqAddBookingInfo, 
  reqDeleteBookingInfo, 
  reqUpdateBookingInfo, 
  reqSchoolByName,
  reqUpdateSchool 
} from '../../api';
import storageUtils from '../../utils/storageUtils';

import './index.less';

const BookingInfo = ()=> {

  const [ visible, setVisible ] = useState(false);  // 控制右边抽屉的显示和隐藏
  const [ schooldayWorkdayList, setSchooldayWorkdayList ] = useState([]); // 存放教学期间工作日的开放信息
  const [ schooldayWeekendList, setSchooldayWeekendList ] = useState([]); // 存放教学期间周末的开放信息
  const [ vacationWorkdayList, setVacationWorkdayList ] = useState([]); // 存放寒暑假工作日的开放信息
  const [ vacationWeekendList, setVacationWeekendList ] = useState([]); // 存放寒暑假周末的开放信息
  const [ holidaydayList, setHolidayList ] = useState([]); // 存放法定节假日的开放信息
  const [ currentMonthDays, setCurrentMonthDays ] = useState([]); // 存放当前月的日期数组
  const [ isVacation ] = useState(false); // 设置是否为寒暑假
  const [ initBookingInfo, setInitBookingInfo ] = useState([]); // 设置是否为寒暑假
  const [ operationFlag, setoperationFlag ] = useState(0);
  const [ minPageIndex, setMinPageIndex ] = useState(0);
  const [ maxPageIndex, setMaxPageIndex ] = useState(7);

  // 根据学校名称查询学校 _id
  const getSchoolInfo = async () => {
    const admin = storageUtils.getAdmin();  // 从缓存得到当前登录的管理员信息
    const schoolName = admin.school[1];  // 得到学校名称
    const result = await reqSchoolByName(schoolName); // 根据学校名称查询学校信息
    return result.data;
  };

  useEffect(() => {
    getCurrentMonthDays();
    getBookingInfo();
  }, []);

  // 获取预约设置信息
  const getBookingInfo = async () => {
    const schoolInfo = await getSchoolInfo();
    const { _id } = schoolInfo[0] || {};
    const school_id = _id;
    const result = await reqBookingInfoBySchoolId(school_id) || {};
    console.log('result', result);
    if (result.data.length === 0) {
      message.warning('开放信息不存在！');
      return;
    }
    const { 
      schooldayWorkdayList, 
      schooldayWeekendList, 
      vacationWorkdayList, 
      vacationWeekendList, 
      holidaydayList 
    } = result.data[0].open_info_from_form ||{};
    setSchooldayWorkdayList(schooldayWorkdayList);
    setSchooldayWeekendList(schooldayWeekendList);
    setVacationWorkdayList(vacationWorkdayList);
    setVacationWeekendList(vacationWeekendList);
    setHolidayList(holidaydayList);
    console.log('result.data', result.data[0]);
    setInitBookingInfo(result.data);
    return result.data[0];
  };

  // 删除预约设置信息
  const deleteBookingInfo = async () => {
    console.log(initBookingInfo[0]._id);
    if(!initBookingInfo[0]._id) {
      message.warning('开放信息不存在！');
      return;
    }
    const result = await reqDeleteBookingInfo(initBookingInfo[0]._id);
    console.log(result);
    if(result.status === 0) {
      setInitBookingInfo([]);
      message.success('删除成功');
    }
  };

  console.log(initBookingInfo);

  // 控制右边 添加 抽屉的显示和隐藏的函数
  const showAddDrawer = () => {
    setoperationFlag(1);
    setVisible(true);
  };

  // 控制右边 更新 抽屉的显示和隐藏的函数
  const showUpdateDrawer = () => {
    setoperationFlag(2);
    setVisible(true);
  };

  const turnOnOrOffReservation = async () => {
    const schoolInfo = await getSchoolInfo();
    console.log('schoolInfo', schoolInfo);

    const {
      _id,
      school, 
      image,
      telephone, 
      address, 
      longitude, 
      latitude,
      trafficGuidance,
      openTimeInfoStr,
      openAreasInfoStr,
      schoolIntroduce,
      reservationNotice,
      openBooking
    } = schoolInfo[0] || {};

    // 1. 生成学校对象
    const schoolObj = {
      school, 
      image,
      telephone, 
      address, 
      longitude, 
      latitude,
      trafficGuidance,
      openTimeInfoStr,
      openAreasInfoStr,
      schoolIntroduce,
      reservationNotice,
      openBooking: openBooking === '1' ? '0':'1'
    };

    const schoolId = _id;

    // 2. 提交添加的请求
    const result = await reqUpdateSchool({schoolObj, schoolId});

    console.log(result);
    if(result.status === 0){
      message.success(openBooking === '1' ? '预约通道已关闭':'预约通道已开启');
    }else if(result.status === 1){
      message.warning(result.msg);
    } 
  };

  // 更新开放日期的月份，每个月更新一次
  const updateMonth = async () => {
    const booking_info = await getBookingInfo();
    const { school_id, school, open_info_from_form, isVacation } = booking_info || {};
    // 获取最终的开放信息
    const finalOpenInfo = getFinalOpenInfo();

    // 构造待更新的预约设置对象
    const booking_infoObj = {
      'school_id': school_id,
      'school': school,
      'open_info_from_form': open_info_from_form,
      'open_info': finalOpenInfo,
      'isVacation': isVacation
    };

    const result = await reqUpdateBookingInfo({booking_infoObj, school_id});
    console.log(result);
    if(result.status === 0){
      message.success('更新月份成功！');
    }else if(result.status === 1){
      message.warning(result.msg);
    }
  };

  // 开启寒暑假模式
  const startVacation = async () => {
    const booking_info = await getBookingInfo();
    const { school_id, school, open_info_from_form, isVacation } = booking_info || {};

    // 获取最终的开放信息
    const finalOpenInfo = getFinalOpenInfo();

    // 构造待更新的预约设置对象
    const booking_infoObj = {
      'school_id': school_id,
      'school': school,
      'open_info_from_form': open_info_from_form,
      'open_info': finalOpenInfo,
      'isVacation': !isVacation
    };

    console.log(booking_infoObj);

    const result = await reqUpdateBookingInfo({booking_infoObj, school_id});
    console.log(result);
    if(result.status === 0){
      message.success('教学模式和寒暑假模式切换成功！');
    }else if(result.status === 1){
      message.warning(result.msg);
    }
  };

  // 右边抽屉关闭后的回调
  const onClose = async () => {
    
    // 如果为寒暑假，直接将教学期间的时间换为寒暑假的，其他逻辑不便
    if (isVacation === true) {
      setSchooldayWorkdayList(vacationWorkdayList);
      setSchooldayWeekendList(vacationWeekendList);
    }

    // 获取最终的开放信息
    const finalOpenInfo = getFinalOpenInfo();

    console.log('finalOpenInfo', finalOpenInfo);

    // 查询学校的 _id 和 school
    const schoolObj = await getSchoolInfo();
    const { _id, school } = schoolObj[0] || {};
    console.log(_id, school);

    // 收集表单提交的所有原始开放信息
    const open_info_from_form = {
      schooldayWorkdayList,
      schooldayWeekendList,
      vacationWorkdayList,
      vacationWeekendList,
      holidaydayList
    };

    // 根据最新的开放信息和原本的开放信息数组比较，判断是否真正更新了
    // if(finalOpenInfo.length === initBookingInfo.open_info.length ) {
    //   message.warning('开放信息没有修改，未完成更新！');
    //   return;
    // }

    // 构造待更新的预约设置对象
    const booking_infoObj = {
      'school_id': _id,
      'school': school,
      'open_info_from_form': open_info_from_form,
      'open_info': finalOpenInfo,
      'isVacation': isVacation
    };

    console.log(booking_infoObj);

    // operationFlag为"1"是添加，operationFlag为"2"是更新
    if (operationFlag === 1){
      // 发送请求，添加预约设置信息
      const result = await reqAddBookingInfo(booking_infoObj);
      console.log(result);
      if(result.status === 0){
        getBookingInfo(); // 重新更新信息
        message.success('添加预约设置成功！');
      }else if(result.status === 1){
        message.warning(result.msg);
      }
    } else if (operationFlag === 2){
      const school_id = _id;
      const result = await reqUpdateBookingInfo({booking_infoObj, school_id});
      console.log(result);
      if(result.status === 0){
        message.success('更新预约设置成功！');
      }else if(result.status === 1){
        message.warning(result.msg);
      }
    }

    // 关闭右边抽屉
    setVisible(false);
  };

  // 得到最终的开放信息
  const getFinalOpenInfo = () => {
    const tempOpenInfo = [];

    currentMonthDays.map((oneday) => {
      // 如果是教学期间 工作日
      if (schooldayWorkdayList.length > 0 && isSchooldayWorkday(oneday) === true) {
        tempOpenInfo.push(
          schooldayWorkdayList[1].map((item) => {
            return ({
              'day': oneday,
              'placeName': item.open_area,
              'timeIntervals': [
                schooldayWorkdayList[0].map((time) => {
                  return ({
                    'beginTime': time[0] || '',
                    'endTime': time[1] || '',
                    'bookedCount': '0',
                    'maxBookingCount': time[0]? item.amount : '',
                  });
                })
              ]
            });
          })
        );
        // 如果是教学期间周末
      } else if (schooldayWeekendList.length > 0 && isSchooldayWeekend(oneday) === true) {
        // 如果是教学期间周末的 星期六
        if (isSaturday(oneday) === true) {
          if(schooldayWeekendList[0][0].length === 0) return;
          tempOpenInfo.push(
            schooldayWeekendList[1].map((item) => {
              return ({
                'day': oneday,
                'placeName': item.open_area,
                'timeIntervals': [
                  schooldayWeekendList[0].slice(0,2).map((time) => {
                    return ({
                      'beginTime': time[0] || '',
                      'endTime': time[1] || '',
                      'bookedCount': '0',
                      'maxBookingCount': time[0]? item.amount : '',
                    });
                  })
                ]
              });
            })
          );
        } else {
        // 如果是教学期间周末的 星期天
          tempOpenInfo.push(
            schooldayWeekendList[1].map((item) => {
              return ({
                'day': oneday,
                'placeName': item.open_area,
                'timeIntervals': [
                  schooldayWeekendList[0].slice(2,4).map((time) => {
                    return ({
                      'beginTime': time[0] || '',
                      'endTime': time[1] || '',
                      'bookedCount': '0',
                      'maxBookingCount': time[0]? item.amount : '',
                    });
                  })
                ]
              });
            })
          );
        }
      } else if (holidaydayList.length > 0 && isHoliday(oneday) === true) {
        tempOpenInfo.push(
          holidaydayList[1].map((item) => {
            return ({
              'day': oneday,
              'placeName': item.open_area,
              'timeIntervals': [
                holidaydayList[0].map((time) => {
                  return ({
                    'beginTime': time[0] || '',
                    'endTime': time[1] || '',
                    'bookedCount': '0',
                    'maxBookingCount': time[0]? item.amount : '',
                  });
                })
              ]
            });
          })
        );
      }
    });

    console.log('tempOpenInfo', tempOpenInfo);
    return tempOpenInfo;
  };

  // 得到当前月的日期数组
  const getCurrentMonthDays = ()=> {
    const dataTimes = [];
    const date = new Date();
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const d = new Date(year, month, 0);
    const n = +d.getDate();

    for (var i = 1; i < n + 1; i++) {
      dataTimes.push(year + '-' + (month>=10? month: '0' + month) + '-' + (i>=10? i: '0' + i));
    }
    setCurrentMonthDays(dataTimes);
  };

  /* 用于接收子组件返回的 提交内容 */
  const schooldayWorkdaySubmit = (schooldayWorkdayList_from_child) => {
    console.log('schooldayWorkdayList_from_child', schooldayWorkdayList_from_child);
    setSchooldayWorkdayList(schooldayWorkdayList_from_child);
  };
  
  /* 用于接收子组件返回的 提交内容 */
  const schooldayWeekendSubmit = (schooldayWeekendList_from_child) => {
    console.log('schooldayWeekendList_from_child', schooldayWeekendList_from_child);
    setSchooldayWeekendList(schooldayWeekendList_from_child);
  };

  /* 用于接收子组件返回的 提交内容 */
  const vacationWorkdaySubmit = (vacationWorkdayList_from_child) => {
    console.log('vacationWorkdayList_from_child', vacationWorkdayList_from_child);
    setVacationWorkdayList(vacationWorkdayList_from_child);
  };
  
  /* 用于接收子组件返回的 提交内容 */
  const vacationWeekendSubmit = (vacationWeekendList_from_child) => {
    console.log('vacationWeekendList_from_child', vacationWeekendList_from_child);
    setVacationWeekendList(vacationWeekendList_from_child);
  };

  /* 用于接收子组件返回的 提交内容 */
  const holidaySubmit = (holidayList_from_child) => {
    console.log('holidayList_from_child', holidayList_from_child);
    setHolidayList(holidayList_from_child);
  };

  const getWeek = (day)=> {
    console.log(121212);
    var weekArray = new Array('日', '一', '二', '三', '四', '五', '六');
    var week = weekArray[new Date(day).getDay()];//注意此处必须是先new一个Date
    return '星期' + week;
  };

  // 点击分页页码的回调
  const handlePageIndexChange = (value) => {
    console.log(value);
    if(value <=1){
      setMinPageIndex(0);
      setMaxPageIndex(7);
    } else {
      setMinPageIndex((value-1)*7);
      setMaxPageIndex((value-1)*7+7);
    }
  }; 

  return (
    <div className='booking-info'>
      <div className='operation-button'>
        <Button className='btn' type="primary" onClick={startVacation}>开启/关闭寒暑假模式</Button>
        <Button className='btn' type="primary" onClick={updateMonth}>更新月份</Button>
        <Button className='btn' type="primary" onClick={showUpdateDrawer}>更新预约设置</Button>
        <Button className='btn' type="primary" onClick={deleteBookingInfo}>删除预约设置</Button>
        <Button className='btn' type="primary" onClick={showAddDrawer}>添加预约设置</Button>
        <Button className='btn' type="primary" onClick={turnOnOrOffReservation}>开启/关闭预约通道</Button>
      </div>
      <div className='open-info'>
        {
          initBookingInfo.length>0 ? (
            initBookingInfo[0].open_info.slice(minPageIndex, maxPageIndex).map((item, index) => {
              console.log(index);
              return (
                <div key={index} className={index%2 !== 0? 'item':'item other'}>
                  <div className='date'>{item[0].day}</div>
                  <div className='week'>({getWeek(item[0].day)})</div>
                  {
                    item.map((place, index) => {
                      return (
                        <div key={index} className='place'>
                          <div className='placeName'>{place.placeName+':'}</div>
                          {
                            place.timeIntervals[0][0].beginTime !== ''? (
                              <div className='am'>
                                <div className='am-text'>早上: {place.timeIntervals[0][0].beginTime}-{place.timeIntervals[0][0].endTime}</div>
                                <div className='am-bookedCount'>已预定人数: {place.timeIntervals[0][0].bookedCount}</div>
                                <div className='am-remaindCount'>剩余预定额: {place.timeIntervals[0][0].maxBookingCount*1-place.timeIntervals[0][0].bookedCount*1}</div>
                              </div>
                            ):''
                          }
                          {
                            place.timeIntervals[0][1].beginTime !== ''? (
                              <div className='pm'>
                                <div className='pm-text'>下午: {place.timeIntervals[0][1].beginTime}-{place.timeIntervals[0][1].endTime}</div>
                                <div className='pm-bookedCount'>已预定人数: {place.timeIntervals[0][1].bookedCount}</div>
                                <div className='pm-remaindCount'>剩余预定额: {place.timeIntervals[0][1].maxBookingCount*1-place.timeIntervals[0][1].bookedCount*1}</div>
                              </div>
                            ):''
                          }
                        </div>
                      );
                    })
                  }
                </div>
              );
            })
          ) : ''
        }
      </div>
      {
        initBookingInfo.length>0 ? (
          <Pagination showQuickJumper defaultCurrent={1} defaultPageSize={7} total={initBookingInfo.length>0? initBookingInfo[0].open_info.length:7} onChange={handlePageIndexChange} />
        ):''
      }

      <Drawer width='600' title="预约设置" placement="right" onClose={onClose} visible={visible}>
        <Tabs defaultActiveKey="1">
          <TabPane tab="教学期间工作日" key="1">
            <SchooldayWorkday schooldayWorkdaySubmit={schooldayWorkdaySubmit}/>
          </TabPane>
          <TabPane tab="教学期间周末" key="2">
            <SchooldayWeekend schooldayWeekendSubmit={schooldayWeekendSubmit} />
          </TabPane>
          <TabPane tab="寒暑假工作日" key="3">
            <VacationWorkday vacationWorkdaySubmit={vacationWorkdaySubmit} />
          </TabPane>
          <TabPane tab="寒暑假周末" key="4">
            <VacationWeekend vacationWeekendSubmit={vacationWeekendSubmit} />
          </TabPane>
          <TabPane tab="法定节假日" key="5">
            <Holiday holidaySubmit={holidaySubmit} />
          </TabPane>
        </Tabs>
      </Drawer>
    </div>
  );
};

export default BookingInfo;
