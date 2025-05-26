'use client';

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { MessageCircle, X } from 'lucide-react';

async function agentChat(query: string, history: {role: string, content: string}[]) {
  const res = await fetch('/api/agent-chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query, history }),
  });
  if (!res.ok) {
    return 'Sorry, there was an error contacting the agent.';
  }
  const data = await res.json();
  return data.reply || 'Sorry, I could not generate a response.';
}

export default function AgentChatWidget() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState<{role: string, content: string}[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [history, open]);

  const sendMessage = async () => {
    if (!input.trim()) return;
    const userMsg = { role: 'user', content: input };
    setHistory((h) => [...h, userMsg]);
    setInput('');
    setLoading(true);
    const agentReply = await agentChat(input, [...history, userMsg]);
    setHistory((h) => [...h, { role: 'agent', content: agentReply }]);
    setLoading(false);
  };

  return (
    <div>
      {/* Floating Chat Button */}
      {!open && (
        <Button
          onClick={() => setOpen(true)}
          className="fixed bottom-6 right-6 z-50 rounded-full shadow-lg p-4 bg-primary text-white hover:bg-primary/90"
        >
          <MessageCircle className="h-6 w-6" />
        </Button>
      )}
      {/* Chat Widget */}
      {open && (
        <div className="fixed bottom-6 right-6 z-50 w-96 max-w-full bg-white border rounded-lg shadow-xl flex flex-col">
          <div className="flex items-center justify-between p-3 border-b bg-primary text-white rounded-t-lg">
            <span className="font-semibold">Auro Admin Agent</span>
            <Button size="icon" variant="ghost" onClick={() => setOpen(false)}>
              <X className="h-5 w-5" />
            </Button>
          </div>
          <div className="flex-1 overflow-y-auto p-3 space-y-2" style={{ maxHeight: 350 }}>
            {history.length === 0 && (
              <div className="text-muted-foreground text-sm">How can I help you? Try commands like:<br/>- Add a new laundromat<br/>- Show all offline machines<br/>- Generate a report</div>
            )}
            {history.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`rounded px-3 py-2 max-w-[80%] text-sm ${msg.role === 'user' ? 'bg-primary text-white' : 'bg-gray-100 text-gray-900'}`}>
                  {msg.content}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
          <form
            className="flex border-t p-2 gap-2"
            onSubmit={e => {
              e.preventDefault();
              sendMessage();
            }}
          >
            <Input
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder="Type a command or question..."
              disabled={loading}
              className="flex-1"
            />
            <Button type="submit" disabled={loading || !input.trim()}>
              Send
            </Button>
          </form>
        </div>
      )}
    </div>
  );
} 