var express = require('express');
var router = express.Router();

var redis = require('../models/redis');


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.post('/throw',function (req,res,next) {

  //获取post数据
    var body = req.body;
    var {owner,type,content} = body;

    // owner type content 都必须填
    if(!(owner && type && content)){
      return res.json({code:0,msg:"信息不完整"});
    }

    //类型必须填正确
    if(type && ['male','female'].indexOf(type) === -1){
      return res.json({code:0,msg:'类型错误'});
    }

    // 调用扔瓶子的方法
    // 返回 json 数据

    redis.throw(body,function (result) {
        res.json(result);
    })
});

//捡瓶子
router.get('/pick',function (req,res,next) {

  var {user,type} = req.query;

  if(!user){
    return res.json({code:0,msg:'信息不完整'});
  }

  if(!type || ['male','female'].indexOf(type) === -1){
    return res.json({code:0,msg:'类型错误'});
  }

  //调用捞瓶子的方法
  //返回json数据
  redis.pick(req.query,function (result) {
      res.json(result);
  })

});

module.exports = router;
