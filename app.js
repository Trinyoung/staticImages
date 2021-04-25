/*
 * @Author: your name
 * @Date: 2020-11-26 18:03:18
 * @LastEditTime: 2021-04-25 13:51:07
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \staticImages\app.js
 */
const express = require('express');
const path = require('path');
const multer = require('multer');
const cookieParser = require('cookie-parser');
const moment = require('moment');
const jwt = require('jsonwebtoken');
const config = require('config');
// const { storeUrl, resBaseUrl } = require(`./config/config.${process.env.NODE_ENV}.js`);
// const { storeUrl, resBaseUrl } = config.get();
const { cacheHelper } = require('./cacheHelper');

const app = express();
app.use(express.static(path.join(__dirname, '/static')));
app.use(cookieParser());
app.post('/api/upload/file', checkAuth, uploadFile);
app.get('/api/hello', checkAuth, function (req, res) {
    res.send('hello world! docker images');
});
// console.log(process.env.NODE_ENV, '环境变量')
async function uploadFile(req, res) {
    let storage = multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, config.get('storeUrl'));
        },
        //上传的文件以 时间(毫秒级) + 原来的名字命名
        filename: function (req, file, cb) {
            cb(null, Date.now() + '-' + file.originalname);
        }
    });
    let upload = multer({
        storage: storage,
        limits: { fileSize: 1024 * 10000 },
        fileFilter: function (req, file, cb) {
            // console.log(file);
            console.info('upload File:', file);
            cb(null, true);
        }
    });
    //传输单个文件的配置
    const resource = 'img';
    let uploadSingle = upload.single(resource);

    uploadSingle(req, res, async (err) => {
        if (err) {
            return res.send({ code: '999', err: err.message });
        }
        // const fullUrl = req.protocol + '://' + req.get('host')
        res.send({ code: '000', result: `${config.get('resBaseUrl')}/${req.file.filename}` });
    });
}
async function checkAuth(req, res, next) {
    console.log('hello')
    let authorization = req.headers.authorization;
    // console.log(config.get)
    console.log(authorization, '=============>')
    if (!authorization) {
        return res.send({ code: '401', message: '没有登录！' });
    }
    authorization = authorization.split(' ')[1];
    const authId = req.cookies.nvwaId;
    try {
        const playLoad = jwt.verify(authorization, authId);
        const now = moment().unix();
        if (now >= playLoad.exp) {
            cacheHelper.del('userInfo', authorization, function (err) {
                if (err) {
                    console.log('删除用户信息出错', err);
                }
                console.log(`清除token ${authorization}成功!`);
            });
            return res.send({ code: '401' });
        }

        cacheHelper.get('userInfo', authorization, function (err, result) {
            if (err) {
                console.log(`获取用户信息出错！`);
                return res.send({ code: '401', err: '获取用户信息出错！' });
            }
            if (!result) return res.send({ code: '401', err: '未找到相关用户信息！' })
            req.user = JSON.stringify(decodeURIComponent(result));
            console.log('获取用户信息成功', result);
            return next();
        });
    } catch (err) {
        console.log('鉴权失败', err);
        return res.send({ code: '401', err });
    }
}
app.listen('3000', () => {
    console.log('server is listening on port: 3000')
});