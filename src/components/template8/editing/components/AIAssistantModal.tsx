import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, MessageSquare, Sparkles, Code, Eye, Settings, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import AICommandParser from '../ai/AICommandParser';
import AIActionImplementer from '../ai/AIActionImplementer';
// ScrollArea not available, using div with scroll

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  type?: 'text' | 'preview' | 'code' | 'action' | 'error';
  action?: any;
}

interface AIAssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
  pageData: any;
  onUpdate: (updates: any) => void;
  currentSection?: string;
  brandColor?: string;
}

const AIAssistantModal: React.FC<AIAssistantModalProps> = ({
  isOpen,
  onClose,
  pageData,
  onUpdate,
  currentSection = 'hero',
  brandColor = '#0ea5e9'
}) => {
  const [messages, setMessages] = useState<Message[]>(() => {
    const suggestions = AICommandParser.getContextualSuggestions(currentSection);
    return [
      {
        id: '1',
        role: 'assistant',
        content: `Hi! I'm your AI assistant for Template8. I can help you create stunning components, modify styling, and enhance your website. 

Currently editing: **${currentSection.charAt(0).toUpperCase() + currentSection.slice(1)} Section**

Here are some things you can try for this section:
${suggestions.map(s => `• "${s}"`).join('\n')}

I can also:
• Create components (before/after sections, carousels, forms)
• Modify styling (colors, gradients, modern designs)
• Hide/show sections
• Update backgrounds and branding

What would you like to create or modify?`,
        timestamp: new Date(),
        type: 'text'
      }
    ];
  });
  
  const [inputMessage, setInputMessage] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [isOpen]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isProcessing) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: inputMessage.trim(),
      timestamp: new Date(),
      type: 'text'
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsProcessing(true);

    try {
      // Parse the user command
      const action = AICommandParser.parseCommand(userMessage.content, currentSection);
      
      if (action) {
        // Show processing message
        const processingMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: `I understand! I'm going to ${action.description.toLowerCase()}. Let me implement this for you...`,
          timestamp: new Date(),
          type: 'text'
        };
        
        setMessages(prev => [...prev, processingMessage]);

        // Implement the action
        const result = await AIActionImplementer.implementAction(action, pageData, onUpdate);
        
        // Show success message
        const successMessage: Message = {
          id: (Date.now() + 2).toString(),
          role: 'assistant',
          content: `✅ **${action.description}**

${result}

The changes have been applied to your Template8 site! You should see the updates reflected in your preview. 

Would you like me to make any adjustments or create something else?`,
          timestamp: new Date(),
          type: 'action',
          action: action
        };

        setMessages(prev => [...prev, successMessage]);
      } else {
        // Provide helpful suggestions if command not recognized
        const suggestions = AICommandParser.getContextualSuggestions(currentSection);
        const helpMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: `I'd love to help with that! I didn't quite understand your request, but here are some things I can do for the ${currentSection} section:

${suggestions.map(s => `• "${s}"`).join('\n')}

You can also try:
• "Create a [component type]"
• "Change the [element] to [description]"
• "Hide the [section name] section"
• "Make the design more [style]"

Could you rephrase your request or try one of the suggestions above?`,
          timestamp: new Date(),
          type: 'text'
        };

        setMessages(prev => [...prev, helpMessage]);
      }
    } catch (error) {
      console.error('AI Assistant error:', error);
      
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: `I apologize, but I encountered an error while trying to help with that request. Please try again or try a different command.

Error: ${error instanceof Error ? error.message : 'Unknown error'}`,
        timestamp: new Date(),
        type: 'error'
      };

      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsProcessing(false);
    }
  };


  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl h-[600px] flex flex-col overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
                <Sparkles size={20} className="text-white" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900">AI Assistant</h2>
                <p className="text-sm text-gray-500">Template8 Editor</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <div className="text-xs px-2 py-1 bg-blue-50 text-blue-600 rounded-full">
                {currentSection.charAt(0).toUpperCase() + currentSection.slice(1)} Section
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={20} />
              </Button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 p-6 overflow-y-auto">
            <div className="space-y-6">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                      message.role === 'user'
                        ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white'
                        : 'bg-gray-50 text-gray-900'
                    }`}
                  >
                    <div className="whitespace-pre-wrap text-sm leading-relaxed">
                      {message.content}
                    </div>
                    <div className={`text-xs mt-2 ${
                      message.role === 'user' ? 'text-blue-100' : 'text-gray-400'
                    }`}>
                      {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                </div>
              ))}
              
              {isProcessing && (
                <div className="flex justify-start">
                  <div className="bg-gray-50 rounded-2xl px-4 py-3 max-w-[80%]">
                    <div className="flex items-center gap-2">
                      <Loader2 size={16} className="animate-spin text-blue-500" />
                      <span className="text-sm text-gray-500">AI is implementing your request...</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-6 border-t border-gray-100">
            <div className="flex gap-3">
              <Textarea
                ref={textareaRef}
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask me to create components, modify styling, or enhance your site..."
                className="resize-none min-h-[50px] border-gray-200 focus:border-blue-300 focus:ring-blue-200"
                rows={2}
              />
              <Button
                onClick={handleSendMessage}
                disabled={!inputMessage.trim() || isProcessing}
                className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-6"
              >
                <Send size={18} />
              </Button>
            </div>
            
            <div className="flex items-center gap-4 mt-3 text-xs text-gray-500">
              <div className="flex items-center gap-1">
                <Code size={12} />
                <span>Generate Components</span>
              </div>
              <div className="flex items-center gap-1">
                <Eye size={12} />
                <span>Preview Changes</span>
              </div>
              <div className="flex items-center gap-1">
                <Settings size={12} />
                <span>Modify Styling</span>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default AIAssistantModal;