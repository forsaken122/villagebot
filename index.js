'use strict'

const Telegram = require('telegram-node-bot')
const TelegramBaseController = Telegram.TelegramBaseController
const TextCommand = Telegram.TextCommand
const tg = new Telegram.Telegram('')

const querystring = require('querystring');
const http = require('http');
const fs = require('fs');
const cheerio = require('cheerio')


class PingController extends TelegramBaseController {
    /**
     * @param {Scope} $
     */
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
          // Build the post string from an object
          var post_data = querystring.stringify({
              'srcrel' : codestring,
              'cat': 0,
              'page': 1
          });

          // An object of options to indicate where to post to
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
                  console.log('Response: ' + chunk);
                  var html = cheerio.load(chunk);
                  scope.sendMessage(html('tr').html() , {parse_mode: 'HTML'})
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