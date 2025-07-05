import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import apiClient from '@/lib/apiClient';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router';
import ReactMarkdown from 'react-markdown';

function GeminiChatInterface({ className }) {
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [error, setError] = useState(null);
    const [senderId, setSenderId] = useState(null); // State to store senderId
    const messagesEndRef = useRef(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchSenderData = async () => {
            try {
                const response = await apiClient.get('/auth/profile');
                setSenderId(response.data._id);
            } catch (error) {
                console.error('Error fetching user data:', error);
                setError('Failed to fetch user data.');
            }
        };
        fetchSenderData();
    }, []);

    const scrollToBottom = useCallback(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, []); // No dependencies, as it only interacts with the ref

    useEffect(() => {
        scrollToBottom();
    }, [messages, scrollToBottom]); // Add scrollToBottom to dependencies

    const handleSendMessage = async () => {
        if (!newMessage.trim() || !senderId) return; // Ensure senderId is available

        const userMessage = { role: 'user', parts: [{ text: newMessage }] };
        setMessages((prevMessages) => [...prevMessages, userMessage]);
        setNewMessage('');
        setError(null);

        try {
            const response = await apiClient.post('/gemini/chat', {
                prompt: newMessage,
                history: messages.map(msg => ({ role: msg.role, parts: msg.parts })), // Send current history
                userId: senderId // Pass the senderId to the backend
            });

            const aiResponse = { role: 'model', parts: [{ text: response.data.response }] };
            setMessages((prevMessages) => [...prevMessages, aiResponse]);

        } catch (err) {
            console.error('Error sending message to ProjectShare AI:', err);
            setError('Failed to get response from AI.');
            setMessages((prevMessages) => [...prevMessages, { role: 'model', parts: [{ text: 'Sorry, I am unable to respond at the moment.' }] }]);
        }
    };

    return (
        <div className={`flex flex-col h-full ${className}`}>
            <div className="bg-gray-100 p-4 border-b border-gray-200 flex items-center">
                <Button variant="outline" size="icon" onClick={() => navigate(-1)}>
                    <ArrowLeft/>
                </Button>
                <div className="ml-2">
                    <h2 className="text-lg font-semibold">ProjectShare AI Chatbot</h2>
                    <p className="text-gray-500">Chat about your application</p>
                </div>
            </div>
            <div className="flex-1 overflow-y-auto p-4 flex flex-col">
            <div className={`mb-2 p-2 rounded-lg bg-gray-100 self-start max-w-max`}>
                        <p className="text-xs text-gray-600">
                            ProjectShare AI
                        </p>
                        <p className="max-w-prose break-words">Hello, I'm ProjectShare AI! I'm here to help you manage your projects and tasks. How can I assist you today?</p>
                    </div>
                {messages.map((message, index) => (
                    <div
                        key={index}
                        className={`mb-2 p-2 rounded-lg ${
                            message.role === 'user'
                                ? 'bg-blue-100 self-end text-right max-w-max'
                                : 'bg-gray-100 self-start max-w-max'
                        }`}
                    >
                        <p className="text-xs text-gray-600">
                            {message.role === 'user' ? 'You' : 'ProjectShare AI'}
                        </p>
                        <p className="max-w-prose break-words">
                            {message.role === 'user' ? message.parts[0].text : <ReactMarkdown>{message.parts[0].text}</ReactMarkdown>}
                        </p>
                    </div>
                ))}
                <div ref={messagesEndRef} />
            </div>
            <div className="p-4 bg-white border-t border-gray-200">
                {error && <div className="text-red-500 mb-2">{error}</div>}
                <div className="flex space-x-2">
                    <Input
                        type="text"
                        placeholder="Ask ProjectShare AI about your application..."
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyPress={(e) => {
                            if (e.key === 'Enter') {
                                handleSendMessage();
                            }
                        }}
                        className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    />
                    <Button onClick={handleSendMessage} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                        Send
                    </Button>
                </div>
            </div>
        </div>
    );
}

export default GeminiChatInterface;
