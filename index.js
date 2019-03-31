require("dotenv").config();

const TelegramBot = require("telebot");
const _ = require("lodash");

const summarizer = require("./nodejs-text-summarizer");
const quora = require("./quora-api");

const data = require("./data/parsed.json");

const bot = new TelegramBot({ token: process.env.BOT_TOKEN });
bot.start();

let expectQuestion = false;

const sendMessage = (chatId, msg) => {
  setTimeout(() => {
    bot.sendMessage(chatId, msg);
  }, Math.random() * 5000);
};

bot.on("/ping", msg => {
  bot.sendMessage(msg.chat.id, "pong");
});

bot.on("*", msg => {
  if (
    msg.text.toLowerCase() === "margus" ||
    msg.text.toLowerCase() === "/margus"
  ) {
    sendMessage(msg.chat.id, "mnoh?");
    expectQuestion = true;
  } else if (
    [
      "hello",
      "moi",
      "moro",
      "hi",
      "terve",
      "whatsup",
      "sup",
      "morjes"
    ].includes(msg.text.toLowerCase())
  ) {
    sendMessage(
      msg.chat.id,
      "Hi, I'm virtual clone of Markus. You can ask me anything by writing 'margus' and a question in the next message. Or we can also just chat :D"
    );
  } else if (expectQuestion) {
    quora.answer(msg.text.split(" ").join("-")).then(answer => {
      if (typeof answer === "string" && answer !== "") {
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
    let message = _.sample(Object.keys(data));

    let cur = message;
    while (cur !== "--END--") {
      cur = _.sample(data[cur]);
      if (cur !== "--END--") message += ` ${cur}`;
    }

    sendMessage(msg.chat.id, message.toLowerCase());
  }
});
