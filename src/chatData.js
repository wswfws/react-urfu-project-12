async function request(path, { token, method = 'GET', body } = {}) {
  const response = await fetch(`/api/v1${path}`, {
    method,
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(body ? { 'Content-Type': 'application/json' } : {}),
    },
    ...(body ? { body: JSON.stringify(body) } : {}),
  });

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    const error = new Error(data.message ?? data.error ?? `Ошибка сервера (${response.status})`);
    error.status = response.status;
    throw error;
  }
  return data;
}

export const signUp = (username, password) => request('/signup', {
  method: 'POST',
  body: { username, password },
});

export const logIn = (username, password) => request('/login', {
  method: 'POST',
  body: { username, password },
});

export const getChannels = (token) => request('/channels', { token });

export const getMessages = (token) => request('/messages', { token });

export const createChannel = (token, name) => request('/channels', {
  token,
  method: 'POST',
  body: { name },
});

export const sendMessage = (token, { channelId, username, body }) => request('/messages', {
  token,
  method: 'POST',
  body: { channelId, username, body },
});
