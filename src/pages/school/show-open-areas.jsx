import React from 'react';
import PropTypes from 'prop-types';
import { Modal, Table } from 'antd';

const ShowOpenAreas = (props) => {

  // 规定接收父元素的数据类型
  ShowOpenAreas.propTypes ={
    isShowOpenAreas: PropTypes.bool.isRequired,
    openAreasDetail: PropTypes.array.isRequired,
    handleCloseShowOpenAreasModal:PropTypes.func.isRequired
  };

  console.log(props);

  // 向父元素传递关闭模态框
  const closeModal = () => {
    props.handleCloseShowOpenAreasModal(false);
  };

  const columns = [
    {
      title: '开放区域',
      width: 100,
      dataIndex: 'open_area',
    },
    {
      title: '容纳人数',
      width: 100,
      dataIndex: 'amount',
    }
  ];

  const { isShowOpenAreas, openAreasDetail } = props;

  return (
    <Modal
      title='开放区域'
      visible={isShowOpenAreas}
      onCancel={closeModal}
      footer={[]}
    >
      <Table
        bordered
        rowKey={1}
        dataSource={openAreasDetail}
        columns={columns}
      />
    </Modal>
  );
};

export default ShowOpenAreas;