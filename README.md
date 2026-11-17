# Hexlet Chat

Учебный чат на React с сервером `@hexlet/chat-server`, REST API и Socket.IO.

## Требования

- Node.js 22.12 или новее
- npm
- GNU Make для команд из `Makefile`

## Локальный запуск

```bash
make install
make develop
```

Откройте `http://localhost:5002`. Vite обслуживает клиент и проксирует REST API и Socket.IO на сервер `http://localhost:5001`.

## Production

```bash
make build
make start
```

Сервер обслуживает собранный клиент из `dist` и API. Порт задаётся переменной окружения `PORT` (по умолчанию `5001`). Для Render Blueprint используется файл `render.yaml`.

[![Deploy to Render](https://render.com/images/deploy-to-render-button.svg)](https://render.com/deploy?repo=https://github.com/wswfws/react-urfu-project-12)

## Стек

React, Vite, Mantine, Zustand, TanStack Query, `@mantine/form`, Socket.IO и `@hexlet/chat-server`.
