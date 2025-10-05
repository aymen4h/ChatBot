import { useTranslation } from "react-i18next";
import { useAtom } from "jotai";
import {userAtom, conversationsAtom, currentConversationAtom, messagesAtom, selectedModelAtom} from '../store/Store';
import {generate_response, get_conversations, delete_conversation, get_conversation} from "../store/ApiCall";
import { Menu, Send, Plus, Trash2, User, Bot } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { useNavigate } from "react-router";

const ChatbotPage = () => {
  const navigate = useNavigate();
  const [user] = useAtom(userAtom);
  const [conversations, setConversations] = useAtom(conversationsAtom);
  const [currentConversation, setCurrentConversation] = useAtom(currentConversationAtom);
  const [messages, setMessages] = useAtom(messagesAtom);
  const [input, setInput] = useState('');
  const [selectedModel, setSelectedModel] = useAtom(selectedModelAtom);
  const [loading, setLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const messagesEndRef = useRef(null);
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';

  useEffect(() => {
    if (user) {
      loadConversations();
    }
  }, [user]);

  useEffect(() => {
    if (currentConversation) {
      loadMessages(currentConversation.id);
    }
  }, [currentConversation]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const loadConversations = async () => {
    const token = localStorage.getItem('access_token');
    try {
      const response = await get_conversations(user.id);
      // const response = await fetch(`${API_BASE}/chat/conversations/${user.id}/`, {
      //   headers: { 'Authorization': `Bearer ${token}` }
      // });
      if (response.status === 401){
        navigate('/login');
        return
      }
      if (response.ok) {
        const data = await response.json();
        setConversations(data);
      }
    } catch (err) {
      console.error('Failed to load conversations', err);
    }
  };

  const loadMessages = async (conversationId) => {
    const token = localStorage.getItem('access_token');
    try {
      const response = await get_conversation(conversationId);
      // const response = await fetch(`${API_BASE}/chat/conversation/${conversationId}/`, {
      //   headers: { 'Authorization': `Bearer ${token}` }
      // });
      if (response.status === 401){
        navigate('/login');
        return
      }
      if (response.ok) {
        const data = await response.json();
        setMessages(data.messages);
      }
    } catch (err) {
      console.error('Failed to load messages', err);
    }
  };

  const handleNewChat = () => {
    setCurrentConversation(null);
    setMessages([]);
  };

  const handleSendMessage = async () => {
    if (!input.trim() || loading) return;

    // data = request.data
    // conversation_history = data.get("conversation", [])
    // prompt = data.get("prompt")
    // model = data.get("model")
    // conversation_id = data.get("conversation_id")
    // language = data.get("language", "en")
    // user_id = data.get("user_id")

    setLoading(true);
    const currentInput = input;
    setInput('');

    try {
      const token = localStorage.getItem('access_token');
      const conversationHistory = messages.map(msg => ({
        role: msg.author === 'user' ? 'user' : 'assistant',
        content: i18n.language === 'en' ? msg.msg_en : msg.msg_ar
      }));


      const response = await generate_response(JSON.stringify({
          conversation: conversationHistory,
          prompt: currentInput,
          model: selectedModel,
          conversation_id: currentConversation?.id || null,
          language: i18n.language,
          user_id: user.id
        }));
      /*const response = await fetch(`${API_BASE}/chat/generate/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          conversation: conversationHistory,
          prompt: currentInput,
          model: selectedModel,
          conversation_id: currentConversation?.id || null,
          language: i18n.language,
          user_id: user.id
        })
      });*/

      if (response.ok) {
        const data = await response.json();
        
        if (!currentConversation) {
          setCurrentConversation({ id: data.conversation_id });
          loadConversations();
        }

        const userMessage = {
          id: data.messages[0].id,
          author: "user",
          msg_en: data.messages[0].msg_en,
          msg_ar: data.messages[0].msg_ar,
          created_at: data.messages[0].created_at
        }
        const aiMessage = {
          id: data.messages[1].id,
          author: selectedModel,
          msg_en: data.messages[1].msg_en,
          msg_ar: data.messages[1].msg_ar,
          created_at: data.messages[1].created_at
        };

        setMessages(prev => [...prev, userMessage, aiMessage]);
      }
    } catch (err) {
      console.error('Failed to send message', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteConversation = async (id) => {
    const token = localStorage.getItem('access_token');
    try {
      await delete_conversation(id);
      // await fetch(`${API_BASE}/chat/conversations/${id}/delete/`, {
      //   method: 'DELETE',
      //   headers: { 'Authorization': `Bearer ${token}` }
      // });
      loadConversations();
      if (currentConversation?.id === id) {
        handleNewChat();
      }
    } catch (err) {
      console.error('Failed to delete conversation', err);
    }
  };
  const parseFormattedText = (text) => {
    const lines = text.split('\n');
    return lines.map((line, lineIndex) => {
      // Gérer les titres avec ###
      if (line.startsWith('### ')) {
        return <h3 key={lineIndex}>{line.replace('### ', '')}</h3>;
      }
      
      // Gérer les listes numérotées
      if (line.match(/^\d+\.\s*\*\*/)) {
        const parts = line.split(/(\*\*.*?\*\*)/g);
        return (
          <li key={lineIndex}>
            {parts.map((part, partIndex) => 
              part.startsWith('**') && part.endsWith('**') 
                ? <strong key={partIndex}>{part.slice(2, -2)}</strong>
                : part
            )}
          </li>
        );
      }
      
      // Gérer le texte normal avec **bold**
      const parts = line.split(/(\*\*.*?\*\*)/g);
      return (
        <p key={lineIndex}>
          {parts.map((part, partIndex) =>
            part.startsWith('**') && part.endsWith('**') 
              ? <strong key={partIndex}>{part.slice(2, -2)}</strong>
              : part
          )}
        </p>
      );
    });
  };

  return (
    <div className={`flex h-[calc(100vh-4rem)] ${isRTL ? 'rtl' : 'ltr'}`} dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Sidebar */}
      <div className={`${sidebarOpen ? 'translate-x-0' : isRTL ? 'translate-x-full' : '-translate-x-full'} md:translate-x-0 fixed md:static inset-y-0 ${isRTL ? 'right-0' : 'left-0'} z-50 w-64 bg-base-200 transition-transform duration-300 flex flex-col`}>
        <div className="p-4 border-b border-base-300">
          <button onClick={handleNewChat} className="btn btn-primary w-full gap-2">
            <Plus className="w-5 h-5" />
            {t.new_chat}
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-4">
          <h3 className="font-semibold mb-2">{t.previous_chats}</h3>
          {conversations.length === 0 ? (
            <p className="text-sm text-gray-500">{t.no_conversations}</p>
          ) : (
            <div className="space-y-2">
              {conversations.map(conv => (
                <div key={conv.id} className="flex gap-2">
                  <button
                    onClick={() => setCurrentConversation(conv)}
                    className={`btn btn-sm flex-1 justify-start ${currentConversation?.id === conv.id ? 'btn-active' : 'btn-ghost'}`}
                  >
                    {i18n.language === 'en' ? conv.title_en : conv.title_ar}
                  </button>
                  <button
                    onClick={() => handleDeleteConversation(conv.id)}
                    className="btn btn-sm btn-ghost btn-square"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col bg-base-100" onClick={sidebarOpen ? () => setSidebarOpen(false) : undefined}>
        
        {/* Header */}
        <div className="p-4 border-b border-base-300 flex items-center gap-4">
          <button 
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="btn btn-ghost btn-square md:hidden"
          >
            <Menu />
          </button>
          <h1 className="text-xl font-bold flex-1">{t.chatbot_title}</h1>
          <select 
            value={selectedModel}
            onChange={(e) => setSelectedModel(e.target.value)}
            className="select select-bordered"
          >
            <option value="mistral">Mistral</option>
            <option value="qwen">Qwen</option>
            <option value="gemma">Gemma</option>
          </select>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.length === 0 ? (
            <div className="flex items-center justify-center h-full text-gray-500">
              <p>{t.type_message}</p>



              
            </div>
          ) : (
            messages.map((msg) => (
              <div
                key={msg.id}
                className={`chat ${msg.author === 'user' ? 'chat-end' : 'chat-start'}`}
              >
                <div className="chat-image">
                  <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white">
                    {msg.author === 'user' ? <User className="w-8 h-8" /> : <Bot className="w-8 h-8" />}
                  </div>
                </div>
                <div className="chat-header mb-1">
                  {msg.author === 'user' ? t('you') : msg.author.toUpperCase()}
                </div>
                <div className="chat-bubble">
                  {i18n.language === 'en' ? parseFormattedText(msg.msg_en) : parseFormattedText(msg.msg_ar)}
                </div>
                <div className="chat-footer opacity-50 text-xs mt-1">
                  {new Date(msg.created_at).toLocaleTimeString()}
                </div>
              </div>
            ))
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-4 border-t border-base-300 flex items-center gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder={t('type_message')}
            className="input input-bordered flex-1"
            disabled={loading}
          />
          <button
            onClick={handleSendMessage}
            className={`btn btn-primary ${loading ? 'loading' : ''}`}
            disabled={loading}
          >
            {!loading && <Send className="w-5 h-5" />}
          </button>
        </div>
      </div>
    </div>
  );
};






export default ChatbotPage;