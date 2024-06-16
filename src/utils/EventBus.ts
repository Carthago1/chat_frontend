type EventHandler = (data?: any) => void;

class EventBus {
    private listeners: Map<string, EventHandler[]>;

    constructor() {
        this.listeners = new Map();
    }

    public subscribe(event: string, handler: EventHandler): void {
        if (!this.listeners.has(event)) {
            this.listeners.set(event, []);
        }

        this.listeners.get(event)!.push(handler);
    }

    public unsubcribe(event: string, handler: EventHandler): void {
        if (this.listeners.has(event)) {
            const handlers = this.listeners.get(event);
            const index = handlers!.indexOf(handler);
            if (index !== -1) {
                handlers?.splice(index, 1);
            }
        }
    }

    public emit(event: string, data?: any): void {
        if (this.listeners.has(event)) {
            this.listeners.get(event)!.forEach(handler => handler(data));
        }
    }
}

export default new EventBus();
