require("dotenv").config();

const TelegramBot = require("telebot");

const summarizer = require("./nodejs-text-summarizer");
const quora = require("./quora-api");

const bot = new TelegramBot({ token: process.env.BOT_TOKEN });
bot.start();

let expectQuestion = false;

const sendMessage = (chatId, msg) => {
  setTimeout(() => {
    bot.sendMessage(chatId, msg);
  }, Math.random() * 1); // TODO: Reset delay
};

bot.on("/ping", msg => {
  bot.sendMessage(msg.chat.id, "pong");
});

bot.on("*", msg => {
  if (msg.text.toLowerCase() === "margus") {
    sendMessage(msg.chat.id, "mnoh?");
    expectQuestion = true;
  } else if (expectQuestion) {
    quora.answer(msg.text.split(" ").join("-")).then(answer => {
      if (answer !== "") {
        if (answer.length > 200) {
          sendMessage(msg.chat.id, summarizer(answer));
        } else {
          sendMessage(msg.chat.id, answer);
        }
      } else {
        sendMessage(msg.chat.id, "No tjaa-a");
      }
    });

    expectQuestion = false;
  } else {
    sendMessage(msg.chat.id, "Install gentoo");
  }
});
