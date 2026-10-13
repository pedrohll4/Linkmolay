import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { Conversation, Message, UserProfile } from '../types';
import { VerifiedBadge } from '../components/common/Badges';
import { EmptyState } from '../components/common/EmptyState';
import {
  MessageSquare,
  Send,
  Search,
  Check,
  CheckCheck,
  User,
  ShieldAlert,
} from 'lucide-react';

export const MessagesPage: React.FC = () => {
  const { currentUser } = useAuth();
  const [searchParams] = useSearchParams();
  const targetUserId = searchParams.get('user');

  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConversation, setActiveConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const loadConversations = () => {
    if (!currentUser) return;
    const list = api.getConversations(currentUser.id);
    setConversations(list);

    // If query parameter user is present, initiate or select that conversation
    if (targetUserId) {
      const existing = list.find((c) => c.participantIds.includes(targetUserId));
      if (existing) {
        setActiveConversation(existing);
        setMessages(api.getConversationMessages(existing.id));
      } else {
        // Check if connected
        const targetUser = api.getUserById(targetUserId);
        const connStatus = api.getConnectionStatus(currentUser.id, targetUserId);

        if (connStatus !== 'connected') {
          // not connected
          setActiveConversation(null);
        } else if (targetUser) {
          // Create temporary or active conversation object
          const tempConv: Conversation = {
            id: 'temp-conv',
            participantIds: [currentUser.id, targetUserId],
            updatedAt: new Date().toISOString(),
            otherParticipant: targetUser,
          };
          setActiveConversation(tempConv);
          setMessages([]);
        }
      }
    } else if (list.length > 0 && !activeConversation) {
      setActiveConversation(list[0]);
      setMessages(api.getConversationMessages(list[0].id));
    }
  };

  useEffect(() => {
    loadConversations();
  }, [currentUser, targetUserId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSelectConversation = (conv: Conversation) => {
    setActiveConversation(conv);
    setMessages(api.getConversationMessages(conv.id));
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || !currentUser || !activeConversation) return;

    const recipientId = activeConversation.participantIds.find((id) => id !== currentUser.id);
    if (!recipientId) return;

    // Verify connection rule
    const status = api.getConnectionStatus(currentUser.id, recipientId);
    if (status !== 'connected') {
      alert('Somente usuários conectados podem trocar mensagens privadas.');
      return;
    }

    const sent = api.sendMessage({
      senderId: currentUser.id,
      recipientId,
      content: inputText.trim(),
    });

    setInputText('');
    setMessages((prev) => [...prev, sent]);

    // Refresh conversation list to bump recent
    const list = api.getConversations(currentUser.id);
    setConversations(list);
    const updated = list.find((c) => c.participantIds.includes(recipientId));
    if (updated) setActiveConversation(updated);
  };

  const filteredConversations = conversations.filter((c) => {
    if (!searchQuery.trim()) return true;
    const name = c.otherParticipant?.fullName.toLowerCase() || '';
    return name.includes(searchQuery.toLowerCase());
  });

  return (
    <div className="h-[calc(100vh-8rem)] min-h-[500px] flex flex-col space-y-4">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2.5">
          <MessageSquare className="w-6 h-6 text-gold-500" /> Mensagens Privadas
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
          Canal direto e seguro para conversas entre membros conectados.
        </p>
      </div>

      {/* Main Chat Interface Container */}
      <div className="flex-1 rounded-3xl border border-slate-200/80 dark:border-navy-850 bg-white dark:bg-navy-900/60 shadow-xs overflow-hidden flex flex-col md:flex-row">
        {/* Left: Conversations list */}
        <div className="w-full md:w-80 border-r border-slate-200/80 dark:border-navy-850 flex flex-col">
          {/* Search bar in chat list */}
          <div className="p-3.5 border-b border-slate-100 dark:border-navy-850">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Pesquisar conversas..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 text-xs rounded-xl border border-slate-200 dark:border-navy-800 bg-slate-50 dark:bg-navy-950 text-slate-900 dark:text-white focus:outline-none"
              />
            </div>
          </div>

          {/* Conversations Items */}
          <div className="flex-1 overflow-y-auto divide-y divide-slate-100 dark:divide-navy-850">
            {filteredConversations.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-400">
                Nenhuma conversa ativa. Conecte-se com membros para iniciar conversas.
              </div>
            ) : (
              filteredConversations.map((conv) => {
                const isSelected = activeConversation?.id === conv.id;
                const other = conv.otherParticipant;

                return (
                  <div
                    key={conv.id}
                    onClick={() => handleSelectConversation(conv)}
                    className={`p-3.5 flex items-center gap-3 cursor-pointer transition-colors ${
                      isSelected
                        ? 'bg-gold-500/10 dark:bg-navy-800/90'
                        : 'hover:bg-slate-50 dark:hover:bg-navy-850'
                    }`}
                  >
                    <div className="w-11 h-11 rounded-xl overflow-hidden bg-navy-800 shrink-0 font-bold text-xs text-gold-400 flex items-center justify-center">
                      {other?.avatarUrl ? (
                        <img src={other.avatarUrl} alt="" className="w-full h-full object-cover" />
                      ) : (
                        other?.fullName.slice(0, 2).toUpperCase()
                      )}
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between mb-0.5">
                        <h4 className="text-xs font-bold text-slate-900 dark:text-white truncate">
                          {other?.fullName}
                        </h4>
                        {conv.lastMessage && (
                          <span className="text-[10px] text-slate-400">
                            {new Date(conv.lastMessage.createdAt).toLocaleTimeString('pt-BR', {
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </span>
                        )}
                      </div>

                      <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                        {conv.lastMessage?.content || 'Inicie a conversa...'}
                      </p>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right: Active Chat Area */}
        <div className="flex-1 flex flex-col bg-slate-50/50 dark:bg-navy-950/40">
          {activeConversation?.otherParticipant ? (
            <>
              {/* Active Chat Header */}
              <div className="p-4 border-b border-slate-200/80 dark:border-navy-850 bg-white dark:bg-navy-900/60 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl overflow-hidden bg-navy-800 shrink-0 font-bold text-xs text-gold-400 flex items-center justify-center">
                    {activeConversation.otherParticipant.avatarUrl ? (
                      <img
                        src={activeConversation.otherParticipant.avatarUrl}
                        alt=""
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      activeConversation.otherParticipant.fullName.slice(0, 2).toUpperCase()
                    )}
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <Link
                        to={`/perfil/${activeConversation.otherParticipant.id}`}
                        className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white hover:underline"
                      >
                        {activeConversation.otherParticipant.fullName}
                      </Link>
                      {activeConversation.otherParticipant.verified && (
                        <VerifiedBadge
                          role={activeConversation.otherParticipant.role}
                          size="sm"
                        />
                      )}
                    </div>
                    <p className="text-[11px] text-slate-400">
                      {activeConversation.otherParticipant.city} -{' '}
                      {activeConversation.otherParticipant.state}
                    </p>
                  </div>
                </div>

                <Link
                  to={`/perfil/${activeConversation.otherParticipant.id}`}
                  className="text-xs text-gold-500 hover:underline font-semibold"
                >
                  Ver Perfil
                </Link>
              </div>

              {/* Messages Area */}
              <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-3">
                {messages.length === 0 ? (
                  <div className="p-8 text-center text-xs text-slate-400">
                    Nenhuma mensagem anterior. Envie uma mensagem para iniciar o diálogo!
                  </div>
                ) : (
                  messages.map((m) => {
                    const isMine = m.senderId === currentUser?.id;

                    return (
                      <div
                        key={m.id}
                        className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-xs sm:max-w-md px-4 py-2.5 rounded-2xl text-xs sm:text-sm shadow-xs ${
                            isMine
                              ? 'bg-gold-400 text-slate-950 rounded-br-xs font-medium'
                              : 'bg-white dark:bg-navy-850 text-slate-800 dark:text-slate-100 border border-slate-200 dark:border-navy-800 rounded-bl-xs'
                          }`}
                        >
                          <p className="leading-relaxed">{m.content}</p>
                          <div
                            className={`flex items-center justify-end gap-1 text-[10px] mt-1 ${
                              isMine ? 'text-slate-700' : 'text-slate-400'
                            }`}
                          >
                            <span>
                              {new Date(m.createdAt).toLocaleTimeString('pt-BR', {
                                hour: '2-digit',
                                minute: '2-digit',
                              })}
                            </span>
                            {isMine && <CheckCheck className="w-3 h-3 text-slate-700" />}
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Message Input Bar */}
              <form
                onSubmit={handleSendMessage}
                className="p-3 border-t border-slate-200/80 dark:border-navy-850 bg-white dark:bg-navy-900 flex items-center gap-2"
              >
                <input
                  type="text"
                  placeholder="Escreva sua mensagem..."
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  className="flex-1 text-xs sm:text-sm px-4 py-2.5 rounded-xl border border-slate-200 dark:border-navy-800 bg-slate-50 dark:bg-navy-950 text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-gold-500"
                />
                <button
                  type="submit"
                  disabled={!inputText.trim()}
                  className="p-2.5 rounded-xl bg-gold-400 hover:bg-gold-300 text-slate-950 disabled:opacity-40 transition-all font-bold"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-slate-400">
              <MessageSquare className="w-12 h-12 text-slate-300 dark:text-navy-800 mb-3" />
              <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Selecione uma conversa para começar
              </h3>
              <p className="text-xs max-w-xs">
                As mensagens são privadas e protegidas entre membros conectados na rede LinkMolay.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
