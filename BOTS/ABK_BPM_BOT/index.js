var config = require('nconf');
config.file('def', {file: './config/default.json'});
config.file('tkn', {file: './config/token.json'});
var TOKEN = config.get('token');
var TelegramBot = require('node-telegram-bot-api');

// Включить опрос сервера
var bot = new TelegramBot(TOKEN, {polling: true, polling: {params: {timeout : 300}}});

// Основное меню
bot.onText(/\/menu/, function (msg, match) {
  bot.sendMessage(getChatId(msg), config.get('hello') + ', ' + msg.from.first_name + ', ' +
  config.get('main_menu_txt'), getMenu(config.get('main_menu_buttons')));
});

// Помощь
bot.onText(/\/help/, function (msg, match) {
  bot.sendMessage(getChatId(msg), config.get('developing'), getMenu(config.get('alfa_site_url_buttons')));
});

// Обработка событии
bot.on('callback_query', function (msg) {
  var chatId = getChatId(msg);

  switch (msg.data) {
    case 'to_find_process_by_instanse_id':
      removePreviousMsg(msg);
      bot.sendMessage(chatId, config.get('main_menu_txt'), getMenu(config.get('search_menu_buttons')));
      break;
    case 'to_main_menu':
      removePreviousMsg(msg);
      bot.sendMessage(chatId, config.get('main_menu_txt'), getMenu(config.get('main_menu_buttons')));
      break;
    default:
      bot.answerCallbackQuery(msg.id, 'Вы выбрали: ' + msg.data, false);
  }

});

bot.on('chosen_inline_result', function (msg) {
  console.log(msg);
});

// функции
function removePreviousMsg(msg) {
  try {
    bot.deleteMessage(msg.message.chat.id, msg.message.message_id);
  } catch (e) {
  }
}

function getMenu(arr_buttons) {
  return options = {
    reply_markup: JSON.stringify({
      inline_keyboard: arr_buttons,
      parse_mode: 'Markdown'
    })
  };
}

function getChatId(msg) {
  return msg.hasOwnProperty('chat') ? msg.chat.id : msg.from.id;
}
