import React, { useState } from "react";

const Chatbot: React.FC = () => {
  const [messages, setMessages] = useState<{ sender: string; text: string }[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = input;
    setMessages((prev) => [...prev, { sender: "user", text: userMessage }]);
    setInput("");
    setIsLoading(true);

    try {
      const res = await fetch("https://metalyticsai-chatbot.onrender.com/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMessage }),
      });
      const data = await res.json();

      setMessages((prev) => [...prev, { sender: "bot", text: data.reply }]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: "Sorry, I'm having trouble connecting. Please try again." },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      sendMessage();
    }
  };

  const toggleChat = () => setIsOpen((v) => !v);

  return (
    <>
      {/* Floating Icon (fixed bottom-right) */}
      {!isOpen && (
        <div className="fixed z-50 bottom-10 right-10">
          <div
            className="w-14 h-14 bg-gradient-to-r from-blue-600 to-blue-700 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center cursor-pointer hover:scale-110 group"
            onClick={toggleChat}
          >
            <span className="text-white text-2xl group-hover:animate-bounce">🤖</span>
          </div>

          {/* Tooltip */}
          <div className="relative">
            <div className="absolute -top-2 right-1/2 translate-y-[-100%] translate-x-1/2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
              MetalAI Assistant
            </div>
          </div>
        </div>
      )}

      {/* Floating Chat Window (fixed bottom-right) */}
      {isOpen && (
        <div className="fixed z-50 bottom-4 right-4">
          <div className="w-96 h-[600px] bg-white rounded-lg shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-bottom-4 duration-300">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-4">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <h2 className="text-xl font-bold">MetalAI</h2>
                  <p className="text-blue-100 text-sm">Your LCA Assistant</p>
                </div>
                <div className="flex items-center space-x-2">
                  {/* Minimize */}
                  <button
                    onClick={toggleChat}
                    className="w-8 h-8 bg-blue-500 hover:bg-blue-400 rounded-full flex items-center justify-center transition-colors"
                  >
                    <span className="text-white text-sm">−</span>
                  </button>
                  {/* Close */}
                  <button
                    onClick={toggleChat}
                    className="w-8 h-8 bg-red-500 hover:bg-red-400 rounded-full flex items-center justify-center transition-colors"
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
                <div key={index} className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}>
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
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0.1s" }}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
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
                />
                <button
                  className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                  onClick={sendMessage}
                  disabled={isLoading || !input.trim()}
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
