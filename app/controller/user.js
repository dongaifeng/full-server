'use strict';

const BaseController = require('./base');
const md5 = require('md5');
const jwt = require('jsonwebtoken');

const HashSalt = 'dfkjhgsldkujr';
const createRule = {
  email: { type: 'email' },
  passwd: { type: 'string' },
  captcha: { type: 'string' },
  nickname: { type: 'string' },
};

class UserController extends BaseController {
  async login() {
    const { ctx, app } = this;

    // 拿到 用户名 密码
    const { passwd, email, captcha, emailcode } = ctx.request.body;
    // 验证 验证码
    if (captcha.toUpperCase() !== ctx.session.captcha.toUpperCase()) {
      return this.error('验证码错误');
    }
    if (emailcode !== ctx.session.emailcode) {
      return this.error('邮箱验证码错误');
    }
    // 从数据库 读取用户
    const user = await ctx.model.User.findOne({ email, passwd: md5(passwd + HashSalt) });
    // 把用户信息 加密成token 返回
    if (!user) return this.error('用户不存在');

    const token = jwt.sign({ _id: user._id, email, nickname: user.nickname }, app.config.jwt.secret, { expiresIn: '1h' });
    this.success({ token, nickname: user.nickname, email });
  }

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

  async verify() {
    const { ctx } = this;
    this.success({
      res: ctx.request.body,
    });
  }

  async info() {
    const { ctx } = this;
    const { email } = ctx.state;
    // console.log(ctx.state, _id);
    // const res = await ctx.model.User.findOne({ _id });
    const res = await this.checkEmail(email);
    // console.log(res);
    this.success(res);
    // this.success({avatar: res.avatar, email: res.email, nickname: res.nickname});

  }

  // 获取 关注状态
  async isfollow() {
    const { ctx } = this;
    const { id } = ctx.params;
    const { _id } = ctx.state;

    const me = await ctx.model.User.findById(_id);
    const isFollow = await !!me.following.find(item => item.toString() === id);
    this.success({ isFollow });
  }

  // 关注用户
  async follow() {
    const { ctx } = this;
    const { id } = ctx.params;
    const { _id } = ctx.state;

    const me = await ctx.model.User.findById(_id);
    const isFollow = await !!me.following.find(id => id.toString === id);
    if (!isFollow) {
      me.following.push(id);
      me.save();
      this.success('关注成功');
    }
  }
  // 取消关注
  async cancelFollow() {
    const { ctx } = this;
    const { _id } = ctx.state; // 本用户id
    const { id } = ctx.params; // 文章作者id；

    const me = await ctx.model.User.findById(_id);
    const index = me.following.map(item => item.toString()).indexOf(id);
    if (index > -1) {
      me.following.splice(index, 1);
      me.save();
      this.message('取消成功');
    }
  }

  // 获取喜欢 文章 状态
  async articleStatus() {
    const { ctx } = this;
    const { _id } = ctx.state;
    const { id } = ctx.params; // 文章id

    const me = await ctx.model.User.findById(_id);
    const like = !!me.likeArticle.find(i => i.toString() === id);
    const disLikeArticle = !!me.disLikeArticle.find(i => i.toString() === id);

    this.success({
      like, disLikeArticle,
    });
  }

  // 点赞文章
  async likeArticle() {
    const { ctx } = this;
    const { _id } = ctx.state;
    const { id } = ctx.params; // 文章id

    const me = await ctx.model.User.findById(_id);

    if (!me.likeArticle.find(i => i.toString() === id)) {
      me.likeArticle.push(id);
      console.log('<----------------->', me);
      me.save();
      await ctx.model.Article.findByIdAndUpdate(id, { $inc: { like: 1 } });
      return this.message('点赞成功');
    }
  }

  // 取消点赞
  async cancelLikeArticle() {
    const { ctx } = this;
    const { _id } = ctx.state;
    const { id } = ctx.params; // 文章id

    const me = await ctx.model.User.findById(_id);
    const ind = me.likeArticle.map(i => i.toString()).indexOf(id);
    if (ind > -1) {
      me.likeArticle.splice(ind, 1);
      me.save();
      await ctx.model.Article.findByIdAndDelete(id, { $inc: { like: -1 } });
      return this.message('取消点赞成功');
    }
  }
}
module.exports = UserController;
