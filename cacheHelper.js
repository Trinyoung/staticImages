/*
 * @Author: your name
 * @Date: 2021-04-25 08:46:41
 * @LastEditTime: 2021-04-25 09:01:46
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \staticImages\cacheHelper.js
 */
const redis = require('redis');
const config = require('config');
class CacheHelper {
    // client: RedisClient;
    constructor(password) {
        this.client = redis.createClient(6379, config.get('database.redis.ip'), {});
        if (password) {
            this.client.auth(password);
        }
    }
    put(cacheName, key, value, cb) {
        const str = JSON.stringify(value);
        this.client.hset(cacheName, key, encodeURIComponent(str), cb);
    }

    get(cacheName, key, cb) {
        this.client.hget(cacheName, key, cb);
    }

    del(cacheName, key, cb) {
        this.client.del(cacheName, key, cb);
    }
};
exports.cacheHelper = new CacheHelper();