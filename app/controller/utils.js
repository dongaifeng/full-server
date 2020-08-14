'use strict';

const BaseController = require('./base');
const svgCaptcha = require('svg-captcha');
const fse = require('fs-extra');
const path = require('path');

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

  // 文件合并
  async mergeFile() {
    const { ext, hash, size } = this.ctx.request.body;
    const filePath = path.resolve(this.config.UPLOAD_DIR, `${hash}.${ext}`);
    await this.service.tools.mergeFile(filePath, size, hash);
    this.success({
      url: '/public/' + hash + '.' + ext,
    });
  }


  // 上传碎片
  async uploadChunks() {

    // if (Math.random() > 0.8) {
    //   return this.ctx.status = 500;
    // }

    const { ctx } = this;

    // 拿到这个文件
    const file = ctx.request.files[0];
    const { name, hash } = ctx.request.body;

    // 以hash为文件夹的名字 存储文件碎片
    const chunkPath = path.resolve(this.config.UPLOAD_DIR, hash);
    // 文件碎片的目录
    // const filePath = path.resolve(this.config.UPLOAD_DIR, hash);

    // 判断有没有这个路径  没有就去创建
    if (!fse.existsSync(chunkPath)) {
      await fse.mkdir(chunkPath);
    }

    console.log('------------>', file, `${chunkPath}/${name}`);

    // 把临时的文件 存到public目录
    await fse.move(file.filepath, `${chunkPath}/${name}`);
    this.success({
      url: `/public/${chunkPath}/${name}`,
    });

  }

  async checkFile() {
    const { hash, ext } = this.ctx.request.body;
    const filePath = path.resolve(this.config.UPLOAD_DIR, `${hash}.${ext}`);

    console.log('---------------->', filePath, fse.existsSync(filePath));
    // const filePath = path.resolve(this.config.UPLOAD_DIR, )
    let uploaded = false;
    let uploadList = [];

    // 获取 hash 名称的文件，如果有就是上传了 uploaded = true
    // 如果没有 就是 uploaded = false， 再把 hash 文件夹下的碎片列表返回，没有碎片 就是 空数组
    if (fse.existsSync(filePath)) {
      uploaded = true;
    } else {
      uploadList = await this.getUploadList(hash);
    }

    this.success({
      uploaded, uploadList,
    });
  }

  async getUploadList(hash) {
    const dir = path.resolve(this.config.UPLOAD_DIR, hash);
    return fse.existsSync(dir) ? (await fse.readdir(dir)).filter(i => i[0] !== '.') : [];
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
