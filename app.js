/*
 * @Author: your name
 * @Date: 2020-11-26 18:03:18
 * @LastEditTime: 2020-12-21 08:55:55
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \staticImages\app.js
 */
const express = require('express');
const app = express();
const fs = require('fs');
const path = require('path');
const multer = require('multer');
const url = require('url');
// app.use('/upload');
app.use(express.static(path.join(__dirname, '/static')));
app.post('/api/upload/file', uploadFile);
// express.static()
async function uploadFile (req, res) {
    let storage = multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, path.join(__dirname, '/static/uploads'));
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
            return res.send({code: '999', err: err.message});
        }
        // const fullUrl = req.protocol + '://' + req.get('host')
        res.send({code: '000', result: `/images/uploads/${req.file.filename}`});
    });
}
app.listen('3000', ()=> {
    console.log('server is listening on port: 3000')
});