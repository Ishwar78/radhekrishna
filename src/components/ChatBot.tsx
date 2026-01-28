import { useState, useEffect } from "react";
import { MessageCircle, X, Send } from "lucide-react";
import { cn } from "@/lib/utils";

interface Message {
  id: string;
  text: string;
  sender: "user" | "bot";
  timestamp: Date;
}

interface ChatbotSettings {
  businessName: string;
  welcomeMessage: string;
  supportEmail: string;
  supportPhone: string;
  whatsappNumber: string;
  genericReply: string;
  storeHours: string;
  isActive: boolean;
}

const getQuickQuestions = (settings: ChatbotSettings | null) => [
  { label: "Store timing?", reply: `Our store hours are:\n${settings?.storeHours || 'Monday - Saturday: 10:00 AM - 7:00 PM\nSunday: Closed'}\n\nYou can shop online 24/7!` },
  { label: "Delivery charges?", reply: "We offer free delivery on orders above ₹999. Standard delivery takes 5-7 business days. Express delivery is also available." },
  { label: "Return policy?", reply: "You can return items within 7 days of purchase if they are unused and in original packaging. Please contact our support team for the return process." },
  { label: "Payment options?", reply: "We accept Credit Cards, Debit Cards, UPI, Net Banking, and Cash on Delivery (COD). All payments are secure and encrypted." },
  { label: "How to track my order?", reply: "Once your order is shipped, you'll receive a tracking link via email and SMS. You can track your order in real-time." },
  { label: "Do you have size guides?", reply: "Yes! We have detailed size guides for all products. Check the size chart on each product page to find your perfect fit." },
  { label: "Can I cancel my order?", reply: "You can cancel your order within 24 hours of placement. After that, if the order has been shipped, you can return it." },
  { label: "Bulk orders?", reply: "Yes, we offer special discounts on bulk orders. Please contact our support team for bulk inquiries." },
];

export default function ChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [settings, setSettings] = useState<ChatbotSettings | null>(null);
  const [settingsLoading, setSettingsLoading] = useState(true);

  const API_URL = import.meta.env.VITE_API_URL || '/api';

  // Fetch chatbot settings
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await fetch(`${API_URL}/chatbot-settings`);
        const data = await response.json();
        if (data.success) {
          setSettings(data.settings);
          // Initialize messages with welcome message
          setMessages([
            {
              id: "welcome",
              text: data.settings.welcomeMessage,
              sender: "bot",
              timestamp: new Date(),
            },
          ]);
        }
      } catch (error) {
        console.error('Error fetching chatbot settings:', error);
        // Use default settings on error
        const defaultSettings: ChatbotSettings = {
          businessName: 'Shree RadheKrishna Collection',
          welcomeMessage: 'Namaste! 🙏 Welcome to our store. I\'m here to help you with any questions.',
          supportEmail: 'support@vasstra.com',
          supportPhone: '+91 98765 43210',
          whatsappNumber: '919876543210',
          genericReply: 'Thanks for your message! Our team will get back to you shortly.',
          storeHours: 'Monday - Saturday: 10:00 AM - 7:00 PM',
          isActive: true,
        };
        setSettings(defaultSettings);
        setMessages([
          {
            id: "welcome",
            text: defaultSettings.welcomeMessage,
            sender: "bot",
            timestamp: new Date(),
          },
        ]);
      } finally {
        setSettingsLoading(false);
      }
    };

    fetchSettings();
  }, [API_URL]);

  const handleQuickQuestion = (question: string, reply: string) => {
    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      text: question,
      sender: "user",
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMessage]);

    // Simulate bot thinking
    setIsLoading(true);
    setTimeout(() => {
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: reply,
        sender: "bot",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, botMessage]);
      setIsLoading(false);
    }, 800);
  };

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputValue,
      sender: "user",
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");

    // Simulate bot thinking and send a generic response
    setIsLoading(true);
    setTimeout(() => {
      const reply = settings?.genericReply?.replace('{email}', settings?.supportEmail || 'support@vasstra.com').replace('{whatsapp}', `WhatsApp ${settings?.supportPhone || '+91 98765 43210'}`) || 'Thanks for your message! Our team will get back to you shortly.';
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: reply,
        sender: "bot",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, botMessage]);
      setIsLoading(false);
    }, 1000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <>
      {/* Chat Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "fixed bottom-24 right-6 h-14 w-14 rounded-full flex items-center justify-center shadow-lg transition-all duration-300 hover:scale-110",
          "bg-emerald-500 text-white hover:bg-emerald-600 z-40"
        )}
        title="Chat with us"
      >
        {isOpen ? <X className="h-6 w-6" /> : <MessageCircle className="h-6 w-6" />}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-40 right-6 w-96 bg-white rounded-lg shadow-2xl flex flex-col z-40 max-h-[600px] animate-in fade-in slide-in-from-bottom-4 duration-300">
          {/* Chat Header */}
          <div className="bg-gradient-to-r from-emerald-500 to-emerald-600 text-white p-4 rounded-t-lg">
            <h3 className="font-semibold text-lg">{settings?.businessName || 'Shree RadheKrishna Collection'}</h3>
            <p className="text-xs text-emerald-100">Usually replies instantly</p>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
            {messages.map((message) => (
              <div
                key={message.id}
                className={cn(
                  "flex",
                  message.sender === "user" ? "justify-end" : "justify-start"
                )}
              >
                <div
                  className={cn(
                    "max-w-xs px-4 py-2 rounded-lg text-sm",
                    message.sender === "user"
                      ? "bg-blue-600 text-white rounded-br-none"
                      : "bg-white text-gray-800 border border-gray-200 rounded-bl-none"
                  )}
                >
                  <p className="break-words">{message.text}</p>
                  <p
                    className={cn(
                      "text-xs mt-1",
                      message.sender === "user" ? "text-blue-100" : "text-gray-500"
                    )}
                  >
                    {message.timestamp.toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white text-gray-800 border border-gray-200 px-4 py-2 rounded-lg rounded-bl-none">
                  <div className="flex gap-1">
                    <div className="h-2 w-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div
                      className="h-2 w-2 bg-gray-400 rounded-full animate-bounce"
                      style={{ animationDelay: "0.1s" }}
                    ></div>
                    <div
                      className="h-2 w-2 bg-gray-400 rounded-full animate-bounce"
                      style={{ animationDelay: "0.2s" }}
                    ></div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Quick Questions - Show if only welcome message or first interaction */}
          {messages.length === 1 && (
            <div className="px-4 py-3 bg-white border-t border-gray-200">
              <p className="text-xs font-semibold text-gray-700 mb-2">Quick questions:</p>
              <div className="grid grid-cols-2 gap-2">
                {getQuickQuestions(settings).map((q, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleQuickQuestion(q.label, q.reply)}
                    className="text-xs bg-emerald-100 text-emerald-700 hover:bg-emerald-200 px-3 py-2 rounded transition-colors font-medium"
                  >
                    {q.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input Area */}
          <div className="border-t border-gray-200 p-3 bg-white rounded-b-lg flex gap-2">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type a message..."
              className="flex-1 border border-gray-300 rounded-full px-4 py-2 text-sm focus:outline-none focus:border-emerald-500"
            />
            <button
              onClick={handleSendMessage}
              disabled={!inputValue.trim() || isLoading}
              className="bg-emerald-500 hover:bg-emerald-600 disabled:bg-gray-300 text-white rounded-full p-2 transition-colors"
            >
              <Send className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </>
  );
}
