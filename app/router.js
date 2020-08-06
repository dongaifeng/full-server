'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller } = app;
  const jwt = app.middleware.jwt(app);

  router.get('/', controller.home.index);


  router.get('/captcha', controller.utils.captcha);
  router.get('/sendcode', controller.utils.sendcode);
  router.post('/uploadFile', controller.utils.uploadFile);

  router.group({ name: 'user', prefix: '/user' }, router => {
    const { info, login, register, verify } = controller.user;

    router.post('/login', login);
    router.post('/register', register);

    // 使用中间件 验证token
    router.get('/info', jwt, info);
    router.get('/verify', verify);
  });
};
