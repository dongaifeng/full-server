'use strict';

const BaseController = require('./base');

class ArticleController extends BaseController {

  async index() {
    const { ctx } = this;
    // populate 指定哪些字段需要关联查询
    // sort 设置排序
    const lists = await ctx.model.Article.find().populate('author').sort({ createdAt: -1 });
    this.success(lists);
  }

  async create() {
    const { ctx } = this;
    const { _id } = ctx.state;
    const { content, compileContent } = ctx.request.body;

    const title = content.split('\n').find(v => v.indexOf('# ') === 0);

    const obj = {
      title: title.replace('# ', ''),
      article: content, // 内部编辑的时候看的
      article_html: compileContent, // 给外部显示看的
      author: _id,
    };

    const res = await ctx.model.Article.create(obj);
    if (res._id) {
      this.success({
        id: res._id,
        title: res.title,
      });
    } else {
      this.error('创建失败');
    }
  }

  async detail() {
    // 访问量统计
    const { ctx } = this;
    const { id } = ctx.params;
    const article = await ctx.model.Article.findOneAndUpdate({ _id: id }, { $inc: { views: 1 } }).populate('author');
    console.log(article, '<----------------------');
    this.success(article);
  }

}

module.exports = ArticleController;
