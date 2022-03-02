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
  Modal
} from 'antd';

import LinkButton from '../../components/link-button';
import PicturesWall from '../../utils/pictures-wall';
import RichTextEditor from '../../utils/rich-text-editor';

import { reqUpdateSchool } from '../../api';

// 更新学校信息组件
const SchoolUpdate = (props) => {
  const schoolObj = props.location.state || {};  // 获取一行学校对象 schoolObj
  const { _id, school, address, telephone, image, introduce, traffic_guidance, reservation_notice } = schoolObj;
  const schoolId = _id;
  console.log(schoolObj,_id);

  const [ areaList, setAreaList ] = useState([{ open_area: '', amount: '' }]);  // 创建开放区域对应的对象
  const [ timeList ] = useState([]);  // 创建开放时间对应的列表

  const formElement = useRef(null);

  const imageUpload = React.createRef();  // 得到图片上传对象
  const introduceText = React.createRef();  // 得到 学校介绍 富文本输入框对象
  const reservation_noticeText = React.createRef();  // 得到 预定须知 富文本输入框对象

  // 指定Form.Item布局的配置对象
  const formItemLayout = {
    labelCol: { span: 2 },  // 左侧label的宽度
    wrapperCol: { span: 11 }, // 右侧包裹的宽度
  };

  // 头部左侧标题
  const title = (
    <span>
      <LinkButton onClick={() => this.props.history.goBack()}>
      </LinkButton>
      <span>修改学校信息</span>
    </span>
  );

  const UpdateSchool = async (values) => {
    const {  telephone, address, traffic_guidance, areaList } = values;
    // 1. 生成学校对象
    const schoolObj = {
      'school': [school[0],school[1]],  // 将'区域/学校名称'构造为['区域','学校名称']数组
      'telephone': telephone,
      'image': imageUpload.current? imageUpload.current.getImgs():{},
      'introduce': introduceText.current? introduceText.current.getDetail():{},
      'address': address,
      'traffic_guidance': traffic_guidance,
      'reservation_notice': reservation_noticeText.current? reservation_noticeText.current.getDetail():{},
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
    const result = await reqUpdateSchool({schoolObj, schoolId});
    // 3. 更新列表显示
    if (result.status === 0) {
      message.success('修改学校信息成功！');
      Modal.confirm({
        title: '跳转到学校列表页面?',
        content: '',
        okText: '是',
        okType: 'danger',
        cancelText: '否',
        onOk: () => {
          props.history.goBack();
        },
        onCancel() {
          formElement.current.resetFields();
        },
      });
    }
    if (result.status === 1) {
      message.error(result.msg);
    }
  };

  // 添加一行开放区域的输入框
  const add = () => {
    formElement.current.setFieldsValue({ 'areaList': [...areaList, { open_area: '', amount: '' }] });
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
    // console.log({ [name]: value[0].format('HH:mm') + '-' + value[1].format('HH:mm') });
    // console.log(timeList);
  };

  return (
    <Card title={title}>
      <Form
        {...formItemLayout}
        onFinish={UpdateSchool}
        ref={formElement}
        initialValues={{
          'school': school[0] + '/' + school[1],
          telephone, 
          traffic_guidance, 
          address, 
        }}
      >
        <Form.Item
          name="school"
          label="学校"
        >
          <Input disabled />
        </Form.Item>
        <Form.Item
          name="telephone"
          label="联系电话"
          rules={[
            {
              required: true,
              message: '请输入学校联系电话!',
              whitespace: true,
            },
          ]}
        >
          <Input placeholder='请输入学校联系电话' />
        </Form.Item>
        <Form.Item 
          label="学校图片"
        >
          <PicturesWall ref={imageUpload} imgs={image}/>
        </Form.Item>
        <Form.Item label="学校介绍" labelCol={{span: 2}} wrapperCol={{span: 20}}>
          <RichTextEditor ref={introduceText} detail={introduce}/>
        </Form.Item>
        <Form.Item
          name="address"
          label="学校地址"
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
          name="traffic_guidance"
          label="交通指引"
          rules={[
            {
              required: true,
              message: '请输入学校交通指引!',
              whitespace: true,
            },
          ]}
        >
          <Input placeholder='请输入学校交通指引' />
        </Form.Item>
        <Form.Item label="预约须知" labelCol={{span: 2}} wrapperCol={{span: 20}}>
          <RichTextEditor ref={reservation_noticeText} detail={reservation_notice}/>
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

export default SchoolUpdate;