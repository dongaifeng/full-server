'use strict';

const fse = require('fs-extra');
const path = require('path');

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

  async mergeFile(filePath, size, hash) {
    // 文件碎片的文件夹
    const chunkDir = path.resolve(this.config.UPLOAD_DIR, hash);
    // 读取碎片 成 数组
    let chunks = await fse.readdir(chunkDir);
    // 把碎片 排序
    chunks.sort((a, b) => a.split('-')[1] - b.split('-')[1]);

    // 把碎片的名字 换成 碎片的路径
    chunks = chunks.map(cp => path.resolve(chunkDir, cp));

    // 去把碎片 合并成文件
    await this.mergeChunks(chunks, filePath, size);

  }


  async mergeChunks(chunks, filePath, size) {
    const pipStream = (filePath, writeStream) => new Promise(resolve => {
      const readStream = fse.createReadStream(filePath);
      readStream.on('end', () => {
        fse.unlinkSync(filePath);
        resolve();
      });

      readStream.pipe(writeStream);
    });

    const all = chunks.map((file, index) => {
      const writeStream = fse.createWriteStream(filePath, { start: index * size, end: (index + 1) * size });
      return pipStream(file, writeStream);
    });

    await Promise.all(all);


  }

}

module.exports = Tools;
