//import test from 'ava';
const test = require('ava');
//import { SocketIO, Server } from 'mock-socket';
const { SocketIO, Server }  = require('mock-socket');
 
class ChatApp {
  constructor(url) {
    this.messages = [];
    this.connection = new io(url);
 
    this.connection.on('chat-message', data => {
      this.messages.push(event.data);
    });
  }
 
  sendMessage(message) {
    this.connection.emit('chat-message', message);
  }
}
 
test.cb('that socket.io works', t => {
  const fakeURL = 'ws://localhost:8080';
  const mockServer = new Server(fakeURL);
 
  window.io = SocketIO;
 
  mockServer.on('connection', socket => {
    socket.on('chat-message', data => {
      t.is(data, 'test message from app', 'we have intercepted the message and can assert on it');
      socket.emit('chat-message', 'test message from mock server');
    });
  });
 
  const app = new ChatApp(fakeURL);
  app.sendMessage('test message from app');
 
  setTimeout(() => {
    t.is(app.messages.length, 1);
    t.is(app.messages[0], 'test message from mock server', 'we have subbed our websocket backend');
 
    mockServer.stop(t.done);
  }, 100);
});