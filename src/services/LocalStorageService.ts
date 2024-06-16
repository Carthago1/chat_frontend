interface ILocalStorageService {
    get(key: string): string | null;
    set(key: string, value: string): void;
    remove(key:string): void;
}

const localStorageService: ILocalStorageService = {
    get(key) {
        return localStorage.getItem(key);
    },
    set(key, value) {
        localStorage.setItem(key, value);
    },
    remove(key) {
        localStorage.removeItem(key);
    }
}

export default localStorageService;
