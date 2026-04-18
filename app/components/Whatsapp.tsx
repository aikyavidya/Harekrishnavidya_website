"use client";

import React from "react";
import { useState } from "react";
import { X, Send } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

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
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: 50, scale: 0.9, originY: 1, originX: 0 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="bg-white rounded-lg shadow-2xl w-[280px] md:w-[320px] lg:w-[350px] sm:max-w-sm md:max-w-xl mb-3 overflow-hidden border border-gray-200 mx-auto"
          >
            {/* Header */}
            <div className="bg-[#075E54] text-white px-4 py-3 flex items-center justify-between">
              <div>
                <div className="font-medium text-sm">Hare Krishna Vidya </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-white hover:text-gray-200 transition-colors cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            {/* Chat Body */}
            <div className="bg-gray-100 px-3 py-4 h-56 sm:h-64 overflow-y-auto relative bg-[url('https://web.whatsapp.com/img/bg-chat-tile-light_04fcacde5ba4927233215c2ec5dafc85.png')] bg-opacity-20 text-gray-800">
              {/* Today indicator */}
              <div className="text-center text-xs text-gray-500 mb-4 bg-white/60 mx-auto w-max px-3 py-1 rounded-full shadow-sm backdrop-blur-sm shadow-black/10">Today</div>

              {/* Message bubble */}
              <motion.div 
                initial={{ opacity: 0, x: -20, scale: 0.9 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                transition={{ delay: 0.2, type: "spring" }}
                className="bg-white rounded-lg p-3 shadow-[0_1px_0.5px_rgba(0,0,0,0.13)] max-w-[85%] rounded-tl-none relative"
              >
                {/* Tail */}
                <span className="absolute -left-2 top-0 text-white">
                  <svg viewBox="0 0 8 13" width="8" height="13" className="">
                    <path opacity=".13" fill="#0000000" d="M1.533 3.568L8 12.193V1H2.812C1.042 1 .474 2.156 1.533 3.568z"></path>
                    <path fill="currentColor" d="M1.533 2.568L8 11.193V0H2.812C1.042 0 .474 1.156 1.533 2.568z"></path>
                  </svg>
                </span>
                <div className="text-xs text-orange-500 font-bold mb-1">Hare Krishna Vidya</div>
                <div className="text-sm text-gray-800 leading-relaxed pr-8">
                   Hare Krishna! <br />
                    How can we help you?
                </div>
                <div className="absolute right-2 bottom-1 text-[10px] text-gray-400">15:31</div>
              </motion.div>
            </div>

            {/* Input Area */}
            <div className="p-3 bg-[#f0f2f5] border-t border-gray-200">
              <div className="flex items-center bg-white rounded-full px-3 py-2 shadow-sm border border-gray-100">
                <input
                  type="text"
                  placeholder="Type a message"
                  className="flex-1 bg-transparent focus:outline-none text-sm text-gray-700 placeholder-gray-400"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                />
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={handleSend}
                  className={`${message.trim() ? 'text-[#00a884]' : 'text-gray-400'} rounded-full p-2 ml-2 transition-colors cursor-pointer`}
                  disabled={!message.trim()}
                >
                  <Send size={20} />
                </motion.button>
              </div>

              {/* Powered by footer */}
              <div className="text-center text-[10px] text-gray-400 mt-2 flex items-center justify-center gap-1 opacity-70">
                Powered by Hare Krishna Vidya
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating WhatsApp Button */}
      <div className="relative group ml-4 lg:ml-0">
        {!isOpen && (
          <div className="absolute -inset-2 bg-green-500 rounded-full opacity-40 animate-ping group-hover:hidden"></div>
        )}
        <motion.button
          onClick={() => setIsOpen(!isOpen)}
          whileHover={{ scale: 1.1, rotate: 10 }}
          whileTap={{ scale: 0.9 }}
          className="relative bg-[#25D366] hover:bg-[#128C7E] text-white rounded-full p-4 shadow-xl transition-colors duration-300 cursor-pointer z-10"
        >
          <FaWhatsapp size={28} fill="currentColor" />
        </motion.button>
      </div>
    </div>
  );
};

export default WhatsAppButton;
