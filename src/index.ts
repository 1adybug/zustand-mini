import { SetStateAction, useEffect, useState } from "react"

type Effect<T> = (state: T, prev: T) => void

interface UseStore<T> {
    (): [T, (action: SetStateAction<T>) => void]
    getState(): T
    setState(newState: T): void
    subscribe(effect: Effect<T>): () => void
}

export default function createStore<T>(init: T): UseStore<T> {
    const effects = new Set<Effect<T>>()

    function read() {
        return init
    }

    function write(newState: T) {
        if (newState !== init) {
            const prev = init
            init = newState
            for (const effect of effects) {
                effect(init, prev)
            }
        }
    }

    function subscribe(effect: Effect<T>) {
        effects.add(effect)
        return function unsubscribe() {
            effects.delete(effect)
        }
    }

    function useStore(): [T, (action: SetStateAction<T>) => void] {
        const [state, setState] = useState(init)

        useEffect(() => subscribe(nowState => setState(nowState)), [])

        function newSetState(action: SetStateAction<T>) {
            const newState = typeof action === "function" ? (action as (prev: T) => T)(state) : action
            write(newState)
        }

        return [state, newSetState]
    }

    useStore.getState = read

    useStore.setState = write

    useStore.subscribe = subscribe

    return useStore
}
