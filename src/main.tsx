import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.tsx';
import { AuthProvider } from './store/authContext.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {/*
      AuthProvider bọc toàn bộ app để cung cấp auth state global.
      Các module bất kỳ có thể dùng: const { user, token, isAuthenticated } = useAuth()
    */}
    <AuthProvider>
      <App />
    </AuthProvider>
  </StrictMode>,
);
