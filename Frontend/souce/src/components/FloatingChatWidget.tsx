import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import apiClient from '../lib/apiClient';

interface ChatMessage {
    role: 'user' | 'model';
    text: string;
}

interface SiteSettings {
    telegramLink?: string;
    aiEnabled: boolean;
    aiWelcomeMessage?: string;
}

const FloatingChatWidget: React.FC = () => {
    const location = useLocation();
    const [settings, setSettings] = useState<SiteSettings>({
        telegramLink: 'https://t.me/SmooothPixel',
        aiEnabled: true,
        aiWelcomeMessage: 'Hello! Welcome to SmooothPixel Studio. How can I help you today?'
    });
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [hasInitiated, setHasInitiated] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Hide widget on admin pages
    if (location.pathname.startsWith('/admin') || location.pathname.startsWith('/login')) {
        return null;
    }

    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const { data } = await apiClient.get('/SiteSettings');
                if (data) {
                    setSettings({
                        telegramLink: data.telegramLink || data.TelegramLink || 'https://t.me/SmooothPixel',
                        aiEnabled: data.aiEnabled ?? data.AiEnabled ?? true,
                        aiWelcomeMessage: data.aiWelcomeMessage || data.AiWelcomeMessage || 'Hello! Welcome to SmooothPixel Studio. How can I help you today?'
                    });
                }
            } catch (err) {
                console.error("Failed to load chat configurations:", err);
            }
        };
        fetchSettings();
    }, []);

    useEffect(() => {
        if (isOpen && !hasInitiated) {
            setMessages([
                {
                    role: 'model',
                    text: settings.aiWelcomeMessage || 'Hello! Welcome to SmooothPixel Studio. How can I help you today?'
                }
            ]);
            setHasInitiated(true);
        }
    }, [isOpen, hasInitiated, settings.aiWelcomeMessage]);

    useEffect(() => {
        // Auto scroll to bottom
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, isTyping]);

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || isTyping) return;

        const userMsg = input.trim();
        setInput('');
        
        // Append user message
        const updatedMessages = [...messages, { role: 'user' as const, text: userMsg }];
        setMessages(updatedMessages);
        setIsTyping(true);

        try {
            // Map our client-side messages history to ChatMessage structures expected by .NET backend
            const payload = {
                message: userMsg,
                history: messages.map(m => ({
                    role: m.role,
                    text: m.text
                }))
            };

            const { data } = await apiClient.post('/ai/chat', payload);
            
            if (data && data.response) {
                setMessages(prev => [...prev, { role: 'model', text: data.response }]);
            } else {
                setMessages(prev => [...prev, { role: 'model', text: "I'm having trouble connecting right now. Please reach out to us directly on Telegram!" }]);
            }
        } catch (err) {
            console.error("Chat error:", err);
            setMessages(prev => [...prev, { role: 'model', text: "Sorry, I encountered an error. Please try again or contact us directly on Telegram." }]);
        } finally {
            setIsTyping(false);
        }
    };

    return (
        <div className="floating-interaction-hub">
            {/* AI Chat Window Panel */}
            {settings.aiEnabled && isOpen && (
                <div className="sp-ai-chat-window animate-scale-up">
                    <header className="sp-ai-chat-header">
                        <div className="sp-ai-chat-header-info">
                            <div className="sp-ai-avatar">
                                <i className="fas fa-robot" />
                                <span className="sp-ai-status-pulse" />
                            </div>
                            <div>
                                <h4 className="sp-ai-name">SmooothPixel AI</h4>
                                <span className="sp-ai-status">Online Assistant</span>
                            </div>
                        </div>
                        <button 
                            type="button" 
                            className="sp-ai-close-btn"
                            onClick={() => setIsOpen(false)}
                            aria-label="Close Chat"
                        >
                            <i className="fas fa-times" />
                        </button>
                    </header>

                    <div className="sp-ai-chat-body">
                        {messages.map((msg, index) => (
                            <div key={index} className={`sp-ai-msg-bubble-wrap ${msg.role}`}>
                                {msg.role === 'model' && (
                                    <div className="sp-ai-bubble-avatar">
                                        <i className="fas fa-robot" />
                                    </div>
                                )}
                                <div className={`sp-ai-msg-bubble ${msg.role}`}>
                                    {msg.text}
                                </div>
                            </div>
                        ))}
                        {isTyping && (
                            <div className="sp-ai-msg-bubble-wrap model">
                                <div className="sp-ai-bubble-avatar">
                                    <i className="fas fa-robot" />
                                </div>
                                <div className="sp-ai-msg-bubble model sp-ai-typing-indicator">
                                    <span />
                                    <span />
                                    <span />
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    <form onSubmit={handleSendMessage} className="sp-ai-chat-footer">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Type a message..."
                            disabled={isTyping}
                            className="sp-ai-chat-input"
                        />
                        <button 
                            type="submit" 
                            disabled={!input.trim() || isTyping} 
                            className="sp-ai-chat-send"
                        >
                            <i className="fas fa-paper-plane" />
                        </button>
                    </form>
                </div>
            )}

            {/* Floating Action Trigger Buttons */}
            <div className="floating-triggers-container">
                {/* Telegram Widget Icon */}
                {settings.telegramLink && (
                    <a
                        href={settings.telegramLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="sp-floating-trigger telegram-trigger"
                        title="Quick Telegram Chat"
                    >
                        <i className="fab fa-telegram-plane" />
                    </a>
                )}

                {/* AI Assistant Icon */}
                {settings.aiEnabled && (
                    <button
                        type="button"
                        onClick={() => setIsOpen(!isOpen)}
                        className={`sp-floating-trigger ai-trigger ${isOpen ? 'active' : ''}`}
                        title="AI Assistant Chat"
                    >
                        <i className={isOpen ? "fas fa-times" : "fas fa-robot"} />
                    </button>
                )}
            </div>

            {/* Embedded styles for perfect self-contained glassmorphism */}
            <style>{`
                .floating-interaction-hub {
                    position: fixed;
                    bottom: 24px;
                    right: 24px;
                    z-index: 9999;
                    font-family: 'Outfit', sans-serif;
                }

                .floating-triggers-container {
                    display: flex;
                    flex-direction: column;
                    gap: 12px;
                    align-items: center;
                }

                .sp-floating-trigger {
                    width: 52px;
                    height: 52px;
                    border-radius: 50%;
                    border: 1px solid rgba(255, 255, 255, 0.12);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 20px;
                    color: #ffffff;
                    text-decoration: none;
                    cursor: pointer;
                    transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
                    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
                }

                .telegram-trigger {
                    background: linear-gradient(135deg, #37aee2, #1e96c8);
                }
                .telegram-trigger:hover {
                    transform: translateY(-4px);
                    box-shadow: 0 12px 36px rgba(30, 150, 200, 0.5);
                    color: #ffffff;
                }

                .ai-trigger {
                    background: linear-gradient(135deg, #a78bfa, #8b5cf6);
                }
                .ai-trigger:hover {
                    transform: translateY(-4px);
                    box-shadow: 0 12px 36px rgba(139, 92, 246, 0.5);
                }
                .ai-trigger.active {
                    transform: rotate(90deg);
                    background: #1e1b4b;
                    border-color: rgba(139, 92, 246, 0.4);
                }

                /* AI Chat Window */
                .sp-ai-chat-window {
                    position: absolute;
                    bottom: 70px;
                    right: 0;
                    width: 360px;
                    height: 480px;
                    border-radius: 20px;
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    background: rgba(15, 23, 42, 0.85);
                    backdrop-filter: blur(20px);
                    -webkit-backdrop-filter: blur(20px);
                    box-shadow: 0 12px 40px rgba(0, 0, 0, 0.5);
                    display: flex;
                    flex-direction: column;
                    overflow: hidden;
                    transform-origin: bottom right;
                }

                @media (max-width: 480px) {
                    .sp-ai-chat-window {
                        width: calc(100vw - 32px);
                        right: -8px;
                        height: 420px;
                    }
                }

                .sp-ai-chat-header {
                    padding: 16px 20px;
                    background: rgba(255, 255, 255, 0.03);
                    border-bottom: 1px solid rgba(255, 255, 255, 0.08);
                    display: flex;
                    align-items: center;
                    justify-content: justify;
                    justify-content: space-between;
                }

                .sp-ai-chat-header-info {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                }

                .sp-ai-avatar {
                    width: 38px;
                    height: 38px;
                    border-radius: 50%;
                    background: rgba(139, 92, 246, 0.2);
                    border: 1px solid rgba(139, 92, 246, 0.4);
                    color: #a78bfa;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 16px;
                    position: relative;
                }

                .sp-ai-status-pulse {
                    position: absolute;
                    bottom: 0;
                    right: 0;
                    width: 10px;
                    height: 10px;
                    border-radius: 50%;
                    background: #10b981;
                    border: 2px solid #0f172a;
                    animation: statusPulse 2s infinite;
                }

                @keyframes statusPulse {
                    0% { box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.7); }
                    70% { box-shadow: 0 0 0 6px rgba(16, 185, 129, 0); }
                    100% { box-shadow: 0 0 0 0 rgba(16, 185, 129, 0); }
                }

                .sp-ai-name {
                    margin: 0;
                    font-size: 14px;
                    font-weight: 700;
                    color: #ffffff;
                }

                .sp-ai-status {
                    font-size: 11px;
                    color: rgba(255, 255, 255, 0.5);
                }

                .sp-ai-close-btn {
                    background: transparent;
                    border: none;
                    color: rgba(255, 255, 255, 0.5);
                    font-size: 18px;
                    cursor: pointer;
                    transition: color 0.2s;
                }
                .sp-ai-close-btn:hover {
                    color: #ffffff;
                }

                .sp-ai-chat-body {
                    flex: 1;
                    padding: 20px;
                    overflow-y: auto;
                    display: flex;
                    flex-direction: column;
                    gap: 16px;
                }

                .sp-ai-chat-body::-webkit-scrollbar {
                    width: 6px;
                }
                .sp-ai-chat-body::-webkit-scrollbar-track {
                    background: transparent;
                }
                .sp-ai-chat-body::-webkit-scrollbar-thumb {
                    background: rgba(255, 255, 255, 0.1);
                    border-radius: 10px;
                }

                .sp-ai-msg-bubble-wrap {
                    display: flex;
                    align-items: flex-end;
                    gap: 8px;
                    max-width: 85%;
                }

                .sp-ai-msg-bubble-wrap.user {
                    align-self: flex-end;
                    flex-direction: row-reverse;
                }

                .sp-ai-bubble-avatar {
                    width: 28px;
                    height: 28px;
                    border-radius: 50%;
                    background: rgba(255, 255, 255, 0.05);
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    color: rgba(255, 255, 255, 0.6);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 11px;
                    flex-shrink: 0;
                }

                .sp-ai-msg-bubble {
                    padding: 12px 16px;
                    border-radius: 16px;
                    font-size: 13px;
                    line-height: 1.5;
                    white-space: pre-line;
                }

                .sp-ai-msg-bubble.model {
                    background: rgba(255, 255, 255, 0.06);
                    border: 1px solid rgba(255, 255, 255, 0.08);
                    color: rgba(255, 255, 255, 0.9);
                    border-bottom-left-radius: 4px;
                }

                .sp-ai-msg-bubble.user {
                    background: linear-gradient(135deg, #a78bfa, #8b5cf6);
                    color: #ffffff;
                    border-bottom-right-radius: 4px;
                }

                /* Typing Indicator */
                .sp-ai-typing-indicator {
                    display: flex;
                    gap: 4px;
                    padding: 12px 18px !important;
                }
                .sp-ai-typing-indicator span {
                    width: 6px;
                    height: 6px;
                    border-radius: 50%;
                    background: rgba(255, 255, 255, 0.5);
                    animation: typingBounce 1.4s infinite ease-in-out both;
                }
                .sp-ai-typing-indicator span:nth-child(1) { animation-delay: -0.32s; }
                .sp-ai-typing-indicator span:nth-child(2) { animation-delay: -0.16s; }

                @keyframes typingBounce {
                    0%, 80%, 100% { transform: scale(0); }
                    40% { transform: scale(1.0); }
                }

                .sp-ai-chat-footer {
                    padding: 12px 16px;
                    background: rgba(255, 255, 255, 0.02);
                    border-top: 1px solid rgba(255, 255, 255, 0.08);
                    display: flex;
                    gap: 8px;
                }

                .sp-ai-chat-input {
                    flex: 1;
                    background: rgba(255, 255, 255, 0.05);
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    border-radius: 12px;
                    padding: 10px 14px;
                    color: #ffffff;
                    font-size: 13px;
                    transition: border-color 0.2s;
                }
                .sp-ai-chat-input:focus {
                    outline: none;
                    border-color: rgba(139, 92, 246, 0.5);
                }

                .sp-ai-chat-send {
                    background: linear-gradient(135deg, #a78bfa, #8b5cf6);
                    border: none;
                    border-radius: 12px;
                    width: 38px;
                    height: 38px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: #ffffff;
                    cursor: pointer;
                    transition: transform 0.2s, opacity 0.2s;
                }
                .sp-ai-chat-send:hover:not(:disabled) {
                    transform: scale(1.05);
                }
                .sp-ai-chat-send:disabled {
                    opacity: 0.5;
                    cursor: not-allowed;
                }

                /* Animation */
                .animate-scale-up {
                    animation: scaleUp 0.3s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
                }
                @keyframes scaleUp {
                    from { transform: scale(0.8) translateY(20px); opacity: 0; }
                    to { transform: scale(1) translateY(0); opacity: 1; }
                }
            `}</style>
        </div>
    );
};

export default FloatingChatWidget;
