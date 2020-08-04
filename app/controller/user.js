const BaseController = require('./base');
const md5 = require('md5');

const HashSalt = 'dfkjhgsldkujr';
const createRule = {
  email: { type: 'email' },
  passwd: { type: 'string' },
  captcha: { type: 'string' },
  nickname: { type: 'string' },
};

class UserController extends BaseController {
  // async login() {

  // }
  async register() {
    const { ctx } = this;
    // 验证参数
    try {
      ctx.validate(createRule);
    } catch (e) {
      return this.error('参数不对', -1, e.errors);
    }

    const { email, passwd, captcha, nickname } = ctx.request.body;

    // 检查验证码
    if (captcha.toUpperCase() === ctx.session.captcha.toUpperCase()) {

      // 检查邮箱重复
      if (await this.checkEmail(email)) {
        this.error('邮箱重复');
      } else {
        // 存储用户信息   密码要加密
        const res = ctx.model.User.create({
          email,
          nickname,
          passwd: md5(passwd + HashSalt),
        });

        if (res._id) { this.message('注册成功'); }
      }


    } else {
      this.error('验证码错误');
    }


    this.success({ name: nickname });
  }

  async checkEmail(email) {
    const user = await this.ctx.model.User.findOne({ email });
    return user;
  }
  // async verify() {

  // }
  // async info() {

  // }
}
module.exports = UserController;
