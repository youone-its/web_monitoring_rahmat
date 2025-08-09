import { useEffect, useRef, useState } from "react";

interface UseWebSocketReturn {
  lastMessage: MessageEvent | null;
  readyState: number;
  sendMessage: (message: string) => void;
}

export function useWebSocket(): UseWebSocketReturn {
  const [lastMessage, setLastMessage] = useState<MessageEvent | null>(null);
  const [readyState, setReadyState] = useState<number>(WebSocket.CONNECTING);
  const ws = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout>();

  const connect = () => {
    try {
      const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
      const wsUrl = `${protocol}//${window.location.host}/ws`;
      
      ws.current = new WebSocket(wsUrl);

      ws.current.onopen = () => {
        console.log("WebSocket connected");
        setReadyState(WebSocket.OPEN);
      };

      ws.current.onmessage = (event) => {
        setLastMessage(event);
      };

      ws.current.onclose = () => {
        console.log("WebSocket disconnected");
        setReadyState(WebSocket.CLOSED);
        
        // Reconnect after 3 seconds
        reconnectTimeoutRef.current = setTimeout(() => {
          console.log("Attempting to reconnect...");
          connect();
        }, 3000);
      };

      ws.current.onerror = (error) => {
        console.error("WebSocket error:", error);
        setReadyState(WebSocket.CLOSED);
      };

      setReadyState(WebSocket.CONNECTING);
    } catch (error) {
      console.error("Failed to create WebSocket connection:", error);
      setReadyState(WebSocket.CLOSED);
    }
  };

  useEffect(() => {
    connect();

    return () => {
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
      if (ws.current) {
        ws.current.close();
      }
    };
  }, []);

  const sendMessage = (message: string) => {
    if (ws.current && ws.current.readyState === WebSocket.OPEN) {
      ws.current.send(message);
    } else {
      console.warn("WebSocket is not connected. Unable to send message:", message);
    }
  };

  return {
    lastMessage,
    readyState,
    sendMessage,
  };
}
