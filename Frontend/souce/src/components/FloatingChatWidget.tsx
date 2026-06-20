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
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, isTyping]);

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || isTyping) return;

        const userMsg = input.trim();
        setInput('');

        const updatedMessages = [...messages, { role: 'user' as const, text: userMsg }];
        setMessages(updatedMessages);
        setIsTyping(true);

        try {
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
        <div className="sp-chat-hub">
            {/* AI Chat Window Panel */}
            {settings.aiEnabled && isOpen && (
                <div className="sp-chat-window sp-chat-animate">
                    {/* Header */}
                    <header className="sp-chat-header">
                        <div className="sp-chat-header-brand">
                            <div className="sp-chat-avatar">
                                <i className="fas fa-robot" />
                                <span className="sp-chat-pulse" />
                            </div>
                            <div className="sp-chat-brand-info">
                                <h4 className="sp-chat-brand-name">SmooothPixel AI</h4>
                                <div className="sp-chat-status-row">
                                    <span className="sp-chat-status-dot" />
                                    <span className="sp-chat-status-label">Online · Always ready</span>
                                </div>
                            </div>
                        </div>
                        <button
                            type="button"
                            className="sp-chat-close"
                            onClick={() => setIsOpen(false)}
                            aria-label="Close Chat"
                        >
                            <i className="fas fa-times" />
                        </button>
                    </header>

                    {/* Messages Body */}
                    <div className="sp-chat-body">
                        {messages.map((msg, index) => (
                            <div key={index} className={`sp-msg-row ${msg.role}`}>
                                {msg.role === 'model' && (
                                    <div className="sp-msg-avatar">
                                        <i className="fas fa-robot" />
                                    </div>
                                )}
                                <div className={`sp-msg-bubble ${msg.role}`}>
                                    {msg.text}
                                </div>
                            </div>
                        ))}
                        {isTyping && (
                            <div className="sp-msg-row model">
                                <div className="sp-msg-avatar">
                                    <i className="fas fa-robot" />
                                </div>
                                <div className="sp-msg-bubble model sp-typing-dots">
                                    <span />
                                    <span />
                                    <span />
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input Footer */}
                    <form onSubmit={handleSendMessage} className="sp-chat-footer">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Ask anything about our services..."
                            disabled={isTyping}
                            className="sp-chat-input"
                        />
                        <button
                            type="submit"
                            disabled={!input.trim() || isTyping}
                            className="sp-chat-send"
                            aria-label="Send message"
                        >
                            <i className="fas fa-paper-plane" />
                        </button>
                    </form>
                </div>
            )}

            {/* Floating Trigger Buttons — stacked vertically, clear spacing from scroll-to-top */}
            <div className="sp-triggers">
                {/* Telegram Button */}
                {settings.telegramLink && (
                    <a
                        href={settings.telegramLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="sp-trigger sp-trigger-telegram"
                        title="Chat on Telegram"
                        aria-label="Open Telegram Chat"
                    >
                        <i className="fab fa-telegram-plane" />
                        <span className="sp-trigger-label">Telegram</span>
                    </a>
                )}

                {/* AI Assistant Button */}
                {settings.aiEnabled && (
                    <button
                        type="button"
                        onClick={() => setIsOpen(!isOpen)}
                        className={`sp-trigger sp-trigger-ai${isOpen ? ' sp-trigger-active' : ''}`}
                        title="AI Assistant"
                        aria-label="Toggle AI Chat"
                    >
                        <i className={isOpen ? "fas fa-times" : "fas fa-robot"} />
                        <span className="sp-trigger-label">{isOpen ? 'Close' : 'AI Chat'}</span>
                    </button>
                )}
            </div>

            <style>{`
                /* =====================================================================
                   SmooothPixel Floating Chat Hub — Brand-Consistent Premium Design
                   Brand: #ffae00 (amber) + #f54200 (orange) gradient
                ===================================================================== */

                .sp-chat-hub {
                    position: fixed;
                    bottom: 90px; /* sit above scroll-to-top button which is ~60px */
                    right: 24px;
                    z-index: 9999;
                    font-family: 'Plus Jakarta Sans', system-ui, -apple-system, 'Segoe UI', sans-serif;
                    display: flex;
                    flex-direction: column;
                    align-items: flex-end;
                    gap: 0;
                }

                /* ── Trigger Buttons ── */
                .sp-triggers {
                    display: flex;
                    flex-direction: column;
                    align-items: flex-end;
                    gap: 10px;
                }

                /* Each trigger is a pill shape: icon + label */
                .sp-trigger {
                    position: relative;
                    display: inline-flex;
                    align-items: center;
                    gap: 8px;
                    padding: 0 18px 0 14px;
                    height: 48px;
                    border-radius: 999px;
                    color: #ffffff;
                    text-decoration: none;
                    cursor: pointer;
                    border: none;
                    font-size: 18px;
                    font-family: 'Plus Jakarta Sans', system-ui, sans-serif;
                    font-weight: 700;
                    white-space: nowrap;
                    transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
                    box-sizing: border-box;
                }

                .sp-trigger-label {
                    font-size: 12.5px;
                    font-weight: 700;
                    letter-spacing: 0.01em;
                    line-height: 1;
                }

                /* Telegram */
                .sp-trigger-telegram {
                    background: linear-gradient(135deg, #37aee2 0%, #1e96c8 100%);
                    box-shadow: 0 6px 22px rgba(30, 150, 200, 0.45);
                }
                .sp-trigger-telegram:hover {
                    transform: translateX(-4px);
                    box-shadow: 0 10px 32px rgba(30, 150, 200, 0.55);
                    color: #ffffff;
                }

                /* AI Trigger */
                .sp-trigger-ai {
                    background: linear-gradient(135deg, #ffae00 0%, #f54200 100%);
                    box-shadow: 0 6px 22px rgba(255, 174, 0, 0.45);
                }
                .sp-trigger-ai:hover {
                    transform: translateX(-4px);
                    box-shadow: 0 10px 32px rgba(255, 174, 0, 0.55);
                }
                .sp-trigger-ai.sp-trigger-active {
                    background: rgba(15, 20, 36, 0.95);
                    border: 1.5px solid rgba(255, 174, 0, 0.4);
                    box-shadow: 0 6px 22px rgba(255, 174, 0, 0.2);
                }

                /* ── Chat Window ── */
                .sp-chat-window {
                    position: absolute;
                    bottom: calc(100% + 14px); /* always above the triggers row */
                    right: 0;
                    width: 376px;
                    max-height: 520px;
                    border-radius: 24px;
                    border: 1px solid rgba(255, 255, 255, 0.12);
                    background: rgba(10, 14, 28, 0.92);
                    backdrop-filter: blur(28px) saturate(180%);
                    -webkit-backdrop-filter: blur(28px) saturate(180%);
                    box-shadow:
                        0 0 0 1px rgba(255, 174, 0, 0.08),
                        0 20px 60px rgba(0, 0, 0, 0.55),
                        inset 0 1px 0 rgba(255, 255, 255, 0.06);
                    display: flex;
                    flex-direction: column;
                    overflow: hidden;
                    transform-origin: bottom right;
                }

                @media (max-width: 520px) {
                    .sp-chat-window {
                        width: calc(100vw - 36px);
                        right: -4px;
                        max-height: 460px;
                    }
                    .sp-chat-hub {
                        bottom: 80px;
                        right: 16px;
                    }
                    .sp-trigger {
                        padding: 0 14px 0 12px;
                        height: 44px;
                        font-size: 16px;
                    }
                    .sp-trigger-label { font-size: 11.5px; }
                }

                /* Chat open animation */
                .sp-chat-animate {
                    animation: spChatSlideUp 0.38s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
                }
                @keyframes spChatSlideUp {
                    from { opacity: 0; transform: scale(0.85) translateY(24px); }
                    to   { opacity: 1; transform: scale(1) translateY(0); }
                }

                /* ── Header ── */
                .sp-chat-header {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    padding: 16px 20px;
                    background: linear-gradient(135deg, rgba(255, 174, 0, 0.08) 0%, rgba(245, 66, 0, 0.04) 100%);
                    border-bottom: 1px solid rgba(255, 255, 255, 0.07);
                    flex-shrink: 0;
                }

                .sp-chat-header-brand {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                }

                .sp-chat-avatar {
                    width: 42px;
                    height: 42px;
                    border-radius: 50%;
                    background: linear-gradient(135deg, rgba(255, 174, 0, 0.2), rgba(245, 66, 0, 0.15));
                    border: 1.5px solid rgba(255, 174, 0, 0.3);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 18px;
                    color: #ffae00;
                    position: relative;
                    flex-shrink: 0;
                }

                .sp-chat-pulse {
                    position: absolute;
                    bottom: 1px;
                    right: 1px;
                    width: 11px;
                    height: 11px;
                    border-radius: 50%;
                    background: #10b981;
                    border: 2px solid rgba(10, 14, 28, 0.92);
                    animation: spPulse 2.2s ease-in-out infinite;
                }

                @keyframes spPulse {
                    0%, 100% { box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.7); }
                    60%       { box-shadow: 0 0 0 6px rgba(16, 185, 129, 0); }
                }

                .sp-chat-brand-info {
                    display: flex;
                    flex-direction: column;
                    gap: 3px;
                }

                .sp-chat-brand-name {
                    margin: 0;
                    font-size: 15px;
                    font-weight: 700;
                    color: #ffffff;
                    letter-spacing: -0.01em;
                    line-height: 1.2;
                }

                .sp-chat-status-row {
                    display: flex;
                    align-items: center;
                    gap: 5px;
                }

                .sp-chat-status-dot {
                    width: 6px;
                    height: 6px;
                    border-radius: 50%;
                    background: #10b981;
                    flex-shrink: 0;
                }

                .sp-chat-status-label {
                    font-size: 11px;
                    color: rgba(255, 255, 255, 0.45);
                    font-weight: 500;
                }

                .sp-chat-close {
                    width: 32px;
                    height: 32px;
                    border-radius: 50%;
                    background: rgba(255, 255, 255, 0.06);
                    border: 1px solid rgba(255, 255, 255, 0.08);
                    color: rgba(255, 255, 255, 0.5);
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 14px;
                    transition: all 0.2s ease;
                    flex-shrink: 0;
                }
                .sp-chat-close:hover {
                    background: rgba(255, 255, 255, 0.1);
                    color: #ffffff;
                    border-color: rgba(255, 255, 255, 0.15);
                }

                /* ── Messages Body ── */
                .sp-chat-body {
                    flex: 1;
                    padding: 20px 18px;
                    overflow-y: auto;
                    display: flex;
                    flex-direction: column;
                    gap: 14px;
                    scroll-behavior: smooth;
                }

                .sp-chat-body::-webkit-scrollbar { width: 4px; }
                .sp-chat-body::-webkit-scrollbar-track { background: transparent; }
                .sp-chat-body::-webkit-scrollbar-thumb {
                    background: rgba(255, 174, 0, 0.15);
                    border-radius: 99px;
                }

                .sp-msg-row {
                    display: flex;
                    align-items: flex-end;
                    gap: 8px;
                    max-width: 88%;
                }

                .sp-msg-row.user {
                    align-self: flex-end;
                    flex-direction: row-reverse;
                }

                .sp-msg-row.model {
                    align-self: flex-start;
                }

                .sp-msg-avatar {
                    width: 30px;
                    height: 30px;
                    border-radius: 50%;
                    background: linear-gradient(135deg, rgba(255, 174, 0, 0.15), rgba(245, 66, 0, 0.1));
                    border: 1px solid rgba(255, 174, 0, 0.2);
                    color: #ffae00;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 12px;
                    flex-shrink: 0;
                }

                .sp-msg-bubble {
                    padding: 11px 15px;
                    border-radius: 18px;
                    font-size: 13.5px;
                    line-height: 1.55;
                    white-space: pre-line;
                    word-break: break-word;
                }

                .sp-msg-bubble.model {
                    background: rgba(255, 255, 255, 0.06);
                    border: 1px solid rgba(255, 255, 255, 0.08);
                    color: rgba(255, 255, 255, 0.88);
                    border-bottom-left-radius: 5px;
                }

                .sp-msg-bubble.user {
                    background: linear-gradient(135deg, #ffae00 0%, #f54200 100%);
                    color: #ffffff;
                    border-bottom-right-radius: 5px;
                    box-shadow: 0 4px 16px rgba(255, 174, 0, 0.35);
                }

                /* Typing indicator */
                .sp-typing-dots {
                    display: flex;
                    gap: 5px;
                    padding: 14px 18px !important;
                    align-items: center;
                }
                .sp-typing-dots span {
                    width: 7px;
                    height: 7px;
                    border-radius: 50%;
                    background: rgba(255, 174, 0, 0.6);
                    animation: spTypingBounce 1.4s infinite ease-in-out both;
                }
                .sp-typing-dots span:nth-child(1) { animation-delay: -0.32s; }
                .sp-typing-dots span:nth-child(2) { animation-delay: -0.16s; }

                @keyframes spTypingBounce {
                    0%, 80%, 100% { transform: scale(0.6); opacity: 0.4; }
                    40%           { transform: scale(1.0); opacity: 1; }
                }

                /* ── Input Footer ── */
                .sp-chat-footer {
                    padding: 12px 14px;
                    background: rgba(255, 255, 255, 0.02);
                    border-top: 1px solid rgba(255, 255, 255, 0.06);
                    display: flex;
                    gap: 8px;
                    align-items: center;
                    flex-shrink: 0;
                }

                .sp-chat-input {
                    flex: 1;
                    background: rgba(255, 255, 255, 0.06);
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    border-radius: 14px;
                    padding: 10px 14px;
                    color: #ffffff;
                    font-size: 13.5px;
                    font-family: 'Plus Jakarta Sans', system-ui, sans-serif;
                    transition: border-color 0.2s ease, background 0.2s ease;
                    outline: none;
                }
                .sp-chat-input::placeholder {
                    color: rgba(255, 255, 255, 0.3);
                }
                .sp-chat-input:focus {
                    border-color: rgba(255, 174, 0, 0.45);
                    background: rgba(255, 174, 0, 0.04);
                }
                .sp-chat-input:disabled {
                    opacity: 0.6;
                    cursor: not-allowed;
                }

                .sp-chat-send {
                    width: 42px;
                    height: 42px;
                    flex-shrink: 0;
                    border-radius: 50%;
                    background: linear-gradient(135deg, #ffae00 0%, #f54200 100%);
                    border: none;
                    color: #ffffff;
                    font-size: 14px;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    transition: transform 0.2s ease, box-shadow 0.2s ease, opacity 0.2s ease;
                    box-shadow: 0 4px 16px rgba(255, 174, 0, 0.4);
                }
                .sp-chat-send:hover:not(:disabled) {
                    transform: scale(1.08);
                    box-shadow: 0 8px 24px rgba(255, 174, 0, 0.5);
                }
                .sp-chat-send:disabled {
                    opacity: 0.4;
                    cursor: not-allowed;
                    box-shadow: none;
                }
            `}</style>
        </div>
    );
};

export default FloatingChatWidget;
