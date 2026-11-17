import { MantineProvider, createTheme } from '@mantine/core';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import '@mantine/core/styles.css';
import './styles.css';
import App from './App.jsx';

const theme = createTheme({
  primaryColor: 'violet',
  fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
  defaultRadius: 'md',
  colors: {
    violet: ['#f5eff8', '#e9def0', '#d6c2e2', '#c1a4d2', '#aa82c0', '#9469ac', '#805694', '#6c467d', '#593a67', '#472e51'],
  },
});

const init = async (socket) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { staleTime: 30_000, refetchOnWindowFocus: false, retry: false },
    },
  });

  return (
    <MantineProvider theme={theme}>
      <QueryClientProvider client={queryClient}>
        <App socket={socket} />
      </QueryClientProvider>
    </MantineProvider>
  );
};

export default init;
