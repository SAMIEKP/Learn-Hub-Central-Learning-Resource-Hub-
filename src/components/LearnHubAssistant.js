import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { IconMessageCircle, IconMinus, IconSend, IconX } from '@tabler/icons-react';
import { askLearnHubAssistant } from '../api/client';
import './LearnHubAssistant.css';

const GREETING = 'Hi! I’m the LearnHub Assistant. Ask me a simple question or ask about the resource you’re viewing.';

export default function LearnHubAssistant({ currentPage, resource, onOpenResource }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [question, setQuestion] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState([
    { id: 'greeting', role: 'assistant', content: GREETING, sources: [] },
  ]);
  const launcherRef = useRef(null);
  const inputRef = useRef(null);
  const messagesEndRef = useRef(null);

  const resourceContext = useMemo(() => {
    if (!resource || !['resource', 'reader'].includes(currentPage)) return undefined;
    return {
      resource_id: resource.id ? String(resource.id) : undefined,
      title: resource.title,
      subject: resource.subject || resource.meta?.split('·')[0]?.trim(),
      topic: resource.topic,
      resource_type: resource.resourceType || resource.type,
    };
  }, [currentPage, resource]);

  const closePanel = useCallback(() => {
    setIsOpen(false);
    launcherRef.current?.focus();
  }, []);

  useEffect(() => {
    if (isOpen && !isMinimized) inputRef.current?.focus();
  }, [isOpen, isMinimized]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView?.({ behavior: 'smooth', block: 'nearest' });
  }, [messages, isLoading]);

  useEffect(() => {
    if (!isOpen) return undefined;
    const closeOnEscape = (event) => {
      if (event.key === 'Escape') closePanel();
    };
    document.addEventListener('keydown', closeOnEscape);
    return () => document.removeEventListener('keydown', closeOnEscape);
  }, [closePanel, isOpen]);

  const sendQuestion = async () => {
    const text = question.trim();
    if (!text || isLoading) return;

    const previousMessages = messages.filter((message) => message.role !== 'error');
    setMessages((current) => [...current, {
      id: `student-${Date.now()}`,
      role: 'user',
      content: text,
      sources: [],
    }]);
    setQuestion('');
    setIsLoading(true);

    try {
      const response = await askLearnHubAssistant({
        question: text,
        context: resourceContext,
        history: previousMessages
          .filter((message) => ['user', 'assistant'].includes(message.role))
          .slice(-6)
          .map((message) => ({
            role: message.role === 'assistant' ? 'model' : 'user',
            content: message.content,
          })),
      });
      if (typeof response?.answer !== 'string' || !Array.isArray(response.sources)) {
        throw new Error('The LearnHub Assistant returned an invalid response.');
      }
      setMessages((current) => [...current, {
        id: `assistant-${Date.now()}`,
        role: 'assistant',
        content: response.answer,
        sources: response.sources,
      }]);
    } catch (error) {
      const message = error.response?.data?.error
        || error.message
        || 'I couldn’t connect to the LearnHub Assistant. Please try again.';
      setMessages((current) => [...current, {
        id: `error-${Date.now()}`,
        role: 'error',
        content: message,
        sources: [],
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputKeyDown = (event) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      sendQuestion();
    }
  };

  const openSource = (source) => {
    onOpenResource(source);
    closePanel();
  };

  return (
    <div
      className={`learnhub-assistant${currentPage === 'reader' ? ' is-reading' : ''}`}
      onClick={(event) => event.stopPropagation()}
    >
      {isOpen && (
        <section
          className={`learnhub-assistant-panel${isMinimized ? ' is-minimized' : ''}`}
          role="dialog"
          aria-label="LearnHub Assistant chat"
          aria-modal="false"
        >
          <header className="learnhub-assistant-header">
            <div className="learnhub-assistant-identity">
              <span className="learnhub-assistant-mark" aria-hidden="true">
                <IconMessageCircle size={19} />
              </span>
              <span>
                <strong>LearnHub Assistant</strong>
                {!isMinimized && <small>Here to help you learn</small>}
              </span>
            </div>
            <div className="learnhub-assistant-controls">
              {!isMinimized && (
                <button
                  type="button"
                  aria-label="Minimize assistant"
                  title="Minimize"
                  onClick={() => setIsMinimized(true)}
                >
                  <IconMinus size={17} />
                </button>
              )}
              {isMinimized && (
                <button
                  type="button"
                  aria-label="Expand assistant"
                  title="Expand"
                  onClick={() => setIsMinimized(false)}
                >
                  <IconMessageCircle size={17} />
                </button>
              )}
              <button
                type="button"
                aria-label="Close assistant"
                title="Close"
                onClick={closePanel}
              >
                <IconX size={17} />
              </button>
            </div>
          </header>

          {!isMinimized && (
            <>
              <div className="learnhub-assistant-messages" role="log" aria-live="polite" aria-relevant="additions text">
                {messages.map((message) => (
                  <article key={message.id} className={`learnhub-assistant-message is-${message.role}`}>
                    <p>{message.content}</p>
                    {message.sources?.length > 0 && (
                      <div className="learnhub-assistant-sources">
                        <span>LearnHub resources</span>
                        {message.sources.map((source) => (
                          <button
                            key={source.resource_id}
                            type="button"
                            onClick={() => openSource(source)}
                          >
                            {source.citation_numbers?.length > 0 && (
                              <span className="learnhub-assistant-citation-number">
                                {source.citation_numbers.map((number) => `[${number}]`).join(' ')}
                              </span>
                            )}
                            {source.title}
                            {source.topic && <small>{source.topic}</small>}
                          </button>
                        ))}
                      </div>
                    )}
                  </article>
                ))}
                {isLoading && (
                  <div className="learnhub-assistant-loading" role="status">
                    <span /><span /><span />
                    <span className="visually-hidden">LearnHub Assistant is preparing an answer</span>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              <form
                className="learnhub-assistant-compose"
                onSubmit={(event) => { event.preventDefault(); sendQuestion(); }}
              >
                <label className="visually-hidden" htmlFor="learnhub-assistant-question">Ask a question</label>
                <textarea
                  id="learnhub-assistant-question"
                  ref={inputRef}
                  rows="1"
                  value={question}
                  onChange={(event) => setQuestion(event.target.value)}
                  onKeyDown={handleInputKeyDown}
                  placeholder="Ask a question..."
                  maxLength="1000"
                  disabled={isLoading}
                />
                <button
                  type="submit"
                  aria-label="Send question"
                  disabled={!question.trim() || isLoading}
                >
                  <IconSend size={18} />
                </button>
              </form>
              <p className="learnhub-assistant-note">A study aid—not a replacement for your teacher.</p>
            </>
          )}
        </section>
      )}

      <button
        type="button"
        className="learnhub-assistant-launcher"
        ref={launcherRef}
        aria-label={isOpen ? 'Close Ask LearnHub' : 'Ask LearnHub'}
        aria-expanded={isOpen}
        onClick={() => {
          if (isOpen) closePanel();
          else {
            setIsMinimized(false);
            setIsOpen(true);
          }
        }}
      >
        {isOpen ? <IconX size={23} /> : <IconMessageCircle size={24} />}
        <span className="learnhub-assistant-tooltip" role="tooltip">Ask LearnHub</span>
      </button>
    </div>
  );
}
