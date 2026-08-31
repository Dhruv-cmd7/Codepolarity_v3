import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import fs from 'fs'
import path from 'path'

// Copy the user-provided code editor mockup to assets
try {
  const srcPath = "C:/Users/LENOVO/.gemini/antigravity-ide/brain/9c240545-a998-4b47-bfe4-0a9ee41eea26/media__1787933410821.jpg";
  const destDir = path.resolve('src/assets');
  const destPath = path.join(destDir, 'code_editor_illustration.jpg');
  
  if (fs.existsSync(srcPath)) {
    if (!fs.existsSync(destDir)) {
      fs.mkdirSync(destDir, { recursive: true });
    }
    fs.copyFileSync(srcPath, destPath);
    console.log('[Vite Config] Successfully copied user code editor mockup.');
  }
} catch (err) {
  console.error('[Vite Config] Copy asset warning:', err);
}


// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
        secure: false
      }
    }
  }
})
