import React, { useState, useEffect, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send, Bot, User, Loader2, Code as CodeIcon, Copy, Trash2, X } from "lucide-react";
import api from "../api";
import Navbar from "../components/Navbar";
import BottomNavbar from "../components/BottomNavbar";

// Helper function to parse content
const parseContent = (text) => {
  const blocks = [];
  let currentText = "";
  const codePattern = /```(\w+)?\n([\s\S]*?)```/g;
  let lastIndex = 0;
  let match;

  while ((match = codePattern.exec(text)) !== null) {
    if (match.index > lastIndex) {
      blocks.push({
        type: "text",
        content: text.slice(lastIndex, match.index).trim()
      });
    }

    blocks.push({
      type: "code",
      language: match[1] || "plaintext",
      content: match[2].trim()
    });

    lastIndex = match.index + match[0].length;
  }

  if (lastIndex < text.length) {
    blocks.push({
      type: "text",
      content: text.slice(lastIndex).trim()
    });
  }

  return blocks;
};

// CodeBlock Component
const CodeBlock = ({ language, content }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="my-3 rounded-lg border border-gray-200 bg-gray-900">
      <div className="flex items-center justify-between px-4 py-2 bg-gray-800 border-b border-gray-700">
        <div className="flex items-center gap-2">
          <CodeIcon className="w-4 h-4 text-blue-400" />
          <span className="text-sm font-medium text-gray-200">{language}</span>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleCopy}
          className="hover:bg-gray-700 text-gray-300"
        >
          {copied ? (
            <span className="text-green-400 text-sm">Copied!</span>
          ) : (
            <Copy className="w-4 h-4" />
          )}
        </Button>
      </div>
      <div className="overflow-x-auto">
        <pre className="p-4">
          <code className="text-sm font-mono text-gray-100 whitespace-pre-wrap break-words">
            {content}
          </code>
        </pre>
      </div>
    </div>
  );
};

// Text formatting helper
const renderTextWithFormatting = (text, isUserMessage) => {
  const parts = text.split(/(\*\*.*?\*\*|\`.*?\`)/g);
  return parts.map((part, index) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return (
        <strong key={index} className={isUserMessage ? "text-white" : "text-gray-900"}>
          {part.slice(2, -2)}
        </strong>
      );
    } else if (part.startsWith('`') && part.endsWith('`')) {
      return (
        <span 
          key={index} 
          className={`px-1 py-0.5 rounded font-mono text-sm ${
            isUserMessage 
              ? "bg-blue-400 text-white" 
              : "bg-gray-100 text-red-600"
          }`}
        >
          {part.slice(1, -1)}
        </span>
      );
    }
    return part;
  });
};

// TypewriterEffect Component
const TypewriterEffect = ({ content, onComplete, onStop }) => {
  const [displayedContent, setDisplayedContent] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const mounted = useRef(true);

  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);

  useEffect(() => {
    if (currentIndex < content.length && mounted.current) {
      const timer = setTimeout(() => {
        if (mounted.current) {
          setDisplayedContent(prev => prev + content[currentIndex]);
          setCurrentIndex(currentIndex + 1);
        }
      }, 20);
      return () => clearTimeout(timer);
    } else if (onComplete && mounted.current) {
      onComplete();
    }
  }, [currentIndex, content, onComplete]);

  const blocks = parseContent(displayedContent);

  return (
    <div className="space-y-2">
      {blocks.map((block, index) => (
        block.type === "code" ? (
          <CodeBlock key={index} language={block.language} content={block.content} />
        ) : (
          <p key={index} className="text-gray-700 leading-relaxed whitespace-pre-wrap">
            {renderTextWithFormatting(block.content, false)}
          </p>
        )
      ))}
      <Button onClick={onStop} className="mt-2" variant="outline" size="sm">
        <X className="w-4 h-4 mr-2" /> Stop Generating
      </Button>
    </div>
  );
};

// MessageContent Component
const MessageContent = ({ content, typing, onComplete, sender, onStop }) => {
  if (typing) {
    return <TypewriterEffect content={content} onComplete={onComplete} onStop={onStop} />;
  }

  const blocks = parseContent(content);
  const isUserMessage = sender === "user";

  return (
    <div className="space-y-2">
      {blocks.map((block, index) => (
        block.type === "code" ? (
          <CodeBlock key={index} language={block.language} content={block.content} />
        ) : (
          <p key={index} className={`leading-relaxed whitespace-pre-wrap ${
            isUserMessage ? "text-white" : "text-gray-700"
          }`}>
            {renderTextWithFormatting(block.content, isUserMessage)}
          </p>
        )
      ))}
    </div>
  );
};

// Main LLMPage Component
const LLMPage = () => {
  const [query, setQuery] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [activeTypingIndex, setActiveTypingIndex] = useState(null);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null);
  const abortControllerRef = useRef(null);

  // Load saved messages
  useEffect(() => {
    try {
      const savedMessages = localStorage.getItem("chatMessages");
      if (savedMessages) {
        const parsed = JSON.parse(savedMessages);
        setMessages(parsed.map(msg => ({
          ...msg,
          typing: false
        })));
      }
    } catch (error) {
      console.error("Error loading saved messages:", error);
    }
  }, []);

  // Save messages
  useEffect(() => {
    if (messages.length > 0) {
      try {
        localStorage.setItem("chatMessages", JSON.stringify(
          messages.map(msg => ({
            ...msg,
            typing: false
          }))
        ));
      } catch (error) {
        console.error("Error saving messages:", error);
      }
    }
  }, [messages]);

  const scrollToBottom = () => {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, activeTypingIndex]);

  const adjustTextareaHeight = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 150)}px`;
    }
  };

  const handleTypingComplete = (index) => {
    setActiveTypingIndex(null);
    setMessages(prev => prev.map((msg, i) => 
      i === index ? { ...msg, typing: false } : msg
    ));
    setIsTyping(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!query.trim() || loading || isTyping) return;

    // Abort previous request if exists
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    const userMessage = { content: query.trim(), sender: "user" };
    setMessages(prev => [...prev, userMessage]);
    setLoading(true);
    setError("");
    setQuery("");
    adjustTextareaHeight();

    // Create new AbortController
    abortControllerRef.current = new AbortController();

    try {
      const res = await api.post("/api/llm/generate-code/", 
        { query: userMessage.content },
        { signal: abortControllerRef.current.signal }
      );

      if (!res.data.response) {
        throw new Error("Empty response from server");
      }

      const newMessages = [...messages, userMessage, {
        content: res.data.response,
        sender: "bot",
        typing: true
      }];
      
      setMessages(newMessages);
      setActiveTypingIndex(newMessages.length - 1);
      setIsTyping(true);
    } catch (err) {
      if (err.name === 'AbortError') {
        console.log('Request aborted');
      } else {
        setError(err.response?.data?.error || "Failed to generate response. Please try again.");
        setTimeout(() => setError(""), 5000); // Clear error after 5 seconds
      }
    } finally {
      setLoading(false);
      abortControllerRef.current = null;
    }
  };

  const handleStopGenerating = (index) => {
    setActiveTypingIndex(null);
    setMessages(prev => prev.map((msg, i) => 
      i === index ? { ...msg, typing: false } : msg
    ));
    setIsTyping(false);
  };

  const handleClearChat = () => {
    setMessages([]);
    localStorage.removeItem("chatMessages");
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      <div className="sticky top-0 z-10 bg-white shadow-md">
        <Card className=" flex align-center justify-between text-center px-5 py-4 border-b">
          <div className="text-center flex items-center justify-left gap-3">
            <Bot className="w-6 h-6 text-blue-500 font-extrabold" />
            <h2 className="text-center text-xl md:text-3xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-cyan-500 drop-shadow-sm">
                    Python Coding Assistant
            </h2>
          </div>
            <div className="right-4 z-10">
        <Button
          onClick={handleClearChat}
          className="bg-red-500 hover:bg-red-600 text-white shadow-md">
        
          
          <Trash2 className="w-9 h-9" /> 
        
          
        </Button>
      </div>
        </Card>
      
      </div>

      <div className="flex-1 overflow-hidden relative">
        <div className="absolute inset-0 overflow-y-auto px-4 py-9 space-y-6">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`flex gap-3 max-w-[100%] md:max-w-[75%] ${
                  msg.sender === "user" ? "flex-row-reverse" : "flex-row"
                }`}
              >
                <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center bg-gradient-to-r from-blue-500 to-cyan-500 shadow-md">
                  {msg.sender === "user" ? (
                    <User className="w-5 h-5 text-white" />
                  ) : (
                    <Bot className="w-5 h-5 text-white" />
                  )}
                </div>
                <div
                  className={`rounded-2xl p-3 shadow-sm overflow-hidden ${
                    msg.sender === "user"
                      ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white"
                      : "bg-white border border-gray-200"
                  }`}
                >
                  <div className="overflow-x-auto">
                    <MessageContent
                      content={msg.content}
                      typing={msg.typing && index === activeTypingIndex}
                      onComplete={() => handleTypingComplete(index)}
                      sender={msg.sender}
                      onStop={() => handleStopGenerating(index)}
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex justify-start">
              <div className="flex gap-3">
                <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center bg-gradient-to-br from-blue-400 to-blue-600 shadow-md">
                  <Loader2 className="w-5 h-5 animate-spin text-white" />
                </div>
                <div className="px-4 py-2 bg-white rounded-2xl shadow-sm border border-gray-200">
                  <span className="text-gray-500">Thinking...</span>
                </div>
              </div>
            </div>
          )}
          {error && (
            <div className="mx-auto max-w-md p-3 text-red-500 bg-red-50 rounded-lg border border-red-100 shadow-sm">
              <p className="text-center text-sm">{error}</p>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      <div className="sticky bottom-16 border-t border-gray-200 bg-white shadow-lg">
        <form onSubmit={handleSubmit} className="p-4 mx-auto max-w-4xl">
          <div className="flex gap-3">
            <div className="flex-1 relative">
              <Textarea
                ref={textareaRef}
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  adjustTextareaHeight();
                }}
                placeholder="Ask me anything about Python..."
                className="w-full min-h-[44px] max-h-[150px] resize-none rounded-xl border-gray-200 focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50 pr-4"
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSubmit(e);
                  }
                }}
                disabled={loading || isTyping}
                required
              />
            </div>
            <Button
              type="submit"
              disabled={loading || !query.trim() || isTyping}
              className={`h-[44px] px-4 bg-gradient-to-r from-blue-500 to-cyan-500 hover:bg-blue-600 text-white shadow-sm transition-colors duration-200 flex-shrink-0 ${
                (loading || isTyping) && "opacity-50 cursor-not-allowed"
              }`}
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Send className="w-6 h-6" />
              )}
            </Button>
          </div>
        </form>
      </div>
      
      

      <BottomNavbar />
    </div>
  );
};

export default LLMPage;
