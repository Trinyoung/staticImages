/*
 * @Author: your name
 * @Date: 2020-12-21 09:06:37
 * @LastEditTime: 2021-04-25 13:41:53
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \staticImages\config\config.dev.js
 */
const path = require('path')
module.exports = {
    resBaseUrl: 'http://localhost:3000/uploads',
    storeUrl: path.join(__dirname, './static/uploads')
};