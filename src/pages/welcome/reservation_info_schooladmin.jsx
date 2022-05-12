/* eslint-disable no-undef */
import React, { useState,useEffect } from 'react';
import { Pie, Area, Line } from '@ant-design/plots';
import { Card } from 'antd';
// import { useHistory} from 'react-router-dom';

import { reqReservationInfoBySchoolName } from '../../api';
import storageUtils from '../../utils/storageUtils';

import './index.css';

const ReservationInfoSchoolAdmin = () => {
  console.log('ReservationInfoSchoolAdmin');
  const [ age1, setAge1 ] = useState([]);
  const [ age2, setAge2 ] = useState([]);
  const [ age3, setAge3 ] = useState([]);
  const [ age4, setAge4 ] = useState([]);
  const [ age5, setAge5 ] = useState([]);
  const [ male, setMale ] = useState([]);
  const [ female, setFemale ] = useState([]);

  // 如果想执行只运行一次的 effect（仅在组件挂载和卸载时执行），可以传递一个空数组（[]）作为第二个参数
  useEffect(() => {
    getAgeDistribution();
    getSexDistribution();
  },[]);

  // 获取年龄分布
  const getAgeDistribution = async () => {
    const temp_age1 = [];  // 5-11
    const temp_age2 = [];  // 12-18
    const temp_age3 = [];  // 19-35
    const temp_age4 = [];  // 36-49
    const temp_age5 = [];  // 50以上
    if(storageUtils.getAdmin().role_id === '1') return;
    const school_name = storageUtils.getAdmin().school[1];
    const result= await reqReservationInfoBySchoolName(school_name);
    // 只显示4条
    // 根据身份证号解析性别和年龄
    result.data.map((item) => {
      const age = getAgeByIDCard(item.ID_number);
      if(age >= 5 && age <= 11){
        temp_age1.push(age); 
      }
      if(age >= 12 && age <= 18){
        temp_age2.push(age); 
      }
      if(age >= 19 && age <= 35){
        temp_age3.push(age); 
      }
      if(age >= 36 && age <= 49){
        temp_age4.push(age); 
      }
      if(age >= 50){
        temp_age5.push(age); 
      }
    });

    setAge1(temp_age1);
    setAge2(temp_age2);
    setAge3(temp_age3);
    setAge4(temp_age4);
    setAge5(temp_age5);
  };

  const getSexDistribution = async () => {
    const temp_male = [];  // 男
    const temp_female = [];  // 女
    if(storageUtils.getAdmin().role_id === '1') return;
    const school_name = storageUtils.getAdmin().school[1];
    const result= await reqReservationInfoBySchoolName(school_name);
    // 只显示4条
    // 根据身份证号解析性别和年龄
    result.data.map((item) => {
      if(getSexByIDCard(item.ID_number) === 'male'){
        temp_male.push('male');
      } else {
        temp_female.push('female');
      }
    });
    setMale(temp_male);
    setFemale(temp_female);
  };

  console.log('age', age1, age2, age3, age4, age5);

  const getAgeByIDCard = (IDCard) => {
    var age = 0,yearBirth,monthBirth,dayBirth;
    //获取用户身份证号码
    var userCard = IDCard;
    //如果身份证号码为undefind则返回空
    if(!userCard){
      return age;
    }
    var reg = /(^\d{15}$)|(^\d{17}([0-9]|X)$)/; //验证身份证号码的正则
    if (reg.test(userCard)) {
      if (userCard.length == 15) {
        var org_birthday = userCard.substring(6, 12);
        //获取出生年月日
        yearBirth = '19' + org_birthday.substring(0, 2);
        monthBirth = org_birthday.substring(2, 4);
        dayBirth = org_birthday.substring(4, 6);
      } else if (userCard.length == 18) {
        //获取出生年月日
        yearBirth = userCard.substring(6,10);
        monthBirth = userCard.substring(10,12);
        dayBirth = userCard.substring(12,14);
          
      }
      //获取当前年月日并计算年龄
      var myDate = new Date();
      var monthNow = myDate.getMonth() + 1;
      var dayNow = myDate.getDate();
      age = myDate.getFullYear() - yearBirth;
      if(monthNow < monthBirth || (monthNow == monthBirth && dayNow < dayBirth)){
        age--;
      }
      //返回年龄
      return age;
    } else {
      return '';
    }
    
  };

  const getSexByIDCard = (IDCard) => {
    if (parseInt(IDCard.substr(16, 1)) % 2 === 1) {
      return 'male';
    } else {
      return 'female';
    }
  };

  // 折线图-预约率走势
  const data_line = [
    {time:'-6',value:3},
    {time:'-5',value:5},
    {time:'-4',value:13},
    {time:'-3',value:8},
    {time:'-2',value:10},
    {time:'-1',value:8},
    {time:'今日',value:23}
  ];

  // 折线图配置-预约率走势
  const config_line = {
    data:data_line,
    padding:'auto',
    xField: 'time',
    yField: 'value',
    style:{width:500,height:170},
  };

  // 饼图-年龄分布
  const data_pie = [
    {type:'5-11',value: 1 + age1.length},
    {type:'12-18',value: 1 + age2.length},
    {type:'19-35',value: 1 + age3.length},
    {type:'36-49',value: 1 + age4.length},
    {type:'50以上',value: 1 + age5.length},
  ];

  // 饼图配置-年龄分布
  const config_pie = {
    data:data_pie,
    appendPadding:10,
    angleField:'value',
    colorField:'type',
    radius:0.9,
    width:400,
    height:500,
    style:{width:250,height:170},
    label:{
      type:'inner',
      offset:'-30%',
      content:({percent})=>`${(percent * 100).toFixed(0)}%`,
      style:{
        fontSize:14,
        textAlign:'center'
      }
    },
    interactions:[
      {type:'element-active'}
    ]
    
  };

  // 面积图-性别分布
  const data_area = [
    {
      'sex': 'male',
      'month': 'Jan',
      'value': male.length
    },
    {
      'sex': 'male',
      'month': 'Feb',
      'value': male.length
    },
    {
      'sex': 'male',
      'month': 'Mar',
      'value': male.length
    },
    {
      'sex': 'male',
      'month': 'Apr',
      'value': male.length
    },
    {
      'sex': 'male',
      'month': 'May',
      'value': male.length
    },
    {
      'sex': 'male',
      'month': 'Jun',
      'value': male.length
    },
    {
      'sex': 'female',
      'month': 'Jan',
      'value': female.length
    },
    {
      'sex': 'female',
      'month': 'Feb',
      'value': female.length
    },
    {
      'sex': 'female',
      'month': 'Mar',
      'value': female.length
    },
    {
      'sex': 'female',
      'month': 'Apr',
      'value': female.length
    },
    {
      'sex': 'female',
      'month': 'May',
      'value': female.length
    },
    {
      'sex': 'female',
      'month': 'Jun',
      'value': female.length
    },
  ];

  // 面积图-性别分布
  const config_area = {
    data:data_area,
    appendPadding:10,
    xField:'month',
    yField:'value',
    seriesField: 'sex',
    radius:0.9,
    width:340,
    height:500,
    color: ['#00ffcc', '#ff9999'],
    style:{width:250,height:170},
    areaStyle: {
      fillOpacity: 0.7
    },
    isPercent: true,
    yAxis: {
      label: {
        formatter: (value) => {
          return value * 100;
        }
      }
    }
  };

  return (
    <div>
      <div className='charts'>
        <Card
          title="过去一周预约率走势（%）"
          headStyle={{color: 'rgba(0,0,0,.45)',fontSize:14,height:20}}
          style={{width:550,height:235}}
          bordered
          hoverable
        >
          <Line {...config_line} />
        </Card>
        {/* 饼状图 */}
        <Card
          title="所管理学校的预约人 性别分布情况"
          headStyle={{color: 'rgba(0,0,0,.45)',fontSize:14,height:20}}
          style={{width:320}}
          bordered
          hoverable
        >
          <Area {...config_area} />
        </Card>
        <Card
          title="所管理学校的预约人 年龄分布情况"
          headStyle={{color: 'rgba(0,0,0,.45)',fontSize:14,height:20}}
          style={{width:350}}
          bordered
          hoverable
        >
          <Pie {...config_pie} />
        </Card>
      </div>
    </div>
    
  );
};

export default ReservationInfoSchoolAdmin;