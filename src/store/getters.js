const getters = {
  sidebar: state => state.app.sidebar,
  device: state => state.app.device,
  token: state => state.user.token,
  avatar: state => state.user.avatar,
  name: state => state.user.name,
  userId: state => state.user.userId,
  roles: state => state.user.roles,
  accountBalance: state => state.user.accountBalance,
  lastLoginTime: state => state.user.lastLoginTime,
  isReset: state => state.user.isReset,
  review: state => state.user.review,
  btnPage: state => state.permission.btnPage,
  permission_routes: state => state.permission.routers,
  permissionBtn: state => state.permission.permissionBtn
}
export default getters

