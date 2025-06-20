import { WebSocketServer, WebSocket } from 'ws';

export const wsConnections = new Set<WebSocket>();

export function initWebSocketServer(server: import('http').Server) {
  const wss = new WebSocketServer({ 
    server: server,
    path: '/ws/sample'
  });

  wss.on('connection', (ws, request) => {
    console.log('WebSocket connection opened');
    wsConnections.add(ws);
    
    // Send initial connection message
    ws.send(JSON.stringify({
      type: 'connection',
      message: 'Connected to real-time sample feed',
      timestamp: new Date().toISOString()
    }));
    
    ws.on('message', (data) => {
      console.log('Message received:', data.toString());
      try {
        const parsedData = JSON.parse(data.toString());
        switch (parsedData.type) {
          case 'ping':
            ws.send(JSON.stringify({
              type: 'pong',
              timestamp: new Date().toISOString()
            }));
            break;
          case 'subscribe':
            ws.send(JSON.stringify({
              type: 'subscribed',
              feed: parsedData.feed,
              message: `Subscribed to ${parsedData.feed}`,
              timestamp: new Date().toISOString()
            }));
            break;
          default:
            ws.send(JSON.stringify({
              type: 'echo',
              data: parsedData,
              timestamp: new Date().toISOString()
            }));
        }
      } catch (error) {
        ws.send(JSON.stringify({
          type: 'error',
          message: 'Invalid JSON format',
          timestamp: new Date().toISOString()
        }));
      }
    });
    ws.on('close', () => {
      console.log('WebSocket connection closed');
      wsConnections.delete(ws);
    });
    ws.on('error', (error) => {
      console.error('WebSocket error:', error);
      wsConnections.delete(ws);
    });
  });
} 