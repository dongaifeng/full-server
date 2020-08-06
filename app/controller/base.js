'use strict';

const Controller = require('egg').Controller;

// 定义基本Controller，定义接口返回规范
class BaseController extends Controller {
  success(data) {
    this.ctx.body = {
      code: 0,
      data,
    };
  }

  message(message) {
    this.ctx.body = {
      code: 0,
      message,
    };
  }

  error(message, code = -1, errors = {}) {
    this.ctx.body = {
      code,
      message,
      errors,
    };
  }
}

module.exports = BaseController;
