import React, { useState, useRef, useEffect } from "react";

const Chatbot: React.FC = () => {
  const [messages, setMessages] = useState<{ sender: string; text: string }[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState({ x: window.innerWidth - 100, y: window.innerHeight - 100 });
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  
  const chatbotRef = useRef<HTMLDivElement>(null);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = input;
    setMessages([...messages, { sender: "user", text: userMessage }]);
    setInput("");
    setIsLoading(true);

    try {
      const res = await fetch("http://127.0.0.1:5000/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMessage }),
      });
      const data = await res.json();

      setMessages((prev) => [...prev, { sender: "bot", text: data.reply }]);
    } catch (error) {
      setMessages((prev) => [...prev, { sender: "bot", text: "Sorry, I'm having trouble connecting. Please try again." }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      sendMessage();
    }
  };

  // Updated dragging functionality - works for both icon and chat window
  const handleMouseDown = (e: React.MouseEvent) => {
    // Prevent dragging if clicking on buttons or input elements
    const target = e.target as HTMLElement;
    if (target.tagName === 'BUTTON' || target.tagName === 'INPUT' || target.closest('button') || target.closest('input')) {
      return;
    }
    
    setIsDragging(true);
    const rect = chatbotRef.current?.getBoundingClientRect();
    if (rect) {
      setDragOffset({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      });
    }
    
    // Prevent text selection while dragging
    e.preventDefault();
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging) return;
    
    const newX = e.clientX - dragOffset.x;
    const newY = e.clientY - dragOffset.y;
    
    // Keep within screen bounds
    const maxX = window.innerWidth - (isOpen ? 384 : 60); // 384px = w-96, 60px = icon width
    const maxY = window.innerHeight - (isOpen ? 600 : 60); // 600px = chat height, 60px = icon height
    
    setPosition({
      x: Math.max(0, Math.min(newX, maxX)),
      y: Math.max(0, Math.min(newY, maxY))
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Event listeners for dragging
  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      // Prevent text selection while dragging
      document.body.style.userSelect = 'none';
    } else {
      document.body.style.userSelect = '';
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.body.style.userSelect = '';
    };
  }, [isDragging, dragOffset]);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      const maxX = window.innerWidth - (isOpen ? 384 : 60);
      const maxY = window.innerHeight - (isOpen ? 600 : 60);
      
      setPosition(prev => ({
        x: Math.min(prev.x, maxX),
        y: Math.min(prev.y, maxY)
      }));
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isOpen]);

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      {/* Floating Icon */}
      {!isOpen && (
        <div
          ref={chatbotRef}
          className={`fixed z-50 ${isDragging ? 'cursor-grabbing' : 'cursor-grab'} select-none`}
          style={{
            left: `${position.x}px`,
            top: `${position.y}px`,
          }}
          onMouseDown={handleMouseDown}
        >
          <div
            className="w-14 h-14 bg-gradient-to-r from-blue-600 to-blue-700 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center cursor-pointer hover:scale-110 group"
            onClick={toggleChat}
          >
            <span className="text-white text-2xl group-hover:animate-bounce">🤖</span>
          </div>
          
          {/* Tooltip */}
          <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
            MetalAI Assistant
          </div>
        </div>
      )}

      {/* Floating Chat Window */}
      {isOpen && (
        <div
          ref={chatbotRef}
          className={`fixed z-50 select-none ${isDragging ? 'cursor-grabbing' : ''}`}
          style={{
            left: `${position.x}px`,
            top: `${position.y}px`,
          }}
        >
          <div className="w-96 h-[600px] bg-white rounded-lg shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-bottom-4 duration-300">
            {/* Header - Draggable */}
            <div 
              className={`bg-gradient-to-r from-blue-600 to-blue-700 text-white p-4 ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
              onMouseDown={handleMouseDown}
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <h2 className="text-xl font-bold">MetalAI</h2>
                  <p className="text-blue-100 text-sm">Your LCA Assistant</p>
                </div>
                <div className="flex items-center space-x-2">
                  {/* Minimize Button */}
                  <button
                    onClick={toggleChat}
                    className="w-8 h-8 bg-blue-500 hover:bg-blue-400 rounded-full flex items-center justify-center transition-colors z-10"
                    onMouseDown={(e) => e.stopPropagation()} // Prevent dragging when clicking button
                  >
                    <span className="text-white text-sm">−</span>
                  </button>
                  {/* Close Button */}
                  <button
                    onClick={toggleChat}
                    className="w-8 h-8 bg-red-500 hover:bg-red-400 rounded-full flex items-center justify-center transition-colors z-10"
                    onMouseDown={(e) => e.stopPropagation()} // Prevent dragging when clicking button
                  >
                    <span className="text-white text-sm">×</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50">
              {messages.length === 0 && (
                <div className="text-center text-gray-500 mt-8">
                  <div className="text-4xl mb-2">🤖</div>
                  <p className="text-sm">Hello! I'm MetalAI, ready to help with your LCA questions.</p>
                  <div className="mt-4 text-xs text-gray-400">
                    <p>Try asking about:</p>
                    <ul className="mt-2 space-y-1">
                      <li>• Carbon footprint calculations</li>
                      <li>• Material impact assessments</li>
                      <li>• Sustainability strategies</li>
                    </ul>
                  </div>
                </div>
              )}
              
              {messages.map((msg, index) => (
                <div
                  key={index}
                  className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[80%] p-3 rounded-lg ${
                      msg.sender === "user"
                        ? "bg-blue-600 text-white rounded-br-sm"
                        : "bg-white text-gray-800 shadow-sm rounded-bl-sm border"
                    }`}
                  >
                    <p className="text-sm leading-relaxed">{msg.text}</p>
                  </div>
                </div>
              ))}
              
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-white text-gray-800 p-3 rounded-lg rounded-bl-sm border shadow-sm">
                    <div className="flex items-center space-x-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Input */}
            <div className="p-4 bg-white border-t">
              <div className="flex space-x-2">
                <input
                  className="text-white flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ask about LCA, metals, or environmental impact..."
                  disabled={isLoading}
                  onMouseDown={(e) => e.stopPropagation()} // Prevent dragging when clicking input
                />
                <button
                  className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                  onClick={sendMessage}
                  disabled={isLoading || !input.trim()}
                  onMouseDown={(e) => e.stopPropagation()} // Prevent dragging when clicking button
                >
                  {isLoading ? "..." : "Send"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Chatbot;
