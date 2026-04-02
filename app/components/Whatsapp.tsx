"use client";

import React from "react";
import { useState } from "react";
import { X, Send } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";

const WhatsAppButton = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");

  const handleSend = () => {
    if (message.trim() !== "") {
      const url = `https://wa.me/918328389862?text=${encodeURIComponent(
        message
      )}`;
      window.open(url, "_blank");
      setMessage("");
      setIsOpen(false);
    }
  };

  interface KeyPressEvent {
    key: string;
    preventDefault?: () => void;
  }

  const handleKeyPress = (
    e: React.KeyboardEvent<HTMLInputElement> & KeyPressEvent
  ) => {
    if (e.key === "Enter") {
      handleSend();
    }
  };

  return (
    <div className="fixed bottom-4 lg:bottom-10 left-1 lg:left-4 z-50 flex flex-col items-end ">
      {isOpen && (
<div className="bg-white rounded-lg shadow-2xl w-[280px] md:w-[320px] lg:w-[350px] sm:max-w-sm md:max-w-xl mb-3 overflow-hidden border border-gray-200 mx-auto">
          {/* Header */}
          <div className="bg-[#075E54] text-white px-4 py-3 flex items-center justify-between">
            <div>
              <div className="font-medium text-sm">Hare Krishna Vidya </div>
              {/* <div className="text-xs text-teal-100 opacity-90">
                Replies within 1 day
              </div> */}
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-white hover:text-gray-200 transition-colors cursor-pointer"
            >
              <X size={16} />
            </button>
          </div>

          {/* Chat Body */}
          <div className="bg-gray-100 px-3 py-4 h-56 sm:h-64 overflow-y-auto">
            {/* Today indicator */}
            <div className="text-center text-xs text-gray-500 mb-4">Today</div>

            {/* Message bubble */}
            <div className="bg-[#DCF8C6] rounded-lg p-3 shadow-sm max-w-full">
              <div className="text-xs text-gray-400 mb-1">Hare Krishna Vidya</div>
              <div className="text-sm text-gray-800 leading-relaxed">
                 Hare Krishna! <br />
                  How can we help you?
              </div>
              <div className="text-right text-xs text-gray-400 ">15:31</div>
            </div>
          </div>

          {/* Input Area */}
          <div className="p-3 bg-white border-t border-gray-100">
            <div className="flex items-center bg-gray-100 rounded-full px-3 py-2">
              <input
                type="text"
                placeholder="Enter your message"
                className="flex-1 bg-transparent focus:outline-none text-sm text-gray-700 placeholder-gray-400"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={handleKeyPress}
              />
              <button
                onClick={handleSend}
                className="bg-teal-600 hover:bg-teal-700 text-white rounded-full p-2 ml-2 transition-colors cursor-pointer"
                disabled={!message.trim()}
              >
                <Send size={16} />
              </button>
            </div>

            {/* Powered by footer */}
            <div className="text-center text-xs text-gray-400 mt-2 flex items-center justify-center gap-1">
              Powered by
              <span className="flex items-center gap-1">
                <div className="w-3 h-3 bg-orange-500 rounded-sm flex items-center justify-center">
                  <span className="text-white text-[8px] font-bold">B</span>
                </div>
                Buttonizer
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Floating WhatsApp Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-green-500 hover:bg-green-600 text-white rounded-full p-4 shadow-lg transition-all duration-300 hover:scale-110 cursor-pointer"
      >
        <FaWhatsapp size={24} fill="currentColor" />
      </button>
    </div>
  );
};

export default WhatsAppButton;
