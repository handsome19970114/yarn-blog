---
title: python创建websocket服务,分发消息
date: 2020-03-29 11:00:00
tags: 'python'
categories:
    - ['开发', 'python']
permalink: python-websocket-server
---

# python 实现 websocket 服务

## 代码

```python
# 此文件夹的主要作用是启动一个5188的websocket进行控制弹窗的显隐

import asyncio
import websockets

SERVER_PORT = 5188
MAX_RECONNECT_ATTEMPTS = 100

active_connections = set()  # Set to store active connections
server = None  # WebSocket server instance
connection = None  # Current WebSocket connection
reconnect_attempts = 0  # Reconnect attempts counter
reconnect_timer = None  # Reconnect timer


async def handle_websocket(websocket, path):
    global connection, reconnect_attempts

    try:
        active_connections.add(websocket)  # Add the new connection to the set
        connection = websocket  # Store the current connection
        async for message in websocket:
            try:
                await broadcast(message)
            except Exception as e:
                print(e, "---------------error")

    except websockets.exceptions.ConnectionClosed:
        print(f"WebSocket closed. Reconnecting...")
        # Perform reconnect logic here
        await broadcast("close")
        reconnect()

    except Exception as e:
        print(e)

    finally:
        active_connections.remove(websocket)  # Remove the connection when closed


async def broadcast(data):
    global active_connections
    for conn in active_connections:
        await conn.send(data)


async def reconnect():
    global connection, server, reconnect_attempts, reconnect_timer

    if reconnect_attempts < MAX_RECONNECT_ATTEMPTS:
        # Perform cleanup of previous connection and server
        if connection:
            await connection.close()
            connection = None

        if server:
            server.close()
            server = None

        # Set the reconnect timer
        reconnect_timer = asyncio.get_event_loop().call_later(
            1,  # 1 second delay for the reconnection attempt
            lambda: asyncio.ensure_future(create_websocket()),
        )
        reconnect_attempts += 1

    else:
        print(f"Exceeded maximum reconnection attempts ({MAX_RECONNECT_ATTEMPTS}).")
        clear_reconnect_timer()


def clear_reconnect_timer():
    global reconnect_timer
    if reconnect_timer:
        reconnect_timer.cancel()
        reconnect_timer = None


def reset_reconnect_attempts():
    global reconnect_attempts
    reconnect_attempts = 0


async def create_websocket():
    global server
    server = await websockets.serve(handle_websocket, "localhost", SERVER_PORT)


if __name__ == "__main__":
    # Start the WebSocket connection
    asyncio.get_event_loop().run_until_complete(create_websocket())
    asyncio.get_event_loop().run_forever()

```
