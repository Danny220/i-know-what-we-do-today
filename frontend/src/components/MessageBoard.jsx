import React, { useEffect, useRef, useState } from "react";
import useMessageStore from "../stores/messageStore.js";
import toast from "react-hot-toast";
import Card from "./ui/Card.jsx";
import H2 from "./ui/H2.jsx";
import MessageBoardSkeleton from "./skeletons/MessageBoardSkeleton.jsx";
import Input from "./ui/Input.jsx";
import Button from "./ui/Button.jsx";

function MessageBoard({ groupId }) {
  const { messages, isLoading, fetchMessages, postMessage } = useMessageStore();
  const [content, setContent] = useState("");
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "nearest",
    });
  };

  useEffect(() => {
    fetchMessages(groupId).then();
    const interval = setInterval(() => {
      fetchMessages(groupId).then();
    }, 10_000); // 10 sec

    return () => clearInterval(interval);
  }, [groupId, fetchMessages]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim()) return;
    try {
      await postMessage(groupId, content);
      setContent("");
    } catch {
      toast.error("Failed to post message");
    }
  };

  const renderMessages = () => {
    if (isLoading) {
      return (
        <>
          <MessageBoardSkeleton />
          <MessageBoardSkeleton />
          <MessageBoardSkeleton />
        </>
      );
    } else {
      return (
        <>
          {messages.map((msg) => (
            <div key={msg.id} className="flex items-start gap-3">
              <img
                src={
                  msg.avatar_url ||
                  `https://ui-avatars.com/api/?name=${msg.username}&background=random`
                }
                alt={msg.username}
                className="w-10 h-10 rounded-full bg-gray-600"
              />
              <div>
                <span className="font-bold text-white text-sm">
                  {msg.username}
                </span>
                <span className="text-xs text-gray-400 ml-2">
                  {new Date(msg.created_at).toLocaleTimeString()}
                </span>
                <p className="text-gray-200">{msg.content}</p>
              </div>
            </div>
          ))}
        </>
      );
    }
  };

  return (
    <Card className="mt-8">
      <H2 className="mb-4">Message Board</H2>

      <div className="h-96 overflow-y-auto bg-gray-700 rounded-lg p-4 space-y-4 mb-4">
        {renderMessages()}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSubmit} className="flex gap-2">
        <Input
          type="text"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Type your message..."
          className="flex-1"
        />
        <Button type="submit" className="w-auto">
          Send
        </Button>
      </form>
    </Card>
  );
}

export default MessageBoard;
