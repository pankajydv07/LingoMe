import React, { useState } from 'react';
import OpenAI from 'openai';
import { Carrot as Parrot, Send, ChevronDown } from 'lucide-react';

// Initialize OpenAI client
const openai = new OpenAI({
  baseURL: "https://models.inference.ai.azure.com",
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true
});

const languages = [
  { code: 'hi', name: 'Hindi', flag: '🇮🇳' },
  { code: 'bn', name: 'Bengali', flag: '🇮🇳' },
  { code: 'ta', name: 'Tamil', flag: '🇮🇳' },
  { code: 'te', name: 'Telugu', flag: '🇮🇳' },
  { code: 'mr', name: 'Marathi', flag: '🇮🇳' },
  { code: 'gu', name: 'Gujarati', flag: '🇮🇳' },
  { code: 'pa', name: 'Punjabi', flag: '🇮🇳' },
  { code: 'ur', name: 'Urdu', flag: '🇮🇳' },
  { code: 'ml', name: 'Malayalam', flag: '🇮🇳' },
  { code: 'kn', name: 'Kannada', flag: '🇮🇳' },
  { code: 'or', name: 'Odia', flag: '🇮🇳' },
  { code: 'as', name: 'Assamese', flag: '🇮🇳' },
  { code: 'mni', name: 'Manipuri', flag: '🇮🇳' },
  { code: 'bho', name: 'Bhojpuri', flag: '🇮🇳' },
  { code: 'sd', name: 'Sindhi', flag: '🇮🇳' },
  { code: 'ks', name: 'Kashmiri', flag: '🇮🇳' },
  { code: 'sa', name: 'Sanskrit', flag: '🇮🇳' },
  { code: 'ne', name: 'Nepali', flag: '🇳🇵' }, // Keep Nepali if needed
  { code: 'en', name: 'English', flag: '🇬🇧' }, // Optional
];


interface Message {
  text: string;
  isUser: boolean;
  language?: string;
}

function App() {
  const [messages, setMessages] = useState<Message[]>([{
    text: "Select the language you want me to translate into, type your text and hit send!",
    isUser: false
  }]);
  const [inputText, setInputText] = useState('');
  const [fromLanguage, setFromLanguage] = useState('en'); // Default English
  const [targetLanguage, setTargetLanguage] = useState('hi'); // Default Hindi

  const [loading, setLoading] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const selectedLanguage = languages.find(l => l.code === targetLanguage);

  const handleTranslate = async () => {
    if (!inputText.trim()) return;
    
    const userMessage = {
      text: inputText,
      isUser: true
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setLoading(true);

    try {
      const response = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content: `You are a translator. Translate the following text from ${
  languages.find(l => l.code === fromLanguage)?.name
} to ${languages.find(l => l.code === targetLanguage)?.name}. Only respond with the translation, nothing else.`

          },
          {
            role: "user",
            content: inputText
          }
        ]
      });

      const translatedMessage = {
        text: response.choices[0].message.content || 'Translation error',
        isUser: false,
        language: targetLanguage
      };
      
      setMessages(prev => [...prev, translatedMessage]);
    } catch (error) {
      
      console.error('Translation error:', error);
      const errorMessage = {
        
        text: 'Sorry, an error occurred during translation. Please check your OpenAI API key.',
        isUser: false
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0A1A2F] text-white">
      {/* Header */}
      <div className="bg-[#0A1A2F] border-b border-blue-900/30 p-4">
        <div className="flex items-center justify-center gap-4">
          <Parrot className="w-12 h-12 text-blue-400" />
          <div>
            <h1 className="text-4xl font-bold text-green-400">LingoMe</h1>
            <p className="text-gray-400">Perfect Translation Every Time</p>
          </div>
        </div>
      </div>

      {/* Chat container */}
      <div className="max-w-2xl mx-auto p-4">
        {/* Language Selection Box */}
        {/* From Language Selection */}
<div className="bg-white/10 rounded-xl p-4 mb-6">
  <h2 className="text-lg font-semibold mb-3 text-blue-300">Select Source Language</h2>
  <div className="relative">
    <button
      onClick={() => setIsDropdownOpen(!isDropdownOpen)}
      className="w-full flex items-center justify-between bg-white/5 hover:bg-white/10 
                 transition-colors rounded-lg p-3 border border-blue-500/30"
    >
      <div className="flex items-center gap-2">
        <span className="text-2xl">{languages.find(l => l.code === fromLanguage)?.flag}</span>
        <span>{languages.find(l => l.code === fromLanguage)?.name}</span>
      </div>
      <ChevronDown className={`w-5 h-5 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
    </button>

    {isDropdownOpen && (
      <div className="absolute w-full mt-2 bg-[#1A2A3F] border border-blue-500/30 
                    rounded-lg shadow-xl max-h-60 overflow-y-auto z-10">
        <div className="grid grid-cols-2 gap-1 p-2">
          {languages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => {
                setFromLanguage(lang.code);
                setIsDropdownOpen(false);
              }}
              className={`flex items-center gap-2 p-2 rounded hover:bg-blue-600/50 transition-colors
                        ${fromLanguage === lang.code ? 'bg-blue-600' : ''}`}
            >
              <span className="text-xl">{lang.flag}</span>
              <span>{lang.name}</span>
            </button>
          ))}
        </div>
      </div>
    )}
  </div>
</div>

        <div className="bg-white/10 rounded-xl p-4 mb-6">
          <h2 className="text-lg font-semibold mb-3 text-blue-300">Select Translation Language</h2>
          <div className="relative">
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="w-full flex items-center justify-between bg-white/5 hover:bg-white/10 
                         transition-colors rounded-lg p-3 border border-blue-500/30"
            >
              <div className="flex items-center gap-2">
                <span className="text-2xl">{selectedLanguage?.flag}</span>
                <span>{selectedLanguage?.name}</span>
              </div>
              <ChevronDown className={`w-5 h-5 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
            </button>
            
            {isDropdownOpen && (
              <div className="absolute w-full mt-2 bg-[#1A2A3F] border border-blue-500/30 
                            rounded-lg shadow-xl max-h-60 overflow-y-auto z-10">
                <div className="grid grid-cols-2 gap-1 p-2">
                  {languages.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => {
                        setTargetLanguage(lang.code);
                        setIsDropdownOpen(false);
                      }}
                      className={`flex items-center gap-2 p-2 rounded hover:bg-blue-600/50 transition-colors
                                ${targetLanguage === lang.code ? 'bg-blue-600' : ''}`}
                    >
                      <span className="text-xl">{lang.flag}</span>
                      <span>{lang.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Messages */}
        <div className="bg-white/5 rounded-2xl p-4 mb-4 h-[50vh] overflow-y-auto">
          <div className="space-y-4">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] p-4 rounded-2xl ${
                    message.isUser
                      ? 'bg-green-500 text-white'
                      : 'bg-blue-600 text-white'
                  }`}
                >
                  <p>{message.text}</p>
                  {message.language && (
                    <span className="text-xs opacity-75 mt-1 block">
                      {languages.find(l => l.code === message.language)?.flag}
                      {' '}
                      {languages.find(l => l.code === message.language)?.name}
                    </span>
                  )}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-blue-600 text-white max-w-[80%] p-4 rounded-2xl">
                  Translating...
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Input area */}
        <div className="flex gap-2">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleTranslate()}
            placeholder="Type your message here..."
            className="flex-1 bg-white/5 border border-blue-900/30 rounded-xl px-4 py-3 
                     focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={handleTranslate}
            disabled={loading || !inputText.trim()}
            className="bg-green-500 hover:bg-green-600 disabled:opacity-50 
                     disabled:cursor-not-allowed p-3 rounded-xl transition-colors"
          >
            <Send className="w-6 h-6" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;
