"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
function createStore(init) {
    const effects = new Set();
    function read() {
        return init;
    }
    function write(newState) {
        if (newState !== init) {
            const prev = init;
            init = newState;
            for (const effect of effects) {
                effect(init, prev);
            }
        }
    }
    function subscribe(effect) {
        effects.add(effect);
        return function unsubscribe() {
            effects.delete(effect);
        };
    }
    function useStore() {
        const [state, setState] = (0, react_1.useState)(init);
        (0, react_1.useEffect)(() => subscribe(nowState => setState(nowState)), []);
        function newSetState(action) {
            const newState = typeof action === "function" ? action(state) : action;
            write(newState);
        }
        return [state, newSetState];
    }
    useStore.getState = read;
    useStore.setState = write;
    useStore.subscribe = subscribe;
    return useStore;
}
exports.default = createStore;
//# sourceMappingURL=index.js.map