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
  // 上传
  router.post('/uploadFile', controller.utils.uploadFile);
  router.post('/uploadChunks', controller.utils.uploadChunks);
  router.post('/mergeFile', controller.utils.mergeFile);
  router.post('/checkFile', controller.utils.checkFile);

  router.group({ name: 'user', prefix: '/user' }, router => {
    const { info, login, register, verify, isfollow, follow, cancelFollow, articleStatus, likeArticle, cancelLikeArticle } = controller.user;

    router.post('/login', login);
    router.post('/register', register);

    // 使用中间件 验证token
    router.get('/info', jwt, info);
    router.get('/detail', jwt, info);
    router.get('/verify', verify);

    router.get('/follow/:id', jwt, isfollow);
    router.put('/follow/:id', jwt, follow);
    router.delete('/follow/:id', jwt, cancelFollow);

    router.get('/article/:id', jwt, articleStatus);
    router.put('/likeArticle/:id', jwt, likeArticle);
    router.delete('/likeArticle/:id', jwt, cancelLikeArticle);
  });

  router.group({ name: 'article', prefix: '/article' }, router => {
    const { index, create, detail } = controller.article;
    router.get('/', index);
    router.post('/create', jwt, create);
    router.get('/:id', detail);
  });
};
