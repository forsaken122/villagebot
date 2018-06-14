'use strict'
const querystring = require('querystring');
const http = require('http');
const fs = require('fs');
const cheerio = require('cheerio')
const Telegraf = require('telegraf')

const bot = new Telegraf(process.env.TELEGRAM_TOKEN)//)

function postCode(codestring, scope) {
          
          var post_data = querystring.stringify({
              'srcrel' : codestring,
              'cat': 0,
              'page': 1
          });

          var post_options = {
              host: 'tntvillage.scambioetico.org',
              port: '80',
              path: '/src/releaselist.php',
              method: 'POST',
              headers: {
                  'Content-Type': 'application/x-www-form-urlencoded',
                  'Content-Length': Buffer.byteLength(post_data)
              }
          };

          // Set up the request
          var post_req = http.request(post_options, function(res) {
              res.setEncoding('utf8');
              res.on('data', function (chunk) {
                  
                  var html = cheerio.load(chunk)

                  html('tr').each(function(i, elem) {
                    if(i>0){
                      var links = html(this).find('a')
                      var torrentLink = (links.get(0))?links.get(0).attribs.href:undefined;
                      var magnetLink = (links.get(1))?links.get(1).attribs.href:undefined;
                      var text = (links.get(3))?links.get(3).children[0].data:undefined;
                      console.log(text)
                      console.log(magnetLink)
                      console.log(torrentLink)
                      //scope.sendMessage('<a href="'+torrentLink+'">'+text+'</a>', {parse_mode: 'HTML'})
                      scope.replyWithHTML('<a href="'+torrentLink+'">'+text+'</a>')
                    }
                  });

                  //console.log(allTr);
                  
              });
          });

          // post the data
          post_req.write(post_data);
          post_req.end();

    }


bot.start((ctx) => ctx.reply('Welcome'))
bot.help((ctx) => ctx.reply('Send me a sticker'))
bot.on('sticker', (ctx) => ctx.reply('👍'))
bot.hears('hi', (ctx) => postCode("ping",ctx))
bot.hears(/buy/i, (ctx) => ctx.reply('Buy-buy'))

bot.startPolling()
/*
const Telegram = require('telegram-node-bot')
const TelegramBaseController = Telegram.TelegramBaseController
const TextCommand = Telegram.TextCommand
const port = process.env.PORT || 443,
    host = '0.0.0.0',  // probably this change is not required
    externalUrl = process.env.CUSTOM_ENV_VARIABLE || 'https://villagetorrentbot.herokuapp.com',
    token = process.env.TOKEN
const tg = new Telegram.Telegram(process.env.TELEGRAM_TOKEN, { webHook: { port : port, host : host } });

const querystring = require('querystring');
const http = require('http');
const fs = require('fs');
const cheerio = require('cheerio')


class PingController extends TelegramBaseController {
    
    pingHandler($) {
    	
        console.log($.message.text)
        this._postCode($.message.text, $)
        //$.sendMessage('pong' , {parse_mode: 'HTML'})
    }

    get routes() {
        return {
            'pingCommand': 'pingHandler'
        }
    }

    _postCode(codestring, scope) {
          
          var post_data = querystring.stringify({
              'srcrel' : codestring,
              'cat': 0,
              'page': 1
          });

          var post_options = {
              host: 'tntvillage.scambioetico.org',
              port: '80',
              path: '/src/releaselist.php',
              method: 'POST',
              headers: {
                  'Content-Type': 'application/x-www-form-urlencoded',
                  'Content-Length': Buffer.byteLength(post_data)
              }
          };

          // Set up the request
          var post_req = http.request(post_options, function(res) {
              res.setEncoding('utf8');
              res.on('data', function (chunk) {
                  
                  var html = cheerio.load(chunk)

                  html('tr').each(function(i, elem) {
                    if(i>0){
                      var links = html(this).find('a')
                      var torrentLink = (links.get(0))?links.get(0).attribs.href:undefined;
                      var magnetLink = (links.get(1))?links.get(1).attribs.href:undefined;
                      var text = (links.get(3))?links.get(3).children[0].data:undefined;
                      console.log(text)
                      console.log(magnetLink)
                      console.log(torrentLink)
                      scope.sendMessage('<a href="'+torrentLink+'">'+text+'</a>', {parse_mode: 'HTML'})
                    }
                  });

                  //console.log(allTr);
                  
              });
          });

          // post the data
          post_req.write(post_data);
          post_req.end();

    }
}

tg.router
    .when(
        new TextCommand('ping', 'pingCommand'),
        new PingController()
    )

*/