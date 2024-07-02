import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  server:{
    proxy:{
      '/api':{
        target:'https://white-board-sharing-app-n497.vercel.app',
        secure:true,
        changeOrigin:true
      },
    },
  },
  plugins: [react()],
});
