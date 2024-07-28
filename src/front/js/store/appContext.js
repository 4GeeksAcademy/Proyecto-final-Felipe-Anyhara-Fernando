import React, { createContext, useReducer } from "react";
import getState from "./flux";

export const Context = createContext(null);

const injectContext = PassedComponent => {
    const StoreWrapper = (props) => {
        const initialState = getState({
            getStore: () => store,
            getActions: () => actions,
            setStore: updatedStore => setStore(Object.assign(store, updatedStore))
        });

        const [store, setStore] = useReducer(
            (state, action) => ({ ...state, ...action }),
            initialState.store
        );
        const actions = initialState.actions;

        return (
            <Context.Provider value={{ store, actions }}>
                <PassedComponent {...props} />
            </Context.Provider>
        );
    };
    return StoreWrapper;
};

export default injectContext;