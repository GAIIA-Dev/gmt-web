const { Telegraf, Markup } = require('telegraf');
const sqlite3 = require('sqlite3');
const { open } = require('sqlite');
const axios = require('axios');
require('dotenv').config();

// ПІДКЛЮЧАЄМО АДМІНКУ
const setupAdmin = require('./admin');

const bot = new Telegraf(process.env.CABINET_BOT_TOKEN);

// --- 🛠 РОЗУМНА ФУНКЦІЯ РЕДАГУВАННЯ ---
const safeEdit = async (ctx, text, markup = {}) => {
    try {
        if (ctx.callbackQuery && ctx.callbackQuery.message && ctx.callbackQuery.message.photo) {
            await ctx.editMessageCaption(text, { parse_mode: 'HTML', ...markup });
        } else {
            await ctx.editMessageText(text, { parse_mode: 'HTML', ...markup });
        }
    } catch (e) {
        console.error('Помилка редагування:', e.message);
    }
};

// --- ⌨️ МЕНЮ (ДИНАМІЧНЕ ДЛЯ АДМІНІВ) ---
const getMainMenu = (userId) => {
    const kb = [
        ['👤 Мій кабінет', '💡 Світло (Графік)'],
        ['🌤 Погода', '💵 Курс валют'],
        ['⚙️ Налаштування', '🔮 Гороскоп'],
        ['🥠 Передбачення на сьогодні']
    ];
    
    const adminIds = process.env.ADMIN_IDS ? process.env.ADMIN_IDS.split(',') : [];
    if (adminIds.includes(userId.toString())) {
        kb.push(['👑 Адмін-панель']);
    }
    
    return Markup.keyboard(kb).resize();
};

// --- 🗄️ БАЗА ДАНИХ ---
let db;
(async () => {
    db = await open({
        filename: './galychany.sqlite',
        driver: sqlite3.Database
    });
    await db.exec(`
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY,
            telegram_id INTEGER UNIQUE,
            username TEXT,
            first_name TEXT,
            city TEXT DEFAULT 'Не визначено',
            light_group TEXT DEFAULT 'Не обрана',
            notifications INTEGER DEFAULT 1,
            zodiac TEXT DEFAULT 'Не обрано',
            last_prediction INTEGER DEFAULT 0,
            prediction_text TEXT DEFAULT '',
            is_blocked INTEGER DEFAULT 0,
            last_active DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    `);
    console.log('✅ База даних Галичини готова.');

    setupAdmin(bot, db, getMainMenu);
})();

// --- 🛡 ГЛОБАЛЬНИЙ ФІЛЬТР ---
bot.use(async (ctx, next) => {
    if (!ctx.from) return next();
    try {
        await db.run("UPDATE users SET last_active = datetime('now', 'localtime') WHERE telegram_id = ?", [ctx.from.id]);
        const user = await db.get('SELECT is_blocked FROM users WHERE telegram_id = ?', [ctx.from.id]);
        if (user && user.is_blocked) return; 
    } catch (e) {}
    return next();
});

// --- 📋 ДАНІ ---
const lightGroups = [['1.1', '1.2'], ['2.1', '2.2'], ['3.1', '3.2'], ['4.1', '4.2'], ['5.1', '5.2'], ['6.1', '6.2']];
const zodiacs = [
    ['Овен ♈️', 'Телець ♉️'], ['Близнюки ♊️', 'Рак ♋️'], 
    ['Лев ♌️', 'Діва ♍️'], ['Терези ♎️', 'Скорпіон ♏️'],
    ['Стрілець ♐️', 'Козоріг ♑️'], ['Водолій ♒️', 'Риби ♓️']
];

const predictionsList = [
    "Сьогодні на тебе чекає несподівана, але дуже приємна звістка!",
    "Твоя праця нарешті дасть помітні результати. Продовжуй в тому ж дусі!",
    "Зверни увагу на дрібниці – сьогодні в них ховається великий успіх.",
    "Ідеальний день, щоб відпустити минуле і почати щось нове.",
    "Сьогодні хтось дуже потребуватиме твоєї посмішки та підтримки.",
    "Не бійся ризикувати – удача на боці сміливих!",
    "Вечір обіцяє бути спокійним та затишним. Присвяти його собі.",
    "Гроші люблять тишу, а сьогодні вони люблять ще й тебе. Очікуй прибуток!",
    "Випадкова зустріч сьогодні може змінити твої плани на тиждень.",
    "Твоя енергія б'є ключем! Використай її для вирішення найважчих задач.",
    "Зірки радять сьогодні не поспішати. Все станеться у свій час.",
    "Зроби крок назустріч своїй мрії – сьогодні перешкод не існує.",
    "Прислухайся до своєї інтуїції, вона сьогодні працює на 200%.",
    "Чудовий день для планування подорожі або великої покупки.",
    "Хтось із близьких готує для тебе приємний сюрприз. Будь готовий!"
];

// --- 🚀 ФУНКЦІОНАЛ ---

bot.start(async (ctx) => {
    const { id, first_name, username } = ctx.from;
    await db.run(`INSERT OR IGNORE INTO users (telegram_id, username, first_name) VALUES (?, ?, ?)`, [id, username, first_name]);
    ctx.replyWithHTML(`👑 <b>ВІТАЄМО, ГАЛИЧАНИНЕ!</b> 👑\n\nЦе твій цифровий кабінет. Зайди в Налаштування, щоб вказати місто та знак зодіаку.`, getMainMenu(ctx.from.id));
});

// 👤 КАБІНЕТ
const getCabinetText = (user) => {
    return `🛡 <b>ОСОБИСТИЙ КАБІНЕТ КОРИСТУВАЧА</b>\n` +
           `━━━━━━━━━━━━━━━━━━━━\n` +
           `👤 <b>Нікнейм:</b> @${user.username || 'немає'}\n` +
           `🆔 <b>Ваш ID:</b> <code>${user.telegram_id}</code>\n\n` +
           `🏙 <b>Місцевість:</b> ${user.city}\n` +
           `🔌 <b>Група світла:</b> ${user.light_group}\n` +
           `✨ <b>Знак зодіаку:</b> ${user.zodiac}\n` +
           `🔔 <b>Сповіщення:</b> ${user.notifications ? 'Увімкнено' : 'Вимкнено'}\n` +
           `━━━━━━━━━━━━━━━━━━━━\n` +
           `✨ <i>Твій кабінет — твій комфорт!</i>`;
};

bot.hears('👤 Мій кабінет', async (ctx) => {
    const user = await db.get('SELECT * FROM users WHERE telegram_id = ?', [ctx.from.id]);
    await ctx.replyWithPhoto({ source: './botimg/cabinet.png' }, { caption: getCabinetText(user), parse_mode: 'HTML' }).catch(() => ctx.replyWithHTML(getCabinetText(user)));
});

// 💡 СВІТЛО
bot.hears('💡 Світло (Графік)', async (ctx) => {
    const user = await db.get('SELECT * FROM users WHERE telegram_id = ?', [ctx.from.id]);
    const lightText = `⚡️ <b>ЕНЕРГОСИСТЕМА ЛЬВІВЩИНИ</b>\n` +
                      `━━━━━━━━━━━━━━━━━━━━\n` +
                      `🔌 Ваша підгрупа: <b>${user.light_group}</b>\n\n` +
                      `<blockquote>🔔 <i>Якщо у вас увімкнені сповіщення, бот автоматично надсилатиме повідомлення про вимкнення/увімкнення світла та зміни в графіках для вашої групи.</i></blockquote>\n\n` +
                      `Оберіть необхідну дію нижче:`;
    
    const kb = Markup.inlineKeyboard([
        [Markup.button.callback('📅 Дізнатись графік', 'get_schedule')],
        [Markup.button.callback('🔄 Змінити групу', 'menu_light_main')]
    ]);

    await ctx.replyWithPhoto({ source: './botimg/light.png' }, { caption: lightText, parse_mode: 'HTML', ...kb }).catch(() => ctx.replyWithHTML(lightText, kb));
});

// 🌤 ПОГОДА
bot.hears('🌤 Погода', async (ctx) => {
    const user = await db.get('SELECT * FROM users WHERE telegram_id = ?', [ctx.from.id]);
    let cityForSearch = (user.city && user.city !== 'Не визначено') ? user.city : 'Lviv';
    const waitMsg = await ctx.reply('🔄 Зв\'язуюсь з метеостанцією...');
    
    try {
        const res = await axios.get(`https://wttr.in/${encodeURIComponent(cityForSearch)}?format=j1&lang=uk`);
        const current = res.data.current_condition[0];
        const today = res.data.weather[0];
        const ast = today.astronomy[0];

        const weatherDesc = current.lang_uk[0].value;
        let weatherIcon = "🌤";
        if (weatherDesc.toLowerCase().includes("хмарно")) weatherIcon = "☁️";
        if (weatherDesc.toLowerCase().includes("дощ")) weatherIcon = "🌧";
        if (weatherDesc.toLowerCase().includes("ясно")) weatherIcon = "☀️";

        const weatherText = `🌤 <b>МЕТЕОЦЕНТР: ${user.city.toUpperCase()}</b>\n` +
                            `━━━━━━━━━━━━━━━━━━━━\n` +
                            `${weatherIcon} Статус: <b>${weatherDesc}</b>\n` +
                            `🌡 Температура: <b>${current.temp_C}°C</b>\n` +
                            `🤔 Відчувається як: <b>${current.FeelsLikeC}°C</b>\n\n` +
                            `💧 Вологість: <b>${current.humidity}%</b>\n` +
                            `🌬 Вітер: <b>${Math.round(current.windspeedKmph / 3.6)} м/с</b>\n` +
                            `🌀 Тиск: <b>${current.pressure} hPa</b>\n\n` +
                            `📈 Макс: ${today.maxtempC}°C | 📉 Мін: ${today.mintempC}°C\n` +
                            `━━━━━━━━━━━━━━━━━━━━\n` +
                            `🌅 Схід: <b>${ast.sunrise}</b> | 🌇 Захід: <b>${ast.sunset}</b>\n` +
                            `✨ <i>Дані оновлено для вашої локації.</i>`;

        const kb = Markup.inlineKeyboard([[Markup.button.callback('🔄 Оновити прогноз', 'refresh_weather')]]);
        
        await ctx.replyWithPhoto({ source: './botimg/weather.png' }, { caption: weatherText, parse_mode: 'HTML', ...kb }).catch(() => ctx.replyWithHTML(weatherText, kb));
    } catch (e) {
        ctx.replyWithHTML('❌ <b>Сервіс погоди недоступний.</b>');
    } finally {
        if (waitMsg) ctx.telegram.deleteMessage(ctx.chat.id, waitMsg.message_id).catch(() => {});
    }
});

// 💵 КУРС ВАЛЮТ
bot.hears('💵 Курс валют', async (ctx) => {
    const waitMsg = await ctx.reply('🔄 Аналізую ринки...');
    try {
        const nbuRes = await axios.get('https://bank.gov.ua/NBUStatService/v1/statdirectory/exchange?json');
        const btcRes = await axios.get('https://api.binance.com/api/v3/ticker/price?symbol=BTCUSDT');
        const ethRes = await axios.get('https://api.binance.com/api/v3/ticker/price?symbol=ETHUSDT');
        
        const usd = nbuRes.data.find(c => c.cc === 'USD').rate;
        const eur = nbuRes.data.find(c => c.cc === 'EUR').rate;
        const pln = nbuRes.data.find(c => c.cc === 'PLN').rate;

        const hour = new Date().getHours();
        const marketMood = hour < 12 ? "🌅 Ранкове відкриття, волатильність низька" : "⚡️ Активна фаза торгів";

        const financeText = `🏦 <b>ФІНАНСОВИЙ МОНІТОР</b>\n` +
                            `━━━━━━━━━━━━━━━━━━━━\n` +
                            `🏛 <b>Курс НБУ:</b>\n` +
                            `🇺🇸 USD: <b>${usd.toFixed(2)} грн</b>\n` +
                            `🇪🇺 EUR: <b>${eur.toFixed(2)} грн</b>\n` +
                            `🇵🇱 PLN: <b>${pln.toFixed(2)} грн</b>\n\n` +
                            `🔶 <b>Крипторинок (Binance):</b>\n` +
                            `₿ BTC: <b>$${parseFloat(btcRes.data.price).toLocaleString()}</b>\n` +
                            `💎 ETH: <b>$${parseFloat(ethRes.data.price).toLocaleString()}</b>\n` +
                            `💵 USDT: <b>~${(usd + 0.4).toFixed(2)} грн</b>\n\n` +
                            `📊 <b>Аналітика:</b>\n` +
                            `<i>${marketMood}</i>\n` +
                            `━━━━━━━━━━━━━━━━━━━━`;

        const kb = Markup.inlineKeyboard([[Markup.button.callback('🔄 Оновити дані', 'refresh_finance')]]);
        
        await ctx.replyWithPhoto({ source: './botimg/finance.png' }, { caption: financeText, parse_mode: 'HTML', ...kb }).catch(() => ctx.replyWithHTML(financeText, kb));
    } catch (e) {
        ctx.reply('❌ Помилка фінансових даних.');
    } finally {
        if (waitMsg) ctx.telegram.deleteMessage(ctx.chat.id, waitMsg.message_id).catch(() => {});
    }
});

// 🔮 ГОРОСКОП
bot.hears('🔮 Гороскоп', async (ctx) => {
    const user = await db.get('SELECT * FROM users WHERE telegram_id = ?', [ctx.from.id]);
    
    if (user.zodiac === 'Не обрано') {
        return ctx.replyWithHTML('🔮 <b>Спершу оберіть свій знак зодіаку в Налаштуваннях!</b>');
    }

    const introText = `🔮 <b>ГОРОСКОП: ${user.zodiac.toUpperCase()}</b>\n` +
                      `━━━━━━━━━━━━━━━━━━━━\n` +
                      `Тут ти можеш подивитись свій актуальний гороскоп на сьогодні! ✨\n` +
                      `━━━━━━━━━━━━━━━━━━━━`;
    
    const kb = Markup.inlineKeyboard([
        [Markup.button.callback('✨ Отримати гороскоп на сьогодні', 'get_daily_horoscope')],
        [Markup.button.callback('🔄 Змінити знак', 'menu_zod_main')]
    ]);

    await ctx.replyWithPhoto({ source: './botimg/zodiac.png' }, { caption: introText, parse_mode: 'HTML', ...kb }).catch(() => ctx.replyWithHTML(introText, kb));
});

// 🥠 ПЕРЕДБАЧЕННЯ (З ЦИТАТОЮ)
bot.hears('🥠 Передбачення на сьогодні', async (ctx) => {
    const user = await db.get('SELECT * FROM users WHERE telegram_id = ?', [ctx.from.id]);
    const now = Date.now();
    const cooldown = 6 * 60 * 60 * 1000;

    if (now - user.last_prediction < cooldown) {
        const timeLeft = cooldown - (now - user.last_prediction);
        const hours = Math.floor(timeLeft / (1000 * 60 * 60));
        const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
        
        const waitText = `⏳ <b>Зірки ще відпочивають!</b>\n\n` +
                         `Твоє попереднє передбачення:\n` +
                         `<blockquote>💬 "${user.prediction_text}"</blockquote>\n` +
                         `Наступне буде доступне через: <b>${hours} год ${minutes} хв</b> ⏱`;
                         
        return ctx.replyWithPhoto({ source: './botimg/prediction.png' }, { caption: waitText, parse_mode: 'HTML' }).catch(() => ctx.replyWithHTML(waitText));
    }

    const randomPred = predictionsList[Math.floor(Math.random() * predictionsList.length)];
    await db.run('UPDATE users SET last_prediction = ?, prediction_text = ? WHERE telegram_id = ?', [now, randomPred, ctx.from.id]);

    const predText = `🥠 <b>ТВОЄ ПЕРЕДБАЧЕННЯ</b>\n` +
                     `━━━━━━━━━━━━━━━━━━━━\n` +
                     `<blockquote>✨ <i>"${randomPred}"</i></blockquote>\n` +
                     `━━━━━━━━━━━━━━━━━━━━\n` +
                     `📍 <i>Повертайся за новим через 6 годин!</i>`;

    await ctx.replyWithPhoto({ source: './botimg/prediction.png' }, { caption: predText, parse_mode: 'HTML' }).catch(() => ctx.replyWithHTML(predText));
});

// ⚙️ НАЛАШТУВАННЯ
const getSettingsKeyboard = (user) => {
    return Markup.inlineKeyboard([
        [Markup.button.callback('📍 Оновити локацію', 'trigger_location')],
        [Markup.button.callback('🔌 Змінити групу світла', 'menu_light_set')],
        [Markup.button.callback('♈️ Знак зодіаку', 'menu_zod_set')],
        [user.notifications ? 
            Markup.button.callback('🔕 Вимкнути сповіщення', 'toggle_notify_0') : 
            Markup.button.callback('🔔 Увімкнути сповіщення', 'toggle_notify_1')]
    ]);
};

bot.hears('⚙️ Налаштування', async (ctx) => {
    const user = await db.get('SELECT * FROM users WHERE telegram_id = ?', [ctx.from.id]);
    ctx.replyWithHTML('⚙️ <b>ЦЕНТР НАЛАШТУВАНЬ</b>\nОберіть, що бажаєте змінити:', getSettingsKeyboard(user));
});


// --- 🔄 CALLBACKS (РЕНДЕРИНГ МЕНЮ) ---
const renderLightMenu = async (ctx) => {
    const user = await db.get('SELECT * FROM users WHERE telegram_id = ?', [ctx.from.id]);
    const lightText = `⚡️ <b>ЕНЕРГОСИСТЕМА ЛЬВІВЩИНИ</b>\n` +
                      `━━━━━━━━━━━━━━━━━━━━\n` +
                      `🔌 Ваша підгрупа: <b>${user.light_group}</b>\n\n` +
                      `<blockquote>🔔 <i>Якщо у вас увімкнені сповіщення, бот автоматично надсилатиме повідомлення про вимкнення/увімкнення світла та зміни в графіках для вашої групи.</i></blockquote>\n\n` +
                      `Оберіть необхідну дію нижче:`;
                      
    const kb = Markup.inlineKeyboard([
        [Markup.button.callback('📅 Дізнатись графік', 'get_schedule')],
        [Markup.button.callback('🔄 Змінити групу', 'menu_light_main')]
    ]);
    await safeEdit(ctx, lightText, kb);
};

const renderZodiacMenu = async (ctx) => {
    const user = await db.get('SELECT * FROM users WHERE telegram_id = ?', [ctx.from.id]);
    const introText = `🔮 <b>ГОРОСКОП: ${user.zodiac.toUpperCase()}</b>\n` +
                      `━━━━━━━━━━━━━━━━━━━━\n` +
                      `Тут ти можеш подивитись свій актуальний гороскоп на сьогодні! ✨\n` +
                      `━━━━━━━━━━━━━━━━━━━━`;
    const kb = Markup.inlineKeyboard([
        [Markup.button.callback('✨ Отримати гороскоп на сьогодні', 'get_daily_horoscope')],
        [Markup.button.callback('🔄 Змінити знак', 'menu_zod_main')]
    ]);
    await safeEdit(ctx, introText, kb);
};

const renderSettingsMenu = async (ctx) => {
    const user = await db.get('SELECT * FROM users WHERE telegram_id = ?', [ctx.from.id]);
    await safeEdit(ctx, '⚙️ <b>ЦЕНТР НАЛАШТУВАНЬ</b>\nОберіть, що бажаєте змінити:', getSettingsKeyboard(user));
};

// --- CALLBACKS ДІЙ ---
bot.action('back_light', renderLightMenu);
bot.action('back_zodiac', renderZodiacMenu);
bot.action('back_settings', renderSettingsMenu);

bot.action(/menu_light_(main|set)/, (ctx) => {
    const origin = ctx.match[1];
    const buttons = lightGroups.map(row => row.map(g => Markup.button.callback(`Група ${g}`, `set_light_${origin}_${g}`)));
    buttons.push([Markup.button.callback('🔙 Назад', origin === 'main' ? 'back_light' : 'back_settings')]);
    safeEdit(ctx, '🔌 <b>Оберіть вашу групу відключень:</b>', Markup.inlineKeyboard(buttons));
});

bot.action(/^set_light_(main|set)_/, async (ctx) => {
    const origin = ctx.match[1];
    const group = ctx.match.input.replace(`set_light_${origin}_`, '');
    await db.run('UPDATE users SET light_group = ? WHERE telegram_id = ?', [group, ctx.from.id]);
    ctx.answerCbQuery(`Група ${group} збережена! ✅`);
    if (origin === 'main') await renderLightMenu(ctx);
    else await renderSettingsMenu(ctx);
});

bot.action(/menu_zod_(main|set)/, (ctx) => {
    const origin = ctx.match[1];
    const buttons = zodiacs.map(row => row.map(z => Markup.button.callback(z, `set_zod_${origin}_${z}`)));
    buttons.push([Markup.button.callback('🔙 Назад', origin === 'main' ? 'back_zodiac' : 'back_settings')]);
    safeEdit(ctx, '🔮 <b>Оберіть ваш знак зодіаку:</b>', Markup.inlineKeyboard(buttons));
});

bot.action(/^set_zod_(main|set)_/, async (ctx) => {
    const origin = ctx.match[1];
    const zod = ctx.match.input.replace(`set_zod_${origin}_`, '');
    await db.run('UPDATE users SET zodiac = ? WHERE telegram_id = ?', [zod, ctx.from.id]);
    ctx.answerCbQuery(`Знак ${zod} збережено! ✅`);
    if (origin === 'main') await renderZodiacMenu(ctx);
    else await renderSettingsMenu(ctx);
});

bot.action('get_daily_horoscope', async (ctx) => {
    const user = await db.get('SELECT * FROM users WHERE telegram_id = ?', [ctx.from.id]);
    const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0)) / 1000 / 60 / 60 / 24);
    const index = (dayOfYear + user.zodiac.length) % predictionsList.length;
    
    ctx.answerCbQuery('Зірки прочитано... ✨');
    const text = `🔮 <b>ТВІЙ ДЕННИЙ ГОРОСКОП: ${user.zodiac.toUpperCase()}</b>\n` +
                 `━━━━━━━━━━━━━━━━━━━━\n` +
                 `✨ <i>${predictionsList[index]}</i>\n` +
                 `━━━━━━━━━━━━━━━━━━━━\n` +
                 `😎 <i>Нехай сьогодні все йде за планом!</i>`;
                 
    ctx.replyWithHTML(text); // Окреме повідомлення!
});

bot.action('trigger_location', (ctx) => {
    ctx.deleteMessage().catch(() => {});
    ctx.reply('📍 Натисніть кнопку нижче, щоб автоматично визначити ваше місто:', Markup.keyboard([
        [Markup.button.locationRequest('🛰 Надіслати мою геолокацію')],
        ['🔙 Назад']
    ]).resize());
});

bot.action('get_schedule', (ctx) => {
    ctx.answerCbQuery();
    ctx.replyWithHTML(`🟢 <b>СВІТЛО Є!</b>\n\n🛡 Станом на зараз графіків відключень не застосовано. Ситуація в енергосистемі стабільна. 💡`);
});

bot.action(/^toggle_notify_/, async (ctx) => {
    const val = parseInt(ctx.match.input.replace('toggle_notify_', ''));
    await db.run('UPDATE users SET notifications = ? WHERE telegram_id = ?', [val, ctx.from.id]);
    ctx.answerCbQuery(val ? 'Сповіщення увімкнено ✅' : 'Сповіщення вимкнено 🔕');
    await renderSettingsMenu(ctx);
});

bot.action('refresh_weather', (ctx) => {
    ctx.answerCbQuery('Оновлюю прогноз... 🌤');
    ctx.deleteMessage().catch(() => {}); 
    bot.handleUpdate({ message: { text: '🌤 Погода', from: ctx.from, chat: ctx.chat }, update_id: 0 });
});

bot.action('refresh_finance', (ctx) => {
    ctx.answerCbQuery('Оновлюю цифри... 📈');
    ctx.deleteMessage().catch(() => {}); 
    bot.handleUpdate({ message: { text: '💵 Курс валют', from: ctx.from, chat: ctx.chat }, update_id: 0 });
});

// 🔥 БЕЗПЕЧНА ГЕОЛОКАЦІЯ
bot.on('location', async (ctx) => {
    const userMsgId = ctx.message.message_id;
    const waitMsg = await ctx.reply('🔍 Визначаю місто...');
    try {
        const geo = await axios.get(`https://nominatim.openstreetmap.org/reverse?lat=${ctx.message.location.latitude}&lon=${ctx.message.location.longitude}&format=json&accept-language=uk`, {
            headers: { 'User-Agent': `CabinetHalychany_${ctx.from.id}` }
        });
        const city = geo.data.address.city || geo.data.address.town || geo.data.address.village || 'Львівська обл.';
        await db.run('UPDATE users SET city = ? WHERE telegram_id = ?', [city, ctx.from.id]);
        await ctx.deleteMessage(userMsgId).catch(() => {});
        ctx.replyWithHTML(`✅ <b>УСПІШНО!</b>\nТвоя локація: <b>${city}</b>.`, getMainMenu(ctx.from.id));
    } catch (e) { ctx.reply('❌ Помилка визначення.', getMainMenu(ctx.from.id)); }
    finally { if (waitMsg) ctx.telegram.deleteMessage(ctx.chat.id, waitMsg.message_id).catch(() => {}); }
});

bot.hears('🔙 Назад', (ctx) => {
    ctx.reply('Головне меню:', getMainMenu(ctx.from.id));
});

bot.launch();
console.log('🚀 Бот ідеально налаштований і готовий!');