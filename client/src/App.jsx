import { useState, useEffect, useRef } from 'react'
import { FaPaperPlane, FaRegEdit, FaCopy, FaArrowUp, FaVolumeUp, FaShareAlt } from 'react-icons/fa'
import { IoIosArrowDown } from 'react-icons/io'
import ReactMarkdown from 'react-markdown'
import loadingGif from '/loading.gif'

const App = () => {
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [conversation, setConversation] = useState([])
  const chatContainerRef = useRef(null)
  const sendButtonRef = useRef(null)

const handleGenerate = async (e) => {
  e.preventDefault();

  if (!input.trim()) {
    alert('Please type in a prompt');
    return;
  }

  setConversation((prev) => [...prev, { sender: 'user', message: input }]);
  setLoading(true);

  try {
    const res = await fetch('/generate-content', {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        prompt: input, 
      }),
    });

    const data = await res.json();
    setConversation((prev) => [...prev, { sender: 'ai', message: data?.response }]);
  } catch (error) {
    console.error('Error fetching content:', error);
    setConversation((prev) => [...prev, { sender: 'ai', message: 'Error generating content.' }]);
  } finally {
    setLoading(false);
  }

  setInput('');  
};

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight
    }
  }, [conversation])

  return (
    <>
      <header className="text-lg select-none font-sans bg-zinc-800 fixed top-0 w-full text-white p-5 z-10 flex justify-between items-center">
        <FaRegEdit className="text-white" />
        <div className="flex items-center">
          <h1 className="text-center text-white font-extrabold">ChatGPT</h1>
          <IoIosArrowDown className="ml-2" />
        </div>
        <button className="rounded-2xl px-2 text-black bg-white">Login</button>
      </header>

      <div id="container" className="text-sm select-none bg-zinc-800 pt-16 pb-16 px-5 w-full mb-15">
        <div ref={chatContainerRef} className="mb-48">
          <section className={`${conversation.length === 0 ? '' : 'hidden'} transform mx-auto translate-y-28 text-white grid grid-cols-1 md:grid-cols-2 gap-1 md:gap-10 items-center`}>
            <img src="https://cdn.oaistatic.com/assets/favicon-o20kmmos.svg" className="block w-20 mx-auto md:col-span-full mb-4" />
            <div onClick={() => {
              setInput('Create a Cartoon Illustration of my Pet')
              sendButtonRef.current.click()
            }} className="flex items-center h-16 p-3 border-2 border-zinc-700 shadow-4xl text-white md:mb-0 mb-3 rounded-2xl">
              Create a Cartoon Illustration<br /> of my Pet
            </div>
            <div onClick={() => {
              setInput('Summarize a Long Document or Poem')
              sendButtonRef.current.click()
            }} className="flex items-center h-16 p-3 border-2 border-zinc-700 shadow-4xl text-white md:mb-0 mb-3 rounded-2xl">
              Summarize a <br /> Long Document or Poem
            </div>
            <div onClick={() => {
              setInput('Generate a Logo for my Company')
              sendButtonRef.current.click()
            }} className="flex items-center h-16 p-3 border-2 border-zinc-700 shadow-4xl text-white md:mb-0 mb-3 rounded-2xl">
              Generate a Logo for my Company
            </div>
            <div onClick={() => {
              setInput('How do I land my First Tech Job')
              sendButtonRef.current.click()
            }} className="flex items-center h-16 p-3 border-2 border-zinc-700 shadow-4xl text-white md:mb-0 mb-3 rounded-2xl">
              How do I land my First Tech Job
            </div>
          </section>
          {conversation.map((chat, index) => {
            const isUserMessage = chat.sender === 'user'
            const isAIMessage = chat.sender === 'ai'

            return (
              <div key={index} className={isUserMessage ? 'bg-zinc-700 text-white rounded-2xl w-fit max-w-[70%] px-4 py-3 text-white mt-7 ml-auto' : 'bg-transparent text-white w-full p-2 mt-5'}>
                {isAIMessage ? (
                  <>
                    <img src="https://cdn.oaistatic.com/assets/favicon-o20kmmos.svg" className="float-left w-8 mr-3" />
                    <div>
                      <ReactMarkdown className="prose prose-sm leading-loose overflow-x-auto">
                        {chat.message}
                      </ReactMarkdown>
                     <div className="ml-10">
                     <FaCopy className="text-white inline text-sm mt-4" onClick={() => navigator.clipboard.writeText(chat.message)} />
                      <FaVolumeUp className="inline mt-4 text-sm text-white ml-3" onClick={() => {
                        const speech = new SpeechSynthesisUtterance(chat.message)
                        speech.volume = 1
                        speech.rate = 1
                        speechSynthesis.speak(speech)
                      }} />
                      <FaShareAlt className="inline text-white mt-4 ml-3 text-sm" onClick={() => {
                        const shareData = {
                          title: 'Chat Assistant',
                          text: chat.message,
                          url: "https://ai-chat-assistant-nu.vercel.app/"
                        }
                        navigator.share(shareData)
                      }} />
                     </div>
                    </div>
                  </>
                ) : (
                  <p>{chat.message}</p>
                )}
              </div>
            )
          })}
          {loading && <img src={loadingGif} alt="Loading..." className="transform translate-x-[-50px]" />}
        </div>
      </div>

      <footer className="text-sm select-none bg-zinc-800 p-5 fixed bottom-0 w-full md:w-10/12 md:left-16">
        <form onSubmit={handleGenerate} className="relative">
          <div className="relative">
            <textarea
              value={input}
              placeholder="Message ChatGPT"
              onChange={(e) => setInput(e.target.value)}
              className="w-full h-14 p-4 bg-zinc-600 rounded-2xl flex items-center justify-center placeholder:text-left text-white"
            />
          </div>

          <button
            ref={sendButtonRef}
            type="submit"
            className="absolute top-2 right-2 bg-zinc-700 h-10 w-10 text-xl rounded-full text-white z-10"
          >
            <FaArrowUp className="inline" />
          </button>
        </form>
        <div className="mt-2 text-gray-400 text-sm line-clamp-1 md:line-clamp-none text-white text-center">ChatGPT can make mistakes. Check for important info</div>
      </footer>
    </>
  )
}

export default App
