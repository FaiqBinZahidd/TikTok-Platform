import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, User, Bot, ArrowRight } from 'lucide-react';
import { getBotResponse } from '../../utils/chatBotLogic';

// Helper to parse simple markdown (bold, bullets, newlines)
const formatMessage = (text) => {
    return text.split('\n').map((line, i) => {
        // 1. Handle Bullet Points
        if (line.trim().startsWith('-')) {
            return (
                <div key={i} className="flex gap-2 ml-2 mb-1">
                    <span className="text-violet-400 font-bold">•</span>
                    <span dangerouslySetInnerHTML={{
                        __html: line.substring(1).replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                    }} />
                </div>
            );
        }

        // 2. Handle Empty Lines (Paragraph breaks)
        if (!line.trim()) {
            return <div key={i} className="h-2"></div>;
        }

        // 3. Handle Standard Text with Bold Support
        return (
            <div key={i} className="mb-0.5" dangerouslySetInnerHTML={{
                __html: line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            }} />
        );
    });
};

const ChatWidget = ({ setActiveView }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { id: 1, text: "Hi! How can I help you manage your shop today?", sender: 'bot' }
    ]);
    const [inputValue, setInputValue] = useState("");
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSend = () => {
        if (!inputValue.trim()) return;

        // 1. Add User Message
        const userMsg = { id: Date.now(), text: inputValue, sender: 'user' };
        setMessages(prev => [...prev, userMsg]);
        setInputValue("");

        // 2. Simulate Bot Typing & Response
        setTimeout(() => {
            const botResponse = getBotResponse(userMsg.text);
            const text = botResponse.text || botResponse;
            const action = botResponse.action;

            const botMsg = { id: Date.now() + 1, text, action, sender: 'bot' };
            setMessages(prev => [...prev, botMsg]);
        }, 600);
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') handleSend();
    };

    return (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end pointer-events-none">

            {/* Chat Window */}
            {isOpen && (
                <div className="pointer-events-auto w-80 md:w-96 bg-white/90 backdrop-blur-xl border border-white/20 shadow-2xl rounded-2xl mb-4 overflow-hidden animate-in fade-in slide-in-from-bottom-10 flex flex-col h-[500px]">

                    {/* Header */}
                    <div className="p-4 bg-slate-900 text-white flex justify-between items-center">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-violet-500 flex items-center justify-center">
                                <Bot className="w-5 h-5 text-white" />
                            </div>
                            <div>
                                <h3 className="font-bold text-sm">Quantro Support</h3>
                                <p className="text-[10px] text-slate-300 flex items-center gap-1">
                                    <span className="w-1.5 h-1.5 bg-green-400 rounded-full"></span> Online
                                </p>
                            </div>
                        </div>
                        <button onClick={() => setIsOpen(false)} className="text-white/70 hover:text-white transition-colors">
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Messages Area */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/50">
                        {messages.map((msg, idx) => (
                            <div key={msg.id}>
                                <div className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                                    <div className={`max-w-[85%] p-3 rounded-2xl text-sm shadow-sm ${msg.sender === 'user'
                                        ? 'bg-violet-600 text-white rounded-tr-sm'
                                        : 'bg-white border border-slate-200 text-slate-700 rounded-tl-sm'
                                        }`}>
                                        {msg.sender === 'user' ? msg.text : formatMessage(msg.text)}
                                    </div>
                                </div>

                                {/* Action Button */}
                                {msg.action && (
                                    <div className="mt-2 ml-1 animate-in fade-in slide-in-from-left-2">
                                        <button
                                            onClick={() => {
                                                if (setActiveView && msg.action.view) {
                                                    setActiveView(msg.action.view);
                                                    setIsOpen(false);
                                                }
                                            }}
                                            className="flex items-center gap-2 px-4 py-2 bg-violet-100 text-violet-700 text-xs font-bold rounded-xl hover:bg-violet-200 transition-colors border border-violet-200 shadow-sm"
                                        >
                                            {msg.action.label} <ArrowRight className="w-3 h-3" />
                                        </button>
                                    </div>
                                )}

                                {/* Smart Suggestions (only after first bot message) */}
                                {msg.sender === 'bot' && idx === 0 && (
                                    <div className="flex flex-wrap gap-2 mt-3 ml-1">
                                        {[
                                            "📊 What features do you offer?",
                                            "❓ How do I import data?",
                                            "🔍 What's a good CVR?",
                                            "🎯 TikTok tips?"
                                        ].map((suggestion, i) => (
                                            <button
                                                key={i}
                                                onClick={() => {
                                                    setInputValue(suggestion.replace(/^[\p{Emoji}\s]+/u, ''));
                                                    setTimeout(() => handleSend(), 100);
                                                }}
                                                className="text-[10px] px-2.5 py-1.5 bg-violet-50 hover:bg-violet-100 text-violet-700 rounded-full border border-violet-200 transition-colors font-medium"
                                            >
                                                {suggestion}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ))}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input Area */}
                    <div className="p-3 bg-white border-t border-slate-100">
                        <div className="flex items-center gap-2 bg-slate-50 rounded-full px-4 py-2 border border-slate-200 focus-within:ring-2 focus-within:ring-violet-500/20 transition-all">
                            <input
                                type="text"
                                placeholder="Type a message..."
                                className="flex-1 bg-transparent text-sm focus:outline-none text-slate-700"
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                                onKeyDown={handleKeyPress}
                            />
                            <button
                                onClick={handleSend}
                                disabled={!inputValue.trim()}
                                className="p-1.5 bg-violet-600 text-white rounded-full hover:bg-violet-700 disabled:opacity-50 disabled:hover:bg-violet-600 transition-colors"
                            >
                                <Send className="w-3.5 h-3.5" />
                            </button>
                        </div>
                        <p className="text-[10px] text-center text-slate-400 mt-2">
                            Powered by Quantro Auto-Bot (Free)
                        </p>
                    </div>
                </div>
            )}

            {/* Toggle Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="pointer-events-auto w-14 h-14 bg-violet-600 hover:bg-violet-700 text-white rounded-full shadow-lg shadow-violet-600/30 flex items-center justify-center transition-transform hover:scale-110 active:scale-95 group"
            >
                <MessageCircle className={`w-7 h-7 transition-transform ${isOpen ? 'rotate-90 opacity-0 absolute' : 'rotate-0 opacity-100'}`} />
                <X className={`w-7 h-7 transition-transform ${isOpen ? 'rotate-0 opacity-100' : '-rotate-90 opacity-0 absolute'}`} />
            </button>

        </div>
    );
};

export default ChatWidget;
