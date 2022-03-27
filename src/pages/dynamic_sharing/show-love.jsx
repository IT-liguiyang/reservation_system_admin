/* eslint-disable react/prop-types */
import React from 'react';
import PropTypes from 'prop-types';
import { Modal } from 'antd';

// 查看点赞详情
const ShowLove = (props) => {

  console.log(props);

  // 规定接收父元素的数据类型
  ShowLove.propTypes ={
    isShowLove: PropTypes.bool.isRequired,
    loveDetail: PropTypes.object.isRequired,
    handleCloseShowLoveModal:PropTypes.func.isRequired
  };

  // 向父元素传递关闭模态框
  const closeModal = () => {
    props.handleCloseShowLoveModal(false);
  };

  const { isShowLove, loveDetail=[] } = props;
  console.log(loveDetail);
  // const { publisher, pub_time, pub_theme, pub_content } = comment;

  return (
    <Modal
      title='评论详情'
      visible={isShowLove}
      onCancel={closeModal}
      footer={[]}
      style={{userSelect: 'true'}}
    >
      {
        loveDetail.love ? (
          loveDetail.love.map((item, index) => {
            return(
              <div key={index} style={{fontSize:18+'px'}}>{item}</div>
            );
          })
        ):''
      }
    </Modal>
  );
};

export default ShowLove;