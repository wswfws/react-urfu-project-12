const CHANNELS_KEY = 'hexlet-chat.channels';
const MESSAGES_KEY = 'hexlet-chat.messages';

const starterChannels = [
  { id: 'general', name: 'общий', description: 'Обсуждаем всё, что важно для команды', unread: 0 },
  { id: 'design', name: 'дизайн', description: 'Идеи, макеты и визуальные решения', unread: 2 },
  { id: 'dev-help', name: 'помощь-разработка', description: 'Вопросы по коду и не только', unread: 0 },
  { id: 'random', name: 'случайное', description: 'Немного разговоров вне работы', unread: 0 },
];

const today = new Date();
const at = (hour, minute) => {
  const date = new Date(today);
  date.setHours(hour, minute, 0, 0);
  return date.toISOString();
};

const starterMessages = {
  general: [
    { id: 'g1', author: 'Мария Иванова', initials: 'МИ', color: 'coral', time: at(9, 18), text: 'Всем доброе утро! ☀️ Как настроение перед новой неделей?' },
    { id: 'g2', author: 'Алексей Петров', initials: 'АП', color: 'blue', time: at(9, 24), text: 'Отличное! Сегодня наконец покажу вам новый экран чата. Почти всё готово 🙌' },
    { id: 'g3', author: 'Мария Иванова', initials: 'МИ', color: 'coral', time: at(9, 27), text: 'Здорово! Очень ждём посмотреть. Если нужна будет помощь с текстами — маякни.' },
    { id: 'g4', author: 'Анна Смирнова', initials: 'АС', color: 'mint', time: at(9, 41), text: 'Доброе утро! Я сегодня обновлю документацию по API. К обеду всё будет в порядке.' },
    { id: 'g5', author: 'Алексей Петров', initials: 'АП', color: 'blue', time: at(10, 2), text: 'Спасибо, Анна! Тогда после обеда созвонимся и пройдёмся по интеграции.' },
  ],
  design: [
    { id: 'd1', author: 'Ирина Волкова', initials: 'ИВ', color: 'lilac', time: at(9, 12), text: 'Подготовила два варианта главного экрана. Какой вам ближе — первый или второй?' },
    { id: 'd2', author: 'Мария Иванова', initials: 'МИ', color: 'coral', time: at(9, 36), text: 'Мне нравится второй! Он выглядит легче и оставляет больше воздуха для контента.' },
    { id: 'd3', author: 'Ирина Волкова', initials: 'ИВ', color: 'lilac', time: at(9, 48), text: 'Тоже склоняюсь ко второму. Соберу финальную версию и добавлю в Figma ✨' },
  ],
  'dev-help': [
    { id: 'h1', author: 'Дмитрий Козлов', initials: 'ДК', color: 'amber', time: at(8, 52), text: 'Кто-нибудь настраивал TanStack Query с нашей тестовой API? Подскажите, пожалуйста, с чего начать.' },
    { id: 'h2', author: 'Алексей Петров', initials: 'АП', color: 'blue', time: at(9, 4), text: 'Привет! Я подключал на прошлой неделе. Напиши, где именно возникла сложность — помогу разобраться.' },
  ],
  random: [
    { id: 'r1', author: 'Анна Смирнова', initials: 'АС', color: 'mint', time: at(8, 25), text: 'Нашла маленькую кофейню рядом с офисом — у них невероятные булочки с корицей ☕' },
    { id: 'r2', author: 'Дмитрий Козлов', initials: 'ДК', color: 'amber', time: at(8, 39), text: 'Это звучит как отличный план на перерыв! Записал адрес 😄' },
  ],
};

function read(key, fallback) {
  try {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : fallback;
  } catch {
    return fallback;
  }
}

function save(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

export async function getChannels() {
  return read(CHANNELS_KEY, starterChannels);
}

export async function getMessages(channelId) {
  const allMessages = read(MESSAGES_KEY, starterMessages);
  return allMessages[channelId] ?? [];
}

export async function createChannel(name) {
  const channels = await getChannels();
  const normalized = name.trim().toLowerCase().replace(/\s+/g, '-');
  if (channels.some((channel) => channel.name.toLowerCase() === normalized)) {
    throw new Error('Канал с таким названием уже существует');
  }
  const channel = {
    id: `${normalized}-${Date.now()}`,
    name: normalized,
    description: 'Новый канал для общения команды',
    unread: 0,
  };
  const nextChannels = [...channels, channel];
  save(CHANNELS_KEY, nextChannels);
  return channel;
}

export async function sendMessage(channelId, text) {
  const allMessages = read(MESSAGES_KEY, starterMessages);
  const message = {
    id: `m-${Date.now()}`,
    author: 'Алексей Петров',
    initials: 'АП',
    color: 'blue',
    time: new Date().toISOString(),
    text: text.trim(),
  };
  allMessages[channelId] = [...(allMessages[channelId] ?? []), message];
  save(MESSAGES_KEY, allMessages);
  return message;
}
