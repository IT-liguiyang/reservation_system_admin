/* eslint-disable react/react-in-jsx-scope */
import {
  HomeOutlined, 
  ReadOutlined,
  ProfileOutlined,
  ScheduleOutlined,
  GlobalOutlined,
  SolutionOutlined,
  FileTextOutlined,
  UserOutlined,
  TeamOutlined,
  UserSwitchOutlined,
  FileUnknownOutlined,
  CalendarOutlined
} from '@ant-design/icons';

const menuList = [
  {
    title: '首页', // 菜单标题名称
    key: '/home', // 对应的path
    icon: <HomeOutlined />, // 图标名称
    isPublic: true, // 公开的，什么角色都可以看
  },
  {
    title: '学校管理',
    key: '/school',
    icon: <ReadOutlined />
  },
  {
    title: '公告管理',
    key: '/announcement',
    icon: <ProfileOutlined />
  },
  {
    title: '新闻管理',
    key: '/news',
    icon: <ScheduleOutlined />
  },
  {
    title: '动态分享管理',
    key: '/dynamic_sharing',
    icon: <GlobalOutlined />
  },
  {
    title: '意见反馈管理',
    key: '/feedback',
    icon: <SolutionOutlined />
  },
  {
    title: '常见问题管理',
    key: '/common_problems',
    icon: <FileUnknownOutlined />
  },
  {
    title: '预约信息管理',
    key: '/reservation_info',
    icon: <FileTextOutlined />
  },
  {
    title: '用户管理',
    key: '/user',
    icon: <UserOutlined />
  },
  {
    title: '管理员管理',
    key: '/admin',
    icon: <TeamOutlined />,
    children: [
      {
        title: '学校管理员',
        key: '/admin/school_admin',
        icon: <UserOutlined />
      },
      {
        title: '系统管理员',
        key: '/admin/system_admin',
        icon: <UserOutlined />
      }
    ]
  },
  {
    title: '权限管理',
    key: '/role',
    icon: <UserSwitchOutlined />,
    children: [
      {
        title: '学校管理员权限',
        key: '/role/school_admin',
        icon: <UserOutlined />
      },
      {
        title: '系统管理员权限',
        key: '/role/system_admin',
        icon: <UserOutlined />
      }
    ]
  },
  {
    title: '场馆预约设置',
    key: '/booking_info',
    icon: <CalendarOutlined />
  },
];

export default menuList;