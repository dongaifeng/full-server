'use strict';

/** @type Egg.EggPlugin */
// module.exports = {
//   // had enabled by egg
//   // static: {
//   //   enable: true,
//   // }
// };

exports.mongoose = {
  enable: true,
  package: 'egg-mongoose',
};

exports.routerGroup = {
  enable: true,
  package: 'egg-router-group',
};

exports.validate = {
  enable: true,
  package: 'egg-validate',
};

exports.md5 = {
  enable: true,
  package: 'md5',
};

exports.jwt = {
  enable: true,
  package: 'jsonwebtoken',
};
