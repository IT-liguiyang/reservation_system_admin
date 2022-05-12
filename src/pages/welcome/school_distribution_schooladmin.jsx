/* eslint-disable no-undef */
import React, { useState,useEffect } from 'react';
import {  Line } from '@ant-design/plots';
import { Card, List } from 'antd';
import { useHistory} from 'react-router-dom';

import { reqSystemAnnouncements } from '../../api';

import LinkButton from '../../components/link-button';

import './index.css';

const SchoolDistributionSchoolAdmin = ()=> {
  console.log('SchoolDistributionSchoolAdmin');

  // 获取history对象
  const history = useHistory();

  const [announcementList, setAnnouncementList] = useState([]);

  // 折线图数据
  const data2 = [
    {time:'-15',value:23},
    {time:'-14',value:26},
    {time:'-13',value:17},
    {time:'-12',value:20},
    {time:'-11',value:33},
    {time:'-10',value:37},
    {time:'-9',value:19},
    {time:'-8',value:25},
    {time:'-7',value:42},
    {time:'-6',value:31},
    {time:'-5',value:48},
    {time:'-4',value:32},
    {time:'-3',value:54},
    {time:'-2',value:38},
    {time:'-1',value:44},
    {time:'今日',value:50}
  ];

  const config_line = {
    data:data2,
    padding:'auto',
    xField: 'time',
    yField: 'value',
    style:{width:810,height:170},
  };

  // 获取系统公告
  const getSystemAnnouncements = async () => {
    const result= await reqSystemAnnouncements();
    // 只显示4条
    setAnnouncementList(result.data.slice(0, 4));
  };

  // 如果想执行只运行一次的 effect（仅在组件挂载和卸载时执行），可以传递一个空数组（[]）作为第二个参数
  useEffect(() => {
    getSystemAnnouncements();
  },[]);

  return (
    <div>
      <div className='charts'>
        {/* 折线图 */}
        <Card
          title="过去15天所管理学校的访问量总览"
          headStyle={{color: 'rgba(0,0,0,.45)',fontSize:14,height:20}}
          style={{width:850,height:235}}
          bordered
          hoverable
        >
          <Line {...config_line} />
        </Card>
        {/* 系统公告 */}
        <Card
          title="系统公告"
          headStyle={{color: 'rgba(0,0,0,.45)',fontSize:14,height:20}}
          style={{width:350,height:235}}
          bordered
          hoverable
        >
          <List
            itemLayout="horizontal"
            dataSource={announcementList}
            size='small'
            style={{}}
            renderItem={(item, index) => (
              <List.Item>
                <List.Item.Meta
                  title={<LinkButton style={{color:'#999999'}} onClick={() => history.push('/announcement')} >{index+1}、{item.pub_theme.slice(0, 17)}</LinkButton>}
                />
              </List.Item>
            )}
          />
        </Card>
      </div>
    </div>
  );
};

export default SchoolDistributionSchoolAdmin;