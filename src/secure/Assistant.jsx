import axios from 'axios'
import { useState, useEffect, useRef, useCallback } from 'react'
import { useSelector } from 'react-redux'

const API_KEY = import.meta.env.VITE_APP_API_BASE_URL

export default function AssistantPage () {
  const user = useSelector(state => state.user.user)

  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content:
        "Hello! I'm your AI financial assistant. How can I help you today?"
    }
  ])

  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const scrollAreaRef = useRef(null)

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight
    }
  }, [messages])

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
          res.data || "Sorry, I couldn't process your request."

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
            content: 'Oops! Something went wrong. Please try again.'
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
      .replace(/^### (.*$)/gm, '<h3 class="text-lg font-bold">$1</h3>')
      .replace(/\*\*(.*?)\*\*/g, '<b>$1</b>')
      .replace(/\*(.*?)\*/g, '<i>$1</i>')
      .replace(/^- (.*$)/gm, '<li>$1</li>')
      .replace(/\n{2,}/g, '</p><p>')
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

  return (
    <div className='h-[calc(100vh-4rem)] max-sm:h-[calc(100vh-10rem)] flex justify-center sm:px-6 md:px-8'>
      <div className='w-full'>
        <div className='max-sm:h-[85vh] h-full flex flex-col rounded-lg shadow-lg sm:border sm:border-gray-300'>
          <div className='p-4 bg-violet-500 text-white rounded-t-lg'>
            <h2 className='flex items-center text-xl font-semibold max-sm:text-lg'>
              <span className='mr-2'>💬</span>
              Chat with Your Personal Financial Advisor
            </h2>
          </div>

          <div
            ref={scrollAreaRef}
            className='flex-grow p-4 overflow-y-auto space-y-4 bg-gray-50'
          >
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${
                  message.role === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                <div
                  className={`max-w-[75%] p-3 rounded-lg text-sm ${
                    message.role === 'user'
                      ? 'bg-violet-500 text-white rounded-br-none'
                      : 'bg-white text-gray-800 shadow-md rounded-bl-none'
                  } whitespace-pre-wrap break-words`}
                  {...(message.role === 'assistant'
                    ? { dangerouslySetInnerHTML: { __html: message.content } }
                    : { children: message.content })}
                />
              </div>
            ))}
            {isTyping && (
              <div className='text-gray-500 italic text-sm'>
                AI is typing...
              </div>
            )}
          </div>

          <form
            onSubmit={handleSubmit}
            className='flex gap-2 p-4 bg-white border-t border-gray-200'
          >
            <input
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder='Ask about your finances...'
              className='flex-grow p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500'
              disabled={isTyping}
            />
            <button
              type='submit'
              className='bg-violet-500 text-white p-2 rounded-md hover:bg-violet-600 disabled:bg-gray-400'
              disabled={isTyping}
            >
              <span className='h-4 w-4'>➤</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
