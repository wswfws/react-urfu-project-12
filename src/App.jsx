import { useMemo, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useForm } from '@mantine/form';
import {
  ActionIcon,
  Avatar,
  Badge,
  Button,
  Group,
  Loader,
  Menu,
  Modal,
  ScrollArea,
  Stack,
  Text,
  Textarea,
  TextInput,
  Tooltip,
} from '@mantine/core';
import {
  IconBell,
  IconBold,
  IconChevronDown,
  IconCirclePlus,
  IconCode,
  IconDots,
  IconFileText,
  IconHash,
  IconHelpCircle,
  IconInfoCircle,
  IconItalic,
  IconMenu2,
  IconMoodSmile,
  IconPaperclip,
  IconPencil,
  IconPlus,
  IconSearch,
  IconSend,
  IconSettings,
  IconStrikethrough,
  IconUsers,
  IconX,
} from '@tabler/icons-react';
import { createChannel, getChannels, getMessages, sendMessage } from './chatData.js';
import { useChatStore } from './store.js';

const currentUser = { name: 'Алексей Петров', initials: 'АП', color: 'blue', status: 'В сети' };

const people = [
  { name: 'Мария Иванова', initials: 'МИ', color: 'coral' },
  { name: 'Алексей Петров', initials: 'АП', color: 'blue' },
  { name: 'Анна Смирнова', initials: 'АС', color: 'mint' },
  { name: 'Ирина Волкова', initials: 'ИВ', color: 'lilac' },
  { name: 'Дмитрий Козлов', initials: 'ДК', color: 'amber' },
];

const formatTime = (value) => new Intl.DateTimeFormat('ru-RU', { hour: '2-digit', minute: '2-digit' }).format(new Date(value));

function UserAvatar({ person, size = 38 }) {
  return <Avatar className={`avatar avatar-${person.color}`} size={size} radius="md">{person.initials}</Avatar>;
}

function App() {
  const queryClient = useQueryClient();
  const activeChannelId = useChatStore((state) => state.activeChannelId);
  const setActiveChannel = useChatStore((state) => state.setActiveChannel);
  const [search, setSearch] = useState('');
  const [isCreateOpen, setCreateOpen] = useState(false);
  const [isProfileOpen, setProfileOpen] = useState(false);
  const [isMobileNavOpen, setMobileNavOpen] = useState(false);

  const { data: channels = [], isLoading: isChannelsLoading } = useQuery({ queryKey: ['channels'], queryFn: getChannels });
  const activeChannel = channels.find((channel) => channel.id === activeChannelId) ?? channels[0];
  const { data: messages = [], isLoading: isMessagesLoading } = useQuery({
    queryKey: ['messages', activeChannel?.id],
    queryFn: () => getMessages(activeChannel.id),
    enabled: Boolean(activeChannel),
  });

  const createForm = useForm({
    initialValues: { name: '' },
    validate: { name: (value) => (value.trim().length < 2 ? 'Название должно содержать хотя бы 2 символа' : null) },
  });
  const messageForm = useForm({ initialValues: { text: '' }, validate: { text: (value) => (value.trim() ? null : 'Напишите сообщение') } });

  const createMutation = useMutation({
    mutationFn: createChannel,
    onSuccess: (channel) => {
      queryClient.setQueryData(['channels'], (current = []) => [...current, channel]);
      queryClient.setQueryData(['messages', channel.id], []);
      setActiveChannel(channel.id);
      createForm.reset();
      setCreateOpen(false);
    },
    onError: (error) => createForm.setFieldError('name', error.message),
  });

  const sendMutation = useMutation({
    mutationFn: (text) => sendMessage(activeChannel.id, text),
    onSuccess: (message) => {
      queryClient.setQueryData(['messages', activeChannel.id], (current = []) => [...current, message]);
      messageForm.reset();
    },
  });

  const visibleMessages = useMemo(() => {
    const term = search.trim().toLocaleLowerCase('ru');
    return term ? messages.filter((message) => `${message.author} ${message.text}`.toLocaleLowerCase('ru').includes(term)) : messages;
  }, [messages, search]);

  const submitMessage = messageForm.onSubmit(({ text }) => sendMutation.mutate(text));

  return (
    <main className="app-shell">
      <aside className="workspace-rail" aria-label="Рабочие пространства">
        <Tooltip label="Hexlet" position="right">
          <button className="workspace-mark" aria-label="Рабочее пространство Hexlet">h</button>
        </Tooltip>
        <div className="rail-divider" />
        <Tooltip label="Добавить рабочее пространство" position="right">
          <button className="rail-add" aria-label="Добавить рабочее пространство"><IconPlus size={19} /></button>
        </Tooltip>
        <div className="rail-bottom">
          <Tooltip label="Справка" position="right"><button className="rail-icon" aria-label="Справка"><IconHelpCircle size={20} /></button></Tooltip>
        </div>
      </aside>

      {isMobileNavOpen && <button className="mobile-nav-scrim" onClick={() => setMobileNavOpen(false)} aria-label="Закрыть навигацию" />}
      <aside className={`sidebar ${isMobileNavOpen ? 'sidebar-open' : ''}`}>
        <button className="workspace-title">
          <span className="workspace-title-text">Hexlet команда</span>
          <IconChevronDown size={16} />
        </button>

        <div className="sidebar-scroll">
          <button className="sidebar-row"><IconPencil size={17} /><span>Черновики и отправленные</span></button>
          <button className="sidebar-row"><IconBell size={17} /><span>Активность</span><span className="sidebar-count">3</span></button>
          <button className="sidebar-row"><IconFileText size={17} /><span>Позже</span></button>

          <div className="sidebar-section">
            <div className="section-heading"><span>Каналы</span><button onClick={() => setCreateOpen(true)} aria-label="Создать канал"><IconPlus size={16} /></button></div>
            {isChannelsLoading ? <Loader size="xs" color="gray" /> : channels.map((channel) => (
              <button
                key={channel.id}
                className={`channel-link ${activeChannel?.id === channel.id ? 'channel-link-active' : ''}`}
                onClick={() => { setActiveChannel(channel.id); setSearch(''); setMobileNavOpen(false); }}
              >
                <IconHash size={17} stroke={1.8} />
                <span className="channel-name">{channel.name}</span>
                {channel.unread > 0 && <span className="channel-unread">{channel.unread}</span>}
              </button>
            ))}
            <button className="sidebar-row add-channel" onClick={() => setCreateOpen(true)}><IconCirclePlus size={17} /><span>Добавить каналы</span></button>
          </div>

          <div className="sidebar-section people-section">
            <div className="section-heading"><span>Личные сообщения</span><button aria-label="Новое сообщение"><IconPlus size={16} /></button></div>
            {people.slice(0, 4).map((person) => (
              <button key={person.name} className="person-link" onClick={() => setProfileOpen(true)}>
                <span className={`presence presence-${person.color}`}><UserAvatar person={person} size={22} /></span>
                <span>{person.name}</span>
                {person.name === currentUser.name && <span className="you-label">вы</span>}
              </button>
            ))}
            <button className="sidebar-row add-channel"><IconPlus size={17} /><span>Добавить коллег</span></button>
          </div>
        </div>

        <button className="profile-bar" onClick={() => setProfileOpen(true)}>
          <span className="profile-avatar-wrap"><UserAvatar person={currentUser} size={36} /><span className="online-dot" /></span>
          <span className="profile-copy"><strong>{currentUser.name}</strong><small>В сети</small></span>
          <IconDots size={19} />
        </button>
      </aside>

      <section className="chat-panel">
        <header className="chat-header">
          <button className="mobile-nav-button" onClick={() => setMobileNavOpen(true)} aria-label="Открыть каналы"><IconMenu2 size={20} /></button>
          <div className="channel-heading">
            {activeChannel ? <>
              <div className="channel-heading-title"><IconHash size={20} /><h1>{activeChannel.name}</h1><IconChevronDown size={15} className="heading-chevron" /></div>
              <p>{activeChannel.description}</p>
            </> : <h1>Загрузка чата…</h1>}
          </div>
          <div className="header-actions">
            <button className="member-button" aria-label="Участники канала"><IconUsers size={18} /><span>5</span></button>
            <span className="header-divider" />
            <label className="search-box">
              <IconSearch size={17} />
              <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Поиск в канале" aria-label="Поиск в канале" />
              {search && <button type="button" onClick={() => setSearch('')} aria-label="Очистить поиск"><IconX size={15} /></button>}
            </label>
            <Tooltip label="Справка"><button className="header-help" aria-label="Справка"><IconInfoCircle size={20} /></button></Tooltip>
          </div>
        </header>

        <ScrollArea className="messages-scroll" type="auto" offsetScrollbars>
          <div className="messages-content">
            {activeChannel && <div className="channel-welcome">
              <div className="welcome-hash"><IconHash size={22} /></div>
              <h2>Вы в канале «{activeChannel.name}»</h2>
              <p>{activeChannel.description}. Здесь начинается ваше общение с командой.</p>
              <button onClick={() => setProfileOpen(true)}><IconUsers size={15} /> Посмотреть участников</button>
            </div>}

            <div className="date-divider"><span>Сегодня</span></div>

            {isMessagesLoading ? <div className="loading-state"><Loader size="sm" color="violet" /><Text c="dimmed" size="sm">Загружаем сообщения…</Text></div> : visibleMessages.length ? visibleMessages.map((message, index) => {
              const person = people.find((item) => item.name === message.author) ?? currentUser;
              const previous = visibleMessages[index - 1];
              const grouped = previous?.author === message.author && new Date(message.time) - new Date(previous.time) < 5 * 60_000;
              return (
                <article className={`message-row ${grouped ? 'message-grouped' : ''}`} key={message.id}>
                  {grouped ? <span className="group-time">{formatTime(message.time)}</span> : <UserAvatar person={person} size={38} />}
                  <div className="message-body">
                    {!grouped && <div className="message-meta"><strong>{message.author}</strong><time>{formatTime(message.time)}</time></div>}
                    <p>{message.text}</p>
                  </div>
                  <div className="message-hover-actions">
                    <button aria-label="Добавить реакцию"><IconMoodSmile size={17} /></button>
                    <button aria-label="Ответить"><IconPencil size={16} /></button>
                    <button aria-label="Ещё действия"><IconDots size={17} /></button>
                  </div>
                </article>
              );
            }) : <div className="empty-search"><IconSearch size={24} /><strong>Ничего не найдено</strong><span>Попробуйте изменить запрос</span></div>}
          </div>
        </ScrollArea>

        <div className="composer-wrap">
          <form className="composer" onSubmit={submitMessage}>
            <div className="composer-toolbar">
              <Tooltip label="Жирный"><button type="button" aria-label="Жирный"><IconBold size={17} /></button></Tooltip>
              <Tooltip label="Курсив"><button type="button" aria-label="Курсив"><IconItalic size={17} /></button></Tooltip>
              <Tooltip label="Зачёркнутый"><button type="button" aria-label="Зачёркнутый"><IconStrikethrough size={17} /></button></Tooltip>
              <span className="toolbar-separator" />
              <Tooltip label="Код"><button type="button" aria-label="Код"><IconCode size={17} /></button></Tooltip>
              <span className="toolbar-separator" />
              <Tooltip label="Ссылка"><button type="button" aria-label="Вставить ссылку"><IconPaperclip size={17} /></button></Tooltip>
            </div>
            <Textarea
              className="message-input"
              variant="unstyled"
              placeholder={`Написать в #${activeChannel?.name ?? 'канал'}`}
              autosize
              minRows={1}
              maxRows={5}
              aria-label="Текст сообщения"
              {...messageForm.getInputProps('text')}
              onKeyDown={(event) => {
                if (event.key === 'Enter' && !event.shiftKey) {
                  event.preventDefault();
                  submitMessage();
                }
              }}
            />
            <div className="composer-footer">
              <div className="composer-tools">
                <Tooltip label="Прикрепить файл"><button type="button" aria-label="Прикрепить файл"><IconPlus size={19} /></button></Tooltip>
                <Tooltip label="Эмодзи"><button type="button" aria-label="Добавить эмодзи"><IconMoodSmile size={19} /></button></Tooltip>
                <button type="button" className="composer-tool-text">Aa</button>
                <span className="toolbar-separator" />
                <button type="button" aria-label="Упоминание"><IconUsers size={18} /></button>
              </div>
              <div className="send-actions">
                <span>Enter — отправить</span>
                <Menu position="top-end" shadow="md" width={170}>
                  <Menu.Target><button type="button" className="send-dropdown" aria-label="Настройки отправки"><IconChevronDown size={13} /></button></Menu.Target>
                  <Menu.Dropdown><Menu.Item>Отправлять по Enter</Menu.Item><Menu.Item>Отправлять по Ctrl+Enter</Menu.Item></Menu.Dropdown>
                </Menu>
                <button type="submit" className="send-button" disabled={sendMutation.isPending || !messageForm.values.text.trim()} aria-label="Отправить сообщение"><IconSend size={17} /></button>
              </div>
            </div>
          </form>
        </div>
      </section>

      <Modal opened={isCreateOpen} onClose={() => { setCreateOpen(false); createForm.reset(); }} title="Создать канал" centered radius="lg" size="md">
        <form onSubmit={createForm.onSubmit(({ name }) => createMutation.mutate(name))}>
          <Stack gap="md">
            <Text size="sm" c="dimmed">Каналы помогают объединить обсуждения по темам. Участники команды смогут присоединиться к каналу.</Text>
            <TextInput label="Название" placeholder="например, команда-маркетинга" leftSection={<IconHash size={16} />} data-autofocus {...createForm.getInputProps('name')} />
            <Group justify="flex-end" mt="xs">
              <Button variant="default" onClick={() => { setCreateOpen(false); createForm.reset(); }}>Отмена</Button>
              <Button type="submit" loading={createMutation.isPending}>Создать</Button>
            </Group>
          </Stack>
        </form>
      </Modal>

      <Modal opened={isProfileOpen} onClose={() => setProfileOpen(false)} title="Ваш профиль" centered radius="lg" size="sm">
        <Stack align="center" gap="sm" py="sm">
          <div className="profile-modal-avatar"><UserAvatar person={currentUser} size={72} /><span className="online-dot" /></div>
          <Text fw={700} size="lg">{currentUser.name}</Text>
          <Badge color="green" variant="light" radius="xl">{currentUser.status}</Badge>
          <Text size="sm" c="dimmed">Вы в рабочем пространстве Hexlet команда</Text>
          <Button variant="light" fullWidth leftSection={<IconSettings size={17} />} onClick={() => setProfileOpen(false)}>Настроить профиль</Button>
        </Stack>
      </Modal>
    </main>
  );
}

export default App;
