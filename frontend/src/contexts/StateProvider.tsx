import React, { useReducer, ReactNode } from 'react';
import { StateContext } from './state';

type State = {
  [key: string]: unknown;
};

type Action = {
  type: string;
  payload?: unknown;
};

const initialState: State = {
  // Initialize your state here
};

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    // Add your actions here
    default:
      return state;
  }
};

interface StateProviderProps {
  children: ReactNode;
}

export const StateProvider: React.FC<StateProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <StateContext.Provider value={{ state, dispatch }}>
      {children}
    </StateContext.Provider>
  );
};