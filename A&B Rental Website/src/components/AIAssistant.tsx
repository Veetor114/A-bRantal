import { useState, useRef, useEffect } from 'react';
import { X, Send, Mic, MicOff, Phone, MessageCircle, Bot } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Property } from '../App';
import { Avatar, AvatarFallback } from './ui/avatar';
import { Badge } from './ui/badge';

interface AIAssistantProps {
  onClose: () => void;
  properties: Property[];
  onPropertySelect: (property: Property) => void;
}

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  suggestedProperties?: Property[];
}

export function AIAssistant({ onClose, properties, onPropertySelect }: AIAssistantProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: "Hi! I'm your A&B assistant. I can help you find the perfect property, answer questions, or assist with bookings. How can I help you today?",
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isVoiceActive, setIsVoiceActive] = useState(false);
  const [isInCall, setIsInCall] = useState(false);
  const [callDuration, setCallDuration] = useState(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isInCall) {
      interval = setInterval(() => {
        setCallDuration((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isInCall]);

  const formatCallDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const generateAIResponse = (userMessage: string): { content: string; properties?: Property[] } => {
    const lowerMessage = userMessage.toLowerCase();
    
    // Property search queries
    if (lowerMessage.includes('beach') || lowerMessage.includes('ocean')) {
      const beachProperties = properties.filter(p => 
        p.location.toLowerCase().includes('malibu') || 
        p.location.toLowerCase().includes('miami') ||
        p.amenities.some(a => a.toLowerCase().includes('beach') || a.toLowerCase().includes('ocean'))
      );
      return {
        content: `I found ${beachProperties.length} beautiful beachfront properties for you! These locations offer stunning ocean views and beach access. Would you like to know more about any of these?`,
        properties: beachProperties
      };
    }
    
    if (lowerMessage.includes('luxury') || lowerMessage.includes('expensive')) {
      const luxuryProperties = properties.filter(p => p.price > 400);
      return {
        content: `Here are our premium luxury properties. Each offers exceptional amenities and world-class comfort. Which one catches your eye?`,
        properties: luxuryProperties
      };
    }
    
    if (lowerMessage.includes('cheap') || lowerMessage.includes('budget') || lowerMessage.includes('affordable')) {
      const budgetProperties = properties.filter(p => p.price < 300);
      return {
        content: `I've found some excellent budget-friendly options that don't compromise on quality! These properties offer great value for your stay.`,
        properties: budgetProperties
      };
    }
    
    if (lowerMessage.includes('mountain') || lowerMessage.includes('cabin')) {
      const mountainProperties = properties.filter(p => 
        p.location.toLowerCase().includes('aspen') || 
        p.amenities.some(a => a.toLowerCase().includes('mountain'))
      );
      return {
        content: `Perfect! I found cozy mountain retreats for you. Ideal for nature lovers and those seeking a peaceful getaway.`,
        properties: mountainProperties
      };
    }
    
    if (lowerMessage.includes('pool')) {
      const poolProperties = properties.filter(p => 
        p.amenities.some(a => a.toLowerCase().includes('pool'))
      );
      return {
        content: `Here are our properties with private pools! Perfect for relaxation and entertainment.`,
        properties: poolProperties
      };
    }

    // Booking assistance
    if (lowerMessage.includes('book') || lowerMessage.includes('reserve')) {
      return {
        content: "I'd be happy to help you with your booking! Please select a property you're interested in, and I can guide you through the reservation process. You can also check availability by selecting your dates on the property page."
      };
    }

    // General questions
    if (lowerMessage.includes('cancel') || lowerMessage.includes('refund')) {
      return {
        content: "Our cancellation policy varies by property. Generally, you can cancel up to 48 hours before check-in for a full refund. Some properties offer flexible cancellation. Would you like me to check a specific property's policy?"
      };
    }

    if (lowerMessage.includes('payment') || lowerMessage.includes('pay')) {
      return {
        content: "We accept all major credit cards, debit cards, and digital payment methods. Payment is securely processed when you complete your booking. You'll only be charged after your reservation is confirmed."
      };
    }

    if (lowerMessage.includes('amenities') || lowerMessage.includes('facilities')) {
      return {
        content: "Our properties offer a wide range of amenities including WiFi, fully-equipped kitchens, pools, hot tubs, workspaces, and more. Each property listing shows all available amenities. Is there a specific amenity you're looking for?"
      };
    }

    // Default helpful response
    return {
      content: "I can help you with:\n\n• Finding properties based on your preferences\n• Booking assistance and availability\n• Questions about amenities and policies\n• Recommendations for your trip\n\nWhat would you like to know more about?"
    };
  };

  const handleSend = () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    setTimeout(() => {
      const { content, properties: suggestedProps } = generateAIResponse(input);
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content,
        timestamp: new Date(),
        suggestedProperties: suggestedProps
      };
      setMessages(prev => [...prev, aiMessage]);
      setIsTyping(false);
    }, 1000 + Math.random() * 1000);
  };

  const handleVoiceToggle = () => {
    setIsVoiceActive(!isVoiceActive);
    if (!isVoiceActive) {
      // Simulate voice recognition
      setTimeout(() => {
        setInput("Show me beachfront properties");
        setIsVoiceActive(false);
      }, 2000);
    }
  };

  const handleCallToggle = () => {
    if (!isInCall) {
      setIsInCall(true);
      setCallDuration(0);
      // Add call started message
      const callMessage: Message = {
        id: Date.now().toString(),
        role: 'assistant',
        content: "Voice call connected! I can hear you clearly. How can I assist you today?",
        timestamp: new Date()
      };
      setMessages(prev => [...prev, callMessage]);
    } else {
      setIsInCall(false);
      // Add call ended message
      const endMessage: Message = {
        id: Date.now().toString(),
        role: 'assistant',
        content: `Call ended. Duration: ${formatCallDuration(callDuration)}. Is there anything else I can help you with?`,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, endMessage]);
    }
  };

  return (
    <div className="fixed inset-0 sm:inset-auto sm:bottom-6 sm:right-6 sm:w-[400px] sm:h-[600px] z-50 flex flex-col bg-white sm:rounded-2xl shadow-2xl border border-gray-200">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-white/20 flex items-center justify-center">
            <Bot className="h-6 w-6 text-white" />
          </div>
          <div>
            <h3 className="text-white">AI Assistant</h3>
            <p className="text-xs text-white/80">Always here to help</p>
          </div>
        </div>
        <Button 
          size="icon" 
          variant="ghost" 
          onClick={onClose}
          className="text-white hover:bg-white/20"
        >
          <X className="h-5 w-5" />
        </Button>
      </div>

      {/* Voice Call Active Banner */}
      {isInCall && (
        <div className="bg-green-500 text-white px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-white animate-pulse" />
            <span className="text-sm">Voice call active</span>
          </div>
          <span className="text-sm">{formatCallDuration(callDuration)}</span>
        </div>
      )}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div key={message.id}>
            <div className={`flex gap-3 ${message.role === 'user' ? 'flex-row-reverse' : ''}`}>
              <Avatar className="h-8 w-8 flex-shrink-0">
                <AvatarFallback className={message.role === 'user' ? 'bg-blue-600 text-white' : 'bg-purple-600 text-white'}>
                  {message.role === 'user' ? 'U' : 'AI'}
                </AvatarFallback>
              </Avatar>
              <div className={`flex-1 ${message.role === 'user' ? 'flex justify-end' : ''}`}>
                <div className={`inline-block px-4 py-2 rounded-2xl max-w-[85%] ${
                  message.role === 'user' 
                    ? 'bg-blue-600 text-white rounded-tr-sm' 
                    : 'bg-gray-100 text-gray-900 rounded-tl-sm'
                }`}>
                  <p className="text-sm whitespace-pre-line">{message.content}</p>
                </div>
                <p className="text-xs text-gray-500 mt-1 px-1">
                  {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </div>

            {/* Suggested Properties */}
            {message.suggestedProperties && message.suggestedProperties.length > 0 && (
              <div className="ml-11 mt-3 space-y-2">
                {message.suggestedProperties.map((property) => (
                  <button
                    key={property.id}
                    onClick={() => {
                      onPropertySelect(property);
                      onClose();
                    }}
                    className="w-full bg-white border border-gray-200 rounded-lg p-3 hover:border-blue-600 hover:shadow-md transition-all text-left"
                  >
                    <div className="flex gap-3">
                      <img 
                        src={property.image} 
                        alt={property.title}
                        className="w-16 h-16 rounded-lg object-cover"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-gray-900 truncate">{property.title}</p>
                        <p className="text-xs text-gray-600">{property.location}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="secondary" className="text-xs">${property.price}/night</Badge>
                          <span className="text-xs text-gray-500">★ {property.rating}</span>
                        </div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}

        {isTyping && (
          <div className="flex gap-3">
            <Avatar className="h-8 w-8">
              <AvatarFallback className="bg-purple-600 text-white">AI</AvatarFallback>
            </Avatar>
            <div className="bg-gray-100 rounded-2xl rounded-tl-sm px-4 py-3">
              <div className="flex gap-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 border-t border-gray-200 bg-gray-50">
        <div className="flex gap-2 mb-3">
          <Button
            variant={isInCall ? "default" : "outline"}
            size="sm"
            className={`flex-1 gap-2 ${isInCall ? 'bg-green-600 hover:bg-green-700' : ''}`}
            onClick={handleCallToggle}
          >
            <Phone className="h-4 w-4" />
            {isInCall ? 'End Call' : 'Voice Call'}
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="flex-1 gap-2"
          >
            <MessageCircle className="h-4 w-4" />
            Chat
          </Button>
        </div>
        
        <div className="flex gap-2">
          <Button
            size="icon"
            variant={isVoiceActive ? "default" : "outline"}
            onClick={handleVoiceToggle}
            className={isVoiceActive ? 'bg-red-600 hover:bg-red-700' : ''}
          >
            {isVoiceActive ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
          </Button>
          <Input
            placeholder={isVoiceActive ? "Listening..." : "Type your message..."}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            disabled={isVoiceActive}
            className="flex-1"
          />
          <Button size="icon" onClick={handleSend} disabled={!input.trim()}>
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
