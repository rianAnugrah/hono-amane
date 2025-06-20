import { Hono } from 'hono';
import { wsConnections } from '../websocket';

const websocketRoutes = new Hono();

// REST API endpoint to trigger real-time updates
websocketRoutes.post('/broadcast', async (c) => {
  const data = await c.req.json();
  const message = JSON.stringify({
    type: 'broadcast',
    data: data,
    timestamp: new Date().toISOString()
  });
  wsConnections.forEach(ws => {
    if (ws.readyState === 1) {
      try {
        ws.send(message);
      } catch (error) {
        console.error('Error sending message to WebSocket:', error);
        wsConnections.delete(ws);
      }
    } else {
      wsConnections.delete(ws);
    }
  });
  return c.json({
    success: true,
    message: 'Message broadcasted to all connected clients',
    connectedClients: wsConnections.size
  });
});

// Sample real-time data generator endpoint
websocketRoutes.get('/sample/start-feed', async (c) => {
  const interval = setInterval(() => {
    const sampleData = {
      type: 'sample_data',
      data: {
        id: Math.random().toString(36).substr(2, 9),
        temperature: (Math.random() * 50 + 10).toFixed(2),
        humidity: (Math.random() * 100).toFixed(2),
        pressure: (Math.random() * 50 + 950).toFixed(2),
        location: {
          lat: -6.2 + (Math.random() - 0.5) * 0.1,
          lng: 106.8 + (Math.random() - 0.5) * 0.1
        },
        status: Math.random() > 0.8 ? 'alert' : 'normal'
      },
      timestamp: new Date().toISOString()
    };
    const message = JSON.stringify(sampleData);
    wsConnections.forEach(ws => {
      if (ws.readyState === 1) {
        try {
          ws.send(message);
        } catch (error) {
          console.error('Error sending sample data:', error);
          wsConnections.delete(ws);
        }
      } else {
        wsConnections.delete(ws);
      }
    });
    if (Date.now() % 60000 < 2000) {
      clearInterval(interval);
    }
  }, 2000);
  return c.json({
    success: true,
    message: 'Sample data feed started',
    connectedClients: wsConnections.size
  });
});

// Get WebSocket connection status
websocketRoutes.get('/ws/status', async (c) => {
  return c.json({
    connectedClients: wsConnections.size,
    status: 'running'
  });
});

export default websocketRoutes; 