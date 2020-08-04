'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller } = app;
  router.get('/', controller.home.index);


  router.get('/captcha', controller.utils.captcha);

  router.group({ name: 'user', prefix: '/user' }, router => {
    const { info, login, register, verify } = controller.user;

    router.post('/login', login);
    router.post('/register', register);
    router.get('/info', info);
    router.get('/verify', verify);
  });
};
