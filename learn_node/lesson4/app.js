var express = require('express');var superagent = require('superagent');var cheerio = require('cheerio');var eventproxy = require('eventproxy');var app = express();var url = require('url');var cnodeUrl = 'https://cnodejs.org';//获取cnode 所有的主题的url;superagent.get(cnodeUrl)    .end((err,sres)=>{        if(err) return console.log(err);        var topicUrls = [];        var $ = cheerio.load(sres.text);        $('#topic_list .topic_title').each((idx,el)=>{           var $el = $(el);            // $element.attr('href') 本来的样子是 /topic/542acd7d5d28233425538b04            // 我们用 url.resolve 来自动推断出完整 url，变成            // https://cnodejs.org/topic/542acd7d5d28233425538b04 的形式            // 具体请看 http://nodejs.org/api/url.html#url_url_resolve_from_to 的示例           var href = url.resolve(cnodeUrl,$el.attr('href'));           topicUrls.push(href);        });        // console.log(topicUrls);        var ep = new eventproxy();        ep.after('topic_html',topicUrls.length,function (topics) {            topics =topics.map((topicPair)=>{                var topicUrl = topicPair[0];                var topicHtml = topicPair[1];                var $ = cheerio.load(topicHtml);                return ({                    title: $('.topic_full_title').text().trim(),                    href:topicUrl,                    comment1: $('.reply_content').eq(0).text().trim(),                })            });            console.log('final: ');            console.log(topics);        });        topicUrls.forEach((topicUrl)=>{            superagent.get(topicUrl)                .end((err,res)=>{                    ep.emit('topic_html',[topicUrl,res.text])                })        });    });//eventproxy 是个技术器的作用//它来帮你管理到底这些异步操作是否完成，// 完成之后，它会自动调用你提供的处理函数，// 并将抓取到的数据当参数传过来/** 关于网络爬虫，其实有一个爬虫协议，它告诉搜索爬虫哪些页面可以抓取，* 哪些页面不能抓取。请你自己查找相关内容进行了解。** *//** 爬取的部分链接失效，service 503;* */