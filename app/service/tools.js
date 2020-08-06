'use strict';

const Service = require('egg').Service;
const nodemailer = require('nodemailer');

const myEmail = '18501171401@163.com';
const transporter = nodemailer.createTransport({
  service: '163',
  secureConnection: true,
  auth: {
    user: myEmail,
    pass: '"dongaifeng"',
  },
});

class Tools extends Service {

  async sendemail(obj) {
    try {
      await transporter.sendMail({ ...obj, from: myEmail, cc: myEmail, to: myEmail });
      return true;
    } catch (e) {
      console.log('err', e);
    }
  }
}

module.exports = Tools;
