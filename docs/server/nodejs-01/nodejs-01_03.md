---
title: NodeJS 创建websocket服务器
date: 2020-08-05
---

# 1. websocket

```js
// @ts-nocheck
const websockets = require('ws');

const SERVER_PORT = 5188;
const MAX_RECONNECT_ATTEMPTS = 100;

const activeConnections = new Set();
let server = null;
let connection = null;
let reconnectAttempts = 0;
let reconnectTimer = null;

const handleWebsocket = async (websocket, path) => {
    try {
        activeConnections.add(websocket);
        connection = websocket;
        websocket.on('message', async (message) => {
            try {
                await broadcast(message);
            } catch (e) {
                console.log(e, '---------------error');
            }
        });
    } catch (error) {
        console.log(error);
    } finally {
        activeConnections.delete(websocket);
    }
};

const broadcast = async (data) => {
    for (const conn of activeConnections) {
        conn.send(data);
    }
};

const reconnect = async () => {
    if (reconnectAttempts < MAX_RECONNECT_ATTEMPTS) {
        if (connection) {
            connection.close();
            connection = null;
        }
        if (server) {
            server.close();
            server = null;
        }
        reconnectTimer = setTimeout(async () => {
            await createWebsocket();
        }, 1000);
        reconnectAttempts++;
    } else {
        console.log(`Exceeded maximum reconnection attempts (${MAX_RECONNECT_ATTEMPTS}).`);
        clearReconnectTimer();
    }
};

const clearReconnectTimer = () => {
    if (reconnectTimer) {
        clearTimeout(reconnectTimer);
        reconnectTimer = null;
    }
};

const resetReconnectAttempts = () => {
    reconnectAttempts = 0;
};

const createWebsocket = async () => {
    server = new websockets.Server({port: SERVER_PORT});
    server.on('connection', handleWebsocket);
};

export default createWebsocket;
```
