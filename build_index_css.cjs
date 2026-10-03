const fs = require('fs');

const styleLive = fs.readFileSync('style_live.css', 'utf8').replace(/^\uFEFF/, '');

const chatbotStyles = `
/* ===== CHATBOT OFFICIAL LIVE STYLES ===== */
#chatbot-widget {
  position: fixed;
  bottom: 24px;
  right: 24px;
  z-index: 9999;
  font-family: 'Inter', sans-serif;
}
#chatbot-toggle {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: var(--coral, #4A7FB8);
  color: #fff;
  border: none;
  box-shadow: 0 8px 24px rgba(240, 98, 77, 0.5), 0 0 20px rgba(240, 98, 77, 0.3);
  font-size: 28px;
  line-height: 1;
  cursor: pointer;
  animation: chatbotHalo 3s ease-in-out infinite alternate;
  transition: transform 0.3s ease, background 0.3s ease, box-shadow 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}
#chatbot-toggle:hover {
  transform: scale(1.08);
  background: #3c6ba0;
  box-shadow: 0 12px 32px rgba(240, 98, 77, 0.75), 0 0 36px rgba(240, 98, 77, 0.55);
}
@keyframes chatbotHalo {
  0% {
    box-shadow: 0 8px 24px rgba(240, 98, 77, 0.45), 0 0 18px rgba(240, 98, 77, 0.25);
  }
  100% {
    box-shadow: 0 12px 30px rgba(240, 98, 77, 0.65), 0 0 32px rgba(240, 98, 77, 0.45);
  }
}
#chatbot-window {
  position: absolute;
  bottom: 80px;
  right: 0;
  width: 380px;
  max-width: 90vw;
  height: 520px;
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 20px 60px rgba(0,0,0,0.18);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  border: 1px solid var(--border, #E7E9ED);
}
#chatbot-header {
  background: var(--navy, #0B1A31);
  color: #fff;
  padding: 16px 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-shrink: 0;
}
#chatbot-title {
  font-family: 'Sora', sans-serif;
  font-weight: 700;
  font-size: 15px;
  display: flex;
  align-items: center;
  gap: 8px;
}
#chatbot-minimize {
  background: none;
  border: none;
  color: #fff;
  font-size: 20px;
  cursor: pointer;
  padding: 0 4px;
  line-height: 1;
}
#chatbot-messages {
  flex: 1;
  padding: 16px 20px;
  overflow-y: auto;
  background: #f8fafc;
  display: flex;
  flex-direction: column;
}
.bot-message, .user-message {
  margin-bottom: 12px;
  max-width: 85%;
  padding: 11px 15px;
  border-radius: 14px;
  font-size: 14px;
  line-height: 1.5;
  word-wrap: break-word;
}
.bot-message {
  background: #fff;
  border: 1px solid var(--border, #E7E9ED);
  align-self: flex-start;
  border-bottom-left-radius: 4px;
  color: var(--ink, #16213A);
}
.user-message {
  background: var(--coral, #4A7FB8);
  color: #fff;
  align-self: flex-end;
  border-bottom-right-radius: 4px;
  margin-left: auto;
}
#chatbot-input-area {
  display: flex;
  border-top: 1px solid var(--border, #E7E9ED);
  padding: 8px 12px;
  background: #fff;
  flex-shrink: 0;
  gap: 8px;
}
#chatbot-input {
  flex: 1;
  border: none;
  outline: none;
  padding: 10px 8px;
  font-size: 14px;
  font-family: inherit;
  background: transparent;
}
#chatbot-send {
  background: var(--coral, #4A7FB8);
  border: none;
  color: #fff;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  font-size: 16px;
  cursor: pointer;
  transition: background 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
}
#chatbot-send:hover {
  background: #3c6ba0;
}
.typing-indicator {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 12px;
}
.typing-indicator span {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: #94a3b8;
  display: inline-block;
  animation: typing 1.2s infinite ease-in-out;
}
.typing-indicator span:nth-child(2) { animation-delay: 0.2s; }
.typing-indicator span:nth-child(3) { animation-delay: 0.4s; }
@keyframes typing {
  0%, 60%, 100% { transform: translateY(0); }
  30% { transform: translateY(-6px); }
}
.bot-options {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin: 6px 0 12px 0;
}
.bot-option-btn {
  background: #fff;
  border: 1.5px solid #d1d5db;
  border-radius: 20px;
  padding: 6px 14px;
  font-size: 12.5px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  color: var(--navy);
  display: inline-flex;
  align-items: center;
  gap: 4px;
}
.bot-option-btn:hover {
  background: var(--coral);
  border-color: var(--coral);
  color: #fff;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(74,127,184,0.3);
}
@media (max-width: 768px) {
  #chatbot-window {
    position: fixed !important;
    top: 0 !important;
    left: 0 !important;
    right: 0 !important;
    bottom: 0 !important;
    inset: 0 !important;
    width: 100vw !important;
    width: 100% !important;
    max-width: 100vw !important;
    height: 100% !important;
    height: 100dvh !important;
    border-radius: 0 !important;
    box-shadow: none !important;
    border: none !important;
    z-index: 1000000 !important;
    display: flex !important;
    flex-direction: column !important;
  }
}
`;

const cleanedStyle = styleLive.replace(/@import\s+url\([^)]+\);?/g, '').trim();

const finalCss = `@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Sora:wght@600;700;800;900&display=swap');

@tailwind base;
@tailwind components;
@tailwind utilities;

${cleanedStyle}

${chatbotStyles}
`;

fs.writeFileSync('src/index.css', finalCss, 'utf8');
console.log('src/index.css updated successfully!');
