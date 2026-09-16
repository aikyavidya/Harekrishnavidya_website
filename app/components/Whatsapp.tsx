"use client";

import React, { useState } from "react";
import { X, Send } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

const WhatsAppButton = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");

  const handleSend = () => {
    if (message.trim() !== "") {
      const url = `https://wa.me/918019397108?text=${encodeURIComponent(message)}`;
      window.open(url, "_blank");
      setMessage("");
      setIsOpen(false);
    }
  };

  const handleKeyPress = (
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === "Enter") handleSend();
  };

  return (
    <div className="fixed bottom-4 lg:bottom-10 left-1 lg:left-4 z-50 flex flex-col items-end">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="bg-white rounded-lg shadow-2xl w-[280px] md:w-[320px] lg:w-[350px] mb-3 overflow-hidden border border-gray-200"
          >
            {/* Header */}
            <div className="bg-[#075E54] text-white px-4 py-3 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Image
                  src="/images/khagendra.jpeg"
                  alt="Khagendra Dasa"
                  width={42}
                  height={42}
                  className="rounded-full object-cover border border-white"
                />

                <div>
                  <h3 className="font-semibold text-sm">
                    Khagendra Dasa
                  </h3>
                  <p className="text-[11px] text-green-100">
                    Online
                  </p>
                </div>
              </div>

              <button
                onClick={() => setIsOpen(false)}
                className="text-white hover:text-gray-200"
              >
                <X size={16} />
              </button>
            </div>

            {/* Chat Body */}
            <div className="bg-gray-100 px-3 py-4 h-64 overflow-y-auto relative bg-[url('https://web.whatsapp.com/img/bg-chat-tile-light_04fcacde5ba4927233215c2ec5dafc85.png')]">
              <div className="text-center text-xs text-gray-500 mb-4 bg-white/70 w-max mx-auto px-3 py-1 rounded-full">
                Today
              </div>

              <div className="flex items-start gap-2">
                <Image
                  src="/images/khagendra.jpeg"
                  alt="Khagendra Dasa"
                  width={32}
                  height={32}
                  className="rounded-full object-cover"
                />

                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="bg-white rounded-lg p-3 shadow max-w-[80%] relative"
                >
                  <div className="text-xs text-orange-500 font-bold mb-1">
                    Khagendra Dasa
                  </div>

                  <div className="text-sm text-gray-800">
                    Hare Krishna! 🙏
                    <br />
                    How can we help you?
                  </div>

                  <div className="text-[10px] text-gray-400 text-right mt-1">
                    15:31
                  </div>
                </motion.div>
              </div>
            </div>

            {/* Input */}
            <div className="p-3 bg-[#f0f2f5] border-t">
              <div className="flex items-center bg-white rounded-full px-3 py-2">
                <input
                  type="text"
                  placeholder="Type a message"
                  className="flex-1 outline-none text-sm"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyDown={handleKeyPress}
                />

                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={handleSend}
                  disabled={!message.trim()}
                  className={`p-2 ${message.trim()
                      ? "text-[#00a884]"
                      : "text-gray-400"
                    }`}
                >
                  <Send size={20} />
                </motion.button>
              </div>

              <div className="text-center text-[10px] text-gray-400 mt-2">
                Powered by Hare Krishna Vidya
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Button */}
      <div className="relative group">
        {!isOpen && (
          <div className="absolute -inset-2 bg-green-500 rounded-full opacity-40 animate-ping" />
        )}

        <motion.button
          onClick={() => setIsOpen(!isOpen)}
          whileHover={{ scale: 1.1, rotate: 10 }}
          whileTap={{ scale: 0.9 }}
          className="relative bg-[#25D366] hover:bg-[#128C7E] text-white rounded-full p-4 shadow-xl"
        >
          <FaWhatsapp size={28} />
        </motion.button>
      </div>
    </div>
  );
};

export default WhatsAppButton;