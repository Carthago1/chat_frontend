import { io, Socket } from 'socket.io-client';
import eventBus from '@/utils/EventBus';
import { BASE_URL } from '@/utils/constants/baseURL';

class WebSocket {
    private static instance: WebSocket;
    private io: Socket | null = null;

    private constructor() {}

    public static getInstance(): WebSocket {
        if (!WebSocket.instance) {
            WebSocket.instance = new WebSocket();
        }

        return WebSocket.instance;
    }

    public setup(userId: number): void {
        if (this.io) {
            return;
        }

        this.io = io(BASE_URL, {
            transports: ['websocket'],
            query: { userId }
        });

        this.io.on('connect', () => {
            console.log('WS connect');
        });

        this.io.on('newMessage', (message) => {
            eventBus.emit('newMessage', message);
        });
    }
}

export default WebSocket.getInstance();
