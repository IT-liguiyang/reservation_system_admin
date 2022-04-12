import React, { useState, useRef } from 'react';
import PropTypes from 'prop-types';

import { 
  Button, 
  Form, 
  TimePicker,  
  Row,
  Col,
  Input,
} from 'antd';

// 法定节假日
const Holiday = (props) => {

  // 规定接收父元素的数据类型
  Holiday.propTypes ={
    holidaySubmit:PropTypes.func.isRequired
  };

  const [ areaList, setAreaList ] = useState([{ open_area: '', amount: '' }]);  // 创建开放区域对应的对象

  const formElement = useRef(null);

  const formItemLayout = {
    labelCol: {
      xs: { span: 24 },
      sm: { span: 8 },
    },
    wrapperCol: {
      xs: { span: 24 },
      sm: { span: 16 },
    },
  };

  var holidayList_from_child = [];

  const onFinish = (fieldsValue) => {

    const am = fieldsValue['am'] || false;
    const pm = fieldsValue['pm'] || false;

    const timeList = [];  // 存放 开放时段 的列表

    if(am){
      timeList.push([am[0].format('H:mm'), am[1].format('H:mm')]);
    }
    if(pm){
      timeList.push([pm[0].format('H:mm'), pm[1].format('H:mm')]);
    }
    console.log('Received values of form: ', timeList, areaList);
    holidayList_from_child = [timeList, areaList];
    console.log(holidayList_from_child);
    props.holidaySubmit(holidayList_from_child);
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
    return <Row style={{width:500+'px'}} key={index}>
      <Col span={10}>
        <Form.Item label={'开放区域'+(parseInt(index)+1)} name={['areaList', index, 'open_area']}><Input onChange={(event) => onChange(index, 'open_area', event)} /></Form.Item>
      </Col>&nbsp;&nbsp;
      <Col span={8}>
        <Form.Item label="容纳人数" name={['areaList', index, 'amount']} ><Input type='number' addonAfter='人' onChange={(event) => onChange(index, 'amount', event)} /></Form.Item>
      </Col>
      <Col span={3} offset={1}>
        <Button type="primary" onClick={() => del(index)}>-</Button>
      </Col>
    </Row>;
  });

  return (
    <div>
      <Form {...formItemLayout} ref={formElement} onFinish={onFinish}>
        <span>设置开放时段：</span>
        <Form.Item name='am' label='上午'>
          <TimePicker.RangePicker format='HH:mm'/>
        </Form.Item>
        <Form.Item name='pm' label='下午'>
          <TimePicker.RangePicker format='HH:mm'/>
        </Form.Item>
        <span>设置开放区域：</span>
        <Form.Item>
          {areaListItem}
          <Button type="primary" style={{ position: 'absolute', bottom: 15 + 'px', right: -140 + 'px' }} onClick={add}>+</Button>
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit">提交</Button>
        </Form.Item>
      </Form>
    </div>
    
  );
};

export default Holiday;