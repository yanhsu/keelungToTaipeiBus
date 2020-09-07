const linebot = require('linebot');
const express = require('express');
const bus = require('./bus/route');
// const models = require('./models');
const config = require('config');
// const Service = require('./services');
const https = require("https");
// const cron = require('node-cron');
// const NodeCache = require('node-cache');
// const myCache = new NodeCache();
// global.Service = new Service();
const { channelId, channelAccessToken, channelSecret} = config;
const { formatQuickReply, formatEstimatedTimeOfArrival,formatBusFlexMessage, formatFlexMessage } = require('./util/common');

// setInterval(function() {
//   https.get("https://taichungbus.herokuapp.com/");
//   console.log("get success");
// }, 600001);

let bot = linebot({
    channelId: process.env.ChannelId,
    channelSecret: process.env.ChannelSecret ,
    channelAccessToken: process.env.ChannelAccessToken
});

 
var start = {};//查詢是否開始
var step = {};//查詢到第幾個步驟了
var searchRoute = {}; // 查詢路線
var searchDirection = {} // 查詢方向
var searchStop = {}; // 查詢站點
var favoriteId = {}; // 常用站牌ID
var branch = {
  "查詢": 1,
  "設定常用站牌": 2,
  "常用站牌": 5
};
bot.on('message', async function(event) {
    try {
      const senderID = event.source.userId;
      console.log(start[senderID]);
      start[senderID] = 0;
      if (event.message.type = 'text') {
        let msg = event.message.text;
        if(msg == '1550') {
          let res = await  bus.getAllEstimateTimeByRouteIdWithoutDirection(1550);
          console.log(res.data);
          if(res.data.length == 0) {
            await event.reply('API夜間維護中');
          } else {
            let replymsg = formatBusFlexMessage('1550',res.data,"StopName.Zh_tw","StopSequence");
            // console.log(JSON.stringify(replymsg));
            await event.reply(replymsg);
          }
          start[senderID] = 0;
        } else if(msg == '9006') {
          let go = `去程往基隆方向`;
          let back = `回程往台北方向`;
          await event.reply(formatQuickReply("請選擇去程回程",[go,back,"取消查詢"], [go,back,"取消查詢"],'postback', 'buttons'));
          start[senderID] = 1;
        }
      } else {
         await event.reply("輸入錯誤，請重新開始");
         start[senderID] = 0;
      }
    } catch(err) {
      console.log(err);
      await event.reply('發生錯誤，請與偷懶的開發人員連繫');
      start[senderID] = 0;
    }
  });

  bot.on('postback', async function (event) {
    const senderID = event.source.userId;
    let msg = event.postback.data;
     console.log(msg);
    try {
      if(start[senderID] == 1) {
        let direction = 0;
        if(msg.indexOf("回程") >= 0) {
          direction = 1;
        }
        if(msg.indexOf("取消") >= 0) {
          start[senderID] = 0;
          await event.reply("已取消，若要重新查詢請點選選單");
        }
        searchDirection[senderID] = direction;
        console.log("direction = %s", direction);
        // let res = await bus.getStop(searchRoute[senderID], direction);
        let res = await  bus.getAllEstimateTimeByRouteId(9006, direction);
        try {
          await new Promise(function (resolve, reject) {
            try {
              let replymsg = formatBusFlexMessage('9006',res.data,"StopName.Zh_tw","StopSequence");
              // console.log(JSON.stringify(replymsg));
              event.reply(replymsg);
              resolve();
              // step[senderID] = 3;
            } catch (err) {
              reject(err)
            }
          });
          start[senderID] = 0;
        } catch(err) {
          console.log("err => %s", err);
          await event.reply("發生錯誤，請與偷懶的開發人員連繫");
        }
      }
    } catch (error) {
      console.log(error);
    }

 });
  
  const app = express();
  const linebotParser = bot.parser();
  app.post('/', linebotParser);
  
  global.server = app.listen(process.env.PORT || 9006, async function() {
    let port = server.address().port;
    console.log("App now running on port", port);
  });

  // models.sequelize.sync().then(async function() {
  //   /**
  //    * Listen on provided port, on all network interfaces.
  //    */
  //   // server.listen(port, function() {
  //   //   debug('Express server listening on port ' + server.address().port);
  //   // });
  //   // server.on('error', onError);
  //   // server.on('listening', onListening);
  // });