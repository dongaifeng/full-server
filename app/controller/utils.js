'use strict';

const BaseController = require('./base');
const svgCaptcha = require('svg-captcha');
const fse = require('fs-extra');

class UtilController extends BaseController {
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

  async sendcode() {
    const { ctx } = this;
    const email = ctx.query.email;

    // 生成随机数 保存到session里
    const code = Math.random().toString().slice(2, 6);
    ctx.session.emailcode = code;

    const obj = {
      to: email,
      subject: '我的验证码',
      text: '哈哈哈',
      html: '<h1>小凯社区</h1><div>' + code + '</div>',
    };

    console.log('邮箱验证码', code);
    const hasSend = await this.service.tools.sendemail(obj);

    if (hasSend) {
      this.message('发送成功');
    } else {
      this.error('发送失败');
    }
  }

  async uploadFile() {

    const { ctx } = this;

    // 拿到这个文件
    const file = ctx.request.files[0];
    console.log('file---------------------->', file);
    console.log('ctx.request---------------------->', ctx.request.body);
    // const { name } = ctx.request.body;

    // 存到public目录
    await fse.move(file.filepath, this.config.UPLOAD_DIR + '/' + file.filename);
    this.success({
      url: `/public/${file.filename}`,
    });

  }
}

module.exports = UtilController;
