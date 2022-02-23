/* eslint-disable react/prop-types */
import React from 'react';
import PropTypes from 'prop-types';
import { Modal } from 'antd';

const ShowComment = (props) => {

  console.log(props);

  // 规定接收父元素的数据类型
  ShowComment.propTypes ={
    isShowComment: PropTypes.bool.isRequired,
    commentDetail: PropTypes.object.isRequired,
    handleCloseShowCommentModal:PropTypes.func.isRequired
  };

  // 向父元素传递关闭模态框
  const closeModal = () => {
    props.handleCloseShowCommentModal(false);
  };

  const { isShowComment, commentDetail } = props;
  console.log(commentDetail);
  // const { publisher, pub_time, pub_theme, pub_content } = comment;

  return (
    <Modal
      title='评论详情'
      visible={isShowComment}
      onCancel={closeModal}
      footer={[]}
      style={{userSelect: 'true'}}
    >
      {/* <Button type='primary' onClick={() => history.push('/dynamic_sharing/add_comment')}>
        添加评论
      </Button> */}
      {/* <h2 style={{fontSize:25+'px'}}>{pub_theme}</h2>
      <span dangerouslySetInnerHTML={{__html: pub_content}}></span>
      <div style={{position:'absolute', right:30+'px', bottom:20+'px'}}>
        <span>发布人：{publisher}</span> <br/>
        <span>发布时间：{pub_time}</span>
      </div> */}
    </Modal>
  );
};

export default ShowComment;