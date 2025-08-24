import { createContext, Dispatch } from 'react';

type State = {
  [key: string]: unknown;
};

type Action = {
  type: string;
  payload?: unknown;
};

export const StateContext = createContext<{
  state: State;
  dispatch: Dispatch<Action>;
} | undefined>(undefined);