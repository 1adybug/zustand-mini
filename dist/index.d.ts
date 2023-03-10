import { SetStateAction } from "react";
type Effect<T> = (state: T, prev: T) => void;
interface UseStore<T> {
    (): [T, (action: SetStateAction<T>) => void];
    getState(): T;
    setState(newState: T): void;
    subscribe(effect: Effect<T>): () => void;
}
export default function createStore<T>(init: T): UseStore<T>;
export {};
