/* eslint-disable react/prop-types */
import React, { useState, useRef } from 'react';
import {
  Card,
  Form,
  Input,
  Button,
  message,
  Row,
  Col,
  TimePicker,
  Modal,
  Cascader
} from 'antd';

import LinkButton from '../../components/link-button';
import { reqAddSchool } from '../../api';
import { SCHOOL_LIST} from '../../utils/school-list.js';

// 添加学校组件
const SchoolAdd = (props) => {
  const [areaList, setAreaList] = useState([{ open_area: '', amount: '' }]);  // 创建开放区域对应的对象
  const [timeList] = useState([]);  // 创建开放时间对应的列表

  const formElement = useRef(null);

  // 指定Form.Item布局的配置对象
  const formItemLayout = {
    labelCol: { span: 2 },  // 左侧label的宽度
    wrapperCol: { span: 11 }, // 右侧包裹的宽度
  };

  // 头部左侧标题
  const title = (
    <span>
      <LinkButton onClick={() => this.props.history.goBack()}>
        {/* <Icon type='arrow-left' style={{fontSize: 20}}/> */}
      </LinkButton>
      <span>添加学校</span>
    </span>
  );

  const AddSchool = async (values) => {
    const { school, address, areaList } = values;

    console.log(school, address, areaList);
    // 1. 生成学校对象
    const schoolObj = {
      'school': school,
      'address': address,
      'open_areas': areaList,
      'open_time': [
        {
          'school_day': [ // 教学期间
            { 'saturday': [timeList[0] ? timeList[0].school_day_saturday_am : '' , timeList[1] ? timeList[1].school_day_saturday_pm : ''] },
            { 'sunday': [timeList[2] ? timeList[2].school_day_sunday_am : '', timeList[3] ? timeList[3].school_day_sunday_pm : ''] },
          ]
        },
        {
          'vacation': [                  // 寒暑假
            {
              'workday': [               // 寒暑假 工作日
                timeList[3] ? timeList[4].vacation_workday_am : '',
                timeList[3] ? timeList[5].vacation_workday_pm : '',
              ]
            },
            {
              'saturday': [              // 寒暑假 周六
                timeList[3] ? timeList[6].vacation_saturday_am : '',
                timeList[3] ? timeList[7].vacation_saturday_pm : '',
              ]
            },
            {
              'sunday': [                // 寒暑假 周日
                timeList[3] ? timeList[8].vacation_sunday_am : '',
                timeList[3] ? timeList[9].vacation_sunday_pm : '',
              ]
            },
          ]
        },
        {
          'holiday': [                   // 法定节假日
            timeList[3] ? timeList[10].holiday_am : '',
            timeList[3] ? timeList[11].holiday_pm : ''
          ]
        }
      ]
    };

    // 2. 提交添加的请求
    const result = await reqAddSchool(schoolObj);
    // 3. 更新列表显示
    if (result.status === 0) {
      message.success('添加学校成功！');
      // 确认跳转弹框
      Modal.confirm({
        title: '跳转到学校列表页面?',
        content: '',
        okText: '是',
        okType: 'danger',
        cancelText: '否',
        onOk: () => {
          props.history.goBack(); //跳转至学校列表页面
        },
        onCancel() {
          formElement.current.resetFields(); //留在添加页面并清除输入的信息
        },
      });
    }
    if (result.status === 1) {
      message.error(result.msg);
    }
  };

  // 添加一行开放区域的输入框
  const add = () => {
    // [...areaList, { open_area: '', amount: '' }] 向后面添加一条数据
    formElement.current.setFieldsValue({ 'areaList': [...areaList, { key:areaList.length, open_area: '', amount: '' }] });
    return setAreaList([...areaList, { open_area: '', amount: '' }]);
  };

  // 删除一行开放区域的输入框
  const del = (index) => {
    formElement.current.setFieldsValue({ 'areaList': [...areaList.slice(0, index), ...areaList.slice(index + 1)] });
    return setAreaList([...areaList.slice(0, index), ...areaList.slice(index + 1)]);
  };

  // 开放区域的监听事件
  const onChange = (index, name, event) => {
    let tempArray = [...areaList];
    if ('open_area' === name)
      tempArray[index] = { ...tempArray[index], open_area: event.target.value };
    else
      tempArray[index] = { ...tempArray[index], amount: event.target.value };
    return setAreaList(tempArray);
  };

  /**
   * 生成包含开放区域、容纳人数和删除按钮的行，并绑定相应的监听的函数
   */
  const areaListItem = areaList.map((item, index) => {
    return <Row key={index}>
      <Col span={10}>
        <Form.Item label="开放区域" name={['areaList', index, 'open_area']}><Input onChange={(event) => onChange(index, 'open_area', event)} /></Form.Item>
      </Col>&nbsp;&nbsp;
      <Col span={8}>
        <Form.Item label="容纳人数" name={['areaList', index, 'amount']} ><Input type='number' addonAfter='人' onChange={(event) => onChange(index, 'amount', event)} /></Form.Item>
      </Col>
      <Col span={3} offset={1}>
        <Button type="primary" onClick={() => del(index)}>-</Button>
      </Col>
    </Row>;
  });

  /**
   * 建立公共的时间选择函数监听，生成对应的开放时间列表 timeList
   * @param {*} name 为所监听的类名
   * @param {*} value 为监听到的值
   * [name]：作为对象的key，读取name的实际值
   */
  const timePicker = (name, value) => {
    timeList.push({ [name]: value[0].format('HH:mm') + '-' + value[1].format('HH:mm') });
  };

  return (
    <Card title={title}>
      <Form
        {...formItemLayout}
        onFinish={AddSchool}
        ref={formElement}
      >
        <Form.Item 
          name="school"
          label="您的学校"
          rules={[
            {
              required: true,
              message: '请选择您所在的学校!',
            }
          ]}
        >
          <Cascader placeholder='请选择您所在的学校'
            options= {SCHOOL_LIST}
          />
        </Form.Item>
        <Form.Item
          name="address"
          label="详细地址"
          rules={[
            {
              required: true,
              message: '请输入学校地址!',
              whitespace: true,
            },
          ]}
        >
          <Input placeholder='请输入学校地址' />
        </Form.Item>
        <Form.Item
          label="开放区域"
        >
          {areaListItem}
          <Button type="primary" style={{ position: 'absolute', bottom: 15 + 'px', right: 0 + 'px' }} onClick={add}>+</Button>
        </Form.Item>
        <Form.Item
          label="开放时间"
        >
          <Form.Item label="教学期间">
            <Form.Item label="周六">
              上午：<TimePicker.RangePicker format='HH:mm' name='school_day_saturday_am' onChange={(value) => timePicker('school_day_saturday_am', value)} style={{ width: 150 + 'px' }} />&nbsp;
              下午：<TimePicker.RangePicker format='HH:mm' name='school_day_saturday_pm' onChange={(value) => timePicker('school_day_saturday_pm', value)} style={{ width: 150 + 'px' }} />
            </Form.Item>
            <Form.Item label="周日">
              上午：<TimePicker.RangePicker format='HH:mm' name='school_day_sunday_am' onChange={(value) => timePicker('school_day_sunday_am', value)} style={{ width: 150 + 'px' }} />&nbsp;
              下午：<TimePicker.RangePicker format='HH:mm' name='school_day_sunday_pm' onChange={(value) => timePicker('school_day_sunday_pm', value)} style={{ width: 150 + 'px' }} />
            </Form.Item>
          </Form.Item>
          <Form.Item label="寒暑假">
            <Form.Item label="工作日">
              上午：<TimePicker.RangePicker format='HH:mm' name='vacation_workday_am' onChange={(value) => timePicker('vacation_workday_am', value)} style={{ width: 150 + 'px' }} />&nbsp;
              下午：<TimePicker.RangePicker format='HH:mm' name='vacation_workday_pm' onChange={(value) => timePicker('vacation_workday_pm', value)} style={{ width: 150 + 'px' }} />
            </Form.Item>
          </Form.Item>
          <Form.Item label="寒暑假">
            <Form.Item label="周&nbsp;&nbsp;&nbsp;&nbsp;六">
              上午：<TimePicker.RangePicker format='HH:mm' name='vacation_saturday_am' onChange={(value) => timePicker('vacation_saturday_am', value)} style={{ width: 150 + 'px' }} />&nbsp;
              下午：<TimePicker.RangePicker format='HH:mm' name='vacation_saturday_pm' onChange={(value) => timePicker('vacation_saturday_pm', value)} style={{ width: 150 + 'px' }} />
            </Form.Item>
            <Form.Item label="周&nbsp;&nbsp;&nbsp;&nbsp;日">
              上午：<TimePicker.RangePicker format='HH:mm' name='vacation_sunday_am' onChange={(value) => timePicker('vacation_sunday_am', value)} style={{ width: 150 + 'px' }} />&nbsp;
              下午：<TimePicker.RangePicker format='HH:mm' name='vacation_sunday_pm' onChange={(value) => timePicker('vacation_sunday_pm', value)} style={{ width: 150 + 'px' }} />
            </Form.Item>
          </Form.Item>
          <Form.Item label="法定节假日">
            <Form.Item label="">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
              上午：<TimePicker.RangePicker format='HH:mm' name='holiday_am' onChange={(value) => timePicker('holiday_am', value)} style={{ width: 150 + 'px' }} />&nbsp;
              下午：<TimePicker.RangePicker format='HH:mm' name='holiday_pm' onChange={(value) => timePicker('holiday_pm', value)} style={{ width: 150 + 'px' }} />
            </Form.Item>
          </Form.Item>
        </Form.Item>
        <Form.Item>
          <Button type='primary' htmlType="submit">提交</Button>
          <Button type='primary' style={{marginLeft:50+'px'}} onClick={() => props.history.push('/school')}>返回</Button>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default SchoolAdd;