/*
进行local数据存储管理的工具模块
 */
// eslint-disable-next-line
import store from 'store';
const ADMIN_KEY = 'admin_key';
// const Full_ADMIN_KEY = 'full_admin_key'

// eslint-disable-next-line
export default {
  /*
  保存admin
   */
  saveAdmin (admin) {
    store.set(ADMIN_KEY, admin);
  },

  /*
  读取admin
   */
  getAdmin () {
    return store.get(ADMIN_KEY) || {};
  },

  /*
  删除admin
   */
  removeAdmin () {
    store.remove(ADMIN_KEY);
  },

  // /*
  //   保存登录用户的完整信息
  //    */
  //   saveFullAdminInfo (adminInfo) {
  //     store.set(Full_ADMIN_KEY, adminInfo)
  //   },

  //   /*
  //   读取admin
  //    */
  //   getFullAdminInfo () {
  //     return store.get(Full_ADMIN_KEY) || {}
  //   },

  //   /*
  //   删除admin
  //    */
  //   removeFullAdminInfo () {
  //     store.remove(Full_ADMIN_KEY)
  //   }

};