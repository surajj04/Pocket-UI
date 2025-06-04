import axios from 'axios'
import { useState, useEffect, useRef, useCallback } from 'react'
import { useSelector } from 'react-redux'
import { Button } from '../components/ui/button'
import { Trash2, Send } from 'lucide-react'

const API_KEY = import.meta.env.VITE_APP_API_BASE_URL

export default function AssistantPage () {
  const user = useSelector(state => state.user.user)
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const scrollAreaRef = useRef(null)

  // Load messages from localStorage on mount
  useEffect(() => {
    const savedChat = localStorage.getItem('assistant_chat')
    if (savedChat) {
      setMessages(JSON.parse(savedChat))
    } else {
      setMessages([
        {
          role: 'assistant',
          content:
            "Hello! 👋 I'm your AI financial assistant. How can I help you with your finances today?"
        }
      ])
    }
  }, [])

  // Save messages to localStorage whenever they change
  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem('assistant_chat', JSON.stringify(messages))
    }
  }, [messages])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const scrollToBottom = () => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight
    }
  }

  const handleChat = useCallback(
    async userMessage => {
      setIsTyping(true)
      try {
        const res = await axios.post(
          `${API_KEY}/chat-bot`,
          {
            userMessage: userMessage,
            token: user?.token
          },
          {
            headers: {
              'Content-Type': 'application/json'
            }
          }
        )

        const botResponse =
          res.data ||
          "Sorry, I couldn't process your request. Could you try rephrasing?"
        setMessages(prev => [
          ...prev,
          { role: 'assistant', content: formatMarkdown(botResponse) }
        ])
      } catch (err) {
        console.error(
          'Error fetching AI response:',
          err.response?.data || err.message
        )
        setMessages(prev => [
          ...prev,
          {
            role: 'assistant',
            content: '⚠️ Oops! Something went wrong. Please try again.'
          }
        ])
      } finally {
        setIsTyping(false)
      }
    },
    [user?.token]
  )

  function formatMarkdown (text) {
    return text
      .replace(
        /^### (.*$)/gm,
        '<h3 class="text-lg font-bold mt-2 mb-1">$1</h3>'
      )
      .replace(/\*\*(.*?)\*\*/g, '<b>$1</b>')
      .replace(/\*(.*?)\*/g, '<i>$1</i>')
      .replace(/^- (.*$)/gm, '<li class="ml-4">$1</li>')
      .replace(/`([^`]+)`/g, '<code class="bg-gray-100 px-1 rounded">$1</code>')
      .replace(/\n{2,}/g, '</p><p class="mt-2">')
      .replace(/\n/g, '<br>')
  }

  const handleSubmit = async e => {
    e.preventDefault()
    if (input.trim()) {
      setMessages(prev => [...prev, { role: 'user', content: input }])
      const userMessage = input
      setInput('')
      await handleChat(userMessage)
    }
  }

  const clearChat = () => {
    // Remove chat from localStorage
    localStorage.removeItem('assistant_chat')

    // Reset to initial state
    setMessages([
      {
        role: 'assistant',
        content:
          'Hi again! 👋 What financial questions can I help you with today?'
      }
    ])
  }

  return (
    <div className='h-[calc(100vh-4rem)] max-sm:h-[calc(100vh-10rem)] flex justify-center sm:px-6 md:px-8 bg-gradient-to-b from-violet-50 to-white'>
      <div className='w-full flex flex-col'>
        <div className='max-sm:h-[85vh] h-full flex flex-col rounded-xl shadow-lg border border-gray-200 bg-white overflow-hidden'>
          {/* Header with clear button */}
          <div className='p-4 bg-gradient-to-r from-violet-600 to-indigo-600 text-white rounded-t-lg flex justify-between items-center'>
            <div className='flex items-center'>
              <div className='bg-white/20 p-2 rounded-lg mr-3'>
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  className='h-6 w-6'
                  fill='none'
                  viewBox='0 0 24 24'
                  stroke='currentColor'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z'
                  />
                </svg>
              </div>
              <div>
                <h2 className='text-xl font-semibold max-sm:text-lg'>
                  Financial Assistant
                </h2>
                <p className='text-violet-100 text-sm max-sm:hidden'>
                  Ask about budgets, expenses, and savings
                </p>
              </div>
            </div>
            <Button
              variant='ghost'
              className='hover:bg-violet-700 text-violet-100'
              onClick={clearChat}
            >
              <Trash2 className='h-4 w-4 mr-1' />
              <span className='max-sm:hidden'>Clear Chat</span>
            </Button>
          </div>

          {/* Chat messages area */}
          <div
            ref={scrollAreaRef}
            className='flex-grow p-4 overflow-y-auto space-y-4 bg-gradient-to-b from-white to-violet-50'
          >
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${
                  message.role === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                <div
                  className={`max-w-[85%] p-4 rounded-xl text-sm transition-all duration-200 ${
                    message.role === 'user'
                      ? 'bg-violet-600 text-white rounded-tr-none'
                      : 'bg-white text-gray-800 shadow-sm rounded-tl-none border border-gray-100'
                  } whitespace-pre-wrap break-words`}
                  {...(message.role === 'assistant'
                    ? { dangerouslySetInnerHTML: { __html: message.content } }
                    : { children: message.content })}
                />
              </div>
            ))}

            {isTyping && (
              <div className='flex justify-start'>
                <div className='max-w-[85%] p-4 rounded-xl bg-white shadow-sm border border-gray-100 rounded-tl-none'>
                  <div className='flex items-center text-gray-500 italic'>
                    <div className='flex space-x-1'>
                      <div className='h-2 w-2 bg-violet-400 rounded-full animate-bounce'></div>
                      <div
                        className='h-2 w-2 bg-violet-400 rounded-full animate-bounce'
                        style={{ animationDelay: '0.2s' }}
                      ></div>
                      <div
                        className='h-2 w-2 bg-violet-400 rounded-full animate-bounce'
                        style={{ animationDelay: '0.4s' }}
                      ></div>
                    </div>
                    <span className='ml-2'>Thinking...</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Input area */}
          <form
            onSubmit={handleSubmit}
            className='flex gap-3 p-4 bg-white border-t border-gray-200'
          >
            <input
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder='Ask about your finances...'
              className='flex-grow p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent'
              disabled={isTyping}
            />
            <Button
              type='submit'
              size='icon'
              className='bg-violet-600 hover:bg-violet-700 h-11 w-11 text-white'
              disabled={isTyping || !input.trim()}
            >
              <Send className='h-5 w-5' />
            </Button>
          </form>

          {/* Quick suggestions */}
          <div className='bg-gray-50 border-t border-gray-300 p-3'>
            <div className='text-xs text-gray-500 mb-2 ml-1'>Try asking:</div>
            <div className='flex flex-wrap gap-2'>
              {[
                'How can I save more money?',
                'Suggest a budget for groceries',
                'Where am I overspending?',
                'Tips to reduce expenses'
              ].map((q, i) => (
                <button
                  key={i}
                  onClick={() => setInput(q)}
                  className='text-xs bg-white border border-violet-200 text-violet-700 px-3 py-1.5 rounded-lg hover:bg-violet-50 transition-colors'
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
