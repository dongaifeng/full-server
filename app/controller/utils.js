'use strict';

const Controller = require('egg').Controller;
const svgCaptcha = require('svg-captcha');

class UtilController extends Controller {
  async captcha() {

    const { ctx } = this;

    const captcha = svgCaptcha.create({
      size: 4,
      fontSize: 50,
      noise: 3,
      color: true,
    });

    this.ctx.session.captcha = captcha.text;
    this.ctx.response.type = 'image/svg+xml';
    console.log(captcha.text);
    ctx.body = captcha.data;
  }
}

module.exports = UtilController;
