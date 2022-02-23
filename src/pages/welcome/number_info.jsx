import React, { useState, useEffect } from 'react';
import {
  Card,
  Statistic,
} from 'antd';
import { reqWelcomeInfo } from '../../api';
import './index.less';

const NumberInfo = ()=> {
  const [numberList, setNumberList] = useState([]);

  const getWelcomeInfo = async () => {
    const result = await reqWelcomeInfo();
    setNumberList(result);
  };

  // 如果想执行只运行一次的 effect（仅在组件挂载和卸载时执行），可以传递一个空数组（[]）作为第二个参数
  useEffect(() => {
    getWelcomeInfo();
  },[]);

  const { usersLength } = numberList[0] || [];
  const { schoolsLength } = numberList[1] || [];
  const { announcementsLength } = numberList[2] || [];
  const { newsLength } = numberList[3] || [];
  const { dynamic_sharingsLength } = numberList[4] || [];
  const { opinions_suggestionsLength } = numberList[5] || [];
  const { reservation_infosLength } = numberList[6] || [];
  const { school_adminsLength } = numberList[7] || [];
  const { system_adminsLength } = numberList[8] || [];
  console.log(usersLength);

  return (
    <div className="home-card">
      <Card
        className="home-card-child"
        title="用户总量"
        headStyle={{color: 'rgba(0,0,0,.45)',fontSize:14,height:20}}
        bordered
        hoverable
      >
        <Statistic
          value={usersLength}
          suffix="个"
          valueStyle={{fontSize:13}}
        />
      </Card>
      <Card
        className="home-card-child"
        title="学校总量"
        headStyle={{color: 'rgba(0,0,0,.45)',fontSize:14,height:20}}
        bordered
        hoverable
      >
        <Statistic
          value={schoolsLength}
          suffix="个"
          valueStyle={{fontSize:13}}
        />
      </Card>
      <Card
        className="home-card-child"
        title="公告总量"
        headStyle={{color: 'rgba(0,0,0,.45)',fontSize:14,height:20}}
        bordered
        hoverable
      >
        <Statistic
          value={announcementsLength}
          suffix="条"
          valueStyle={{fontSize:13}}
        />
      </Card>
      <Card
        className="home-card-child"
        title="新闻总量"
        headStyle={{color: 'rgba(0,0,0,.45)',fontSize:14,height:20}}
        bordered
        hoverable
      >
        <Statistic
          value={newsLength}
          suffix="条"
          valueStyle={{fontSize:13}}
        />
      </Card>
      <Card
        className="home-card-child"
        title="用户动态"
        headStyle={{color: 'rgba(0,0,0,.45)',fontSize:14,height:20}}
        bordered
        hoverable
      >
        <Statistic
          value={dynamic_sharingsLength}
          suffix="条"
          valueStyle={{fontSize:13}}
        />
      </Card>
      <Card
        className="home-card-child"
        title="意见建议"
        headStyle={{color: 'rgba(0,0,0,.45)',fontSize:14,height:20}}
        bordered
        hoverable
      >
        <Statistic
          value={opinions_suggestionsLength}
          suffix="条"
          valueStyle={{fontSize:13}}
        />
      </Card>
      <Card
        className="home-card-child"
        title="预约信息"
        headStyle={{color: 'rgba(0,0,0,.45)',fontSize:14,height:20}}
        bordered
        hoverable
      >
        <Statistic
          value={reservation_infosLength}
          suffix="条"
          valueStyle={{fontSize:13}}
        />
      </Card>
      <Card
        className="home-card-child"
        title="系统管理员"
        headStyle={{color: 'rgba(0,0,0,.45)',fontSize:14,height:20,width:125,paddingLeft:21}}
        bordered
        hoverable
      >
        <Statistic
          value={system_adminsLength}
          suffix="个"
          valueStyle={{fontSize:13}}
        />
      </Card>
      <Card
        className="home-card-child"
        title="学校管理员"
        headStyle={{color: 'rgba(0,0,0,.45)',fontSize:14,height:20,width:125,paddingLeft:21}}
        bordered
        hoverable
      >
        <Statistic
          value={school_adminsLength}
          suffix="个"
          valueStyle={{fontSize:13}}
        />
      </Card>
    </div>
  );
};

export default NumberInfo;
