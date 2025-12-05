import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Carrega variáveis de ambiente (como API_KEY) do sistema ou arquivo .env
  // Fix: Property 'cwd' does not exist on type 'Process'. Casting to any to allow usage in Node environment.
  const env = loadEnv(mode, (process as any).cwd(), '');
  
  return {
    plugins: [react()],
    define: {
      // Garante que process.env.API_KEY funcione no código do navegador
      'process.env.API_KEY': JSON.stringify(env.API_KEY)
    }
  };
});