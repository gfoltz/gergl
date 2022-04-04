import React, { useContext, useState } from "react"
import moment from "moment-timezone";
import hs from "hash-sum";
import { SecretWordsReverse, AllWordsReverse } from './Dictionary';

export type GerglState = PersistedGerglState & {
  secret: string,
  toast: string | null,
}

type PersistedGerglState = {
  guesses: string[],
  currentGuess: string,
}

type SetStateFn = React.Dispatch<React.SetStateAction<GerglState>>;

export interface GerglStateMachine {
  readonly state: GerglState;

  readonly mutations: {
    addLetter(state: GerglState, letter: string): GerglState;
    removeLetter(state: GerglState): GerglState;
    makeGuess(state: GerglState): GerglState;
  }

  readonly selectors: {
    isGameComplete(state: GerglState): boolean;
  };
}

export function newGerglState(): GerglState {
  return {
    secret: getSecretWord(),
    toast: null,
    ...loadPersistedState(),
  }
}

export function useGerglStateMachine(): GerglStateMachine {
  const [state, setState] = useState<GerglState>(newGerglState)
  return newGerglStateMachine(state, setState);
}

function getSecretWord() {
  const todaysNumber = Number(`0x${hs(moment().startOf('day').format('YYYY-MM-DD'))}`)
  const todaysWord = SecretWordsReverse[todaysNumber % SecretWordsReverse.length];
  console.log(`Todays Word: ${todaysWord}`);
  return todaysWord.toLocaleUpperCase();
}

function newGerglStateMachine(state: GerglState, setState: SetStateFn) {
  return {
    state,
    mutations: {
      addLetter: addLetterMutation(setState),
      removeLetter: removeLetterMutation(setState),
      makeGuess: makeGuessMutation(setState),
      setToast: makeSetToastMutation(setState),
    },
    selectors: {
      isGameComplete,
    }
  }
}

function makeSetToastMutation(setState: setStateFn) {
  return (state: GerglState, toast: string | null): GerglState => {
    return mutation(setState, () => ({
      ...state,
      toast,
    }));
  }
}

function addLetterMutation(setState: SetStateFn) {
  return (state: GerglState, letter: string): GerglState => {
    return mutation(setState, () => {
      if (state.currentGuess.length >= 5 || isGameComplete(state)) {
        return state;
      }
      return {
        ...state,
        currentGuess: state.currentGuess + letter,
      }
    });
  };
}

function removeLetterMutation(setState: SetStateFn) {
  return (state: GerglState): GerglState => {
    return mutation(setState, () => {
      if (state.currentGuess.length <= 0 || isGameComplete(state)) {
        return state;
      }
      return {
        ...state,
        currentGuess: state.currentGuess.slice(0, -1),
      }
    });
  };
}

function makeGuessMutation(setState: SetStateFn) {
  return (state: GerglState): GerglState => {
    return mutation(setState, () => {
      if (state.currentGuess.length !== 5 || isGameComplete(state)) {
        return state;
      }
      if (AllWordsReverse.indexOf(state.currentGuess.toLocaleLowerCase()) === -1) {
        return {...state, toast: 'Not in word list'};
      }
      return {
        ...state,
        guesses: [...state.guesses, state.currentGuess],
        currentGuess: '',
      }
    });
  };
}

function isGameComplete(state: GerglState) {
  return (state.guesses.length !== 0 && (state.guesses[state.guesses.length - 1] === state.secret))
    || (state.guesses.length >= 6);
}

function mutation(setState: SetStateFn, mutator: () => GerglState) {
  const newState = mutator();
  setState(newState);
  persistState(newState);
  return newState;
}

export const GerglStateContext = React.createContext<
  GerglStateMachine
>(newGerglStateMachine(newGerglState(), (value: any) => { }));

export function useGerglContext() {
  return useContext(GerglStateContext);
}

function persistState(state: PersistedGerglState) {
  localStorage.setItem(localStorageKey(), JSON.stringify({...state}));
}

function loadPersistedState(): PersistedGerglState {
  return JSON.parse(localStorage.getItem(localStorageKey()))
}

function localStorageKey() {
  return `game:${moment().startOf('day').format('YYYY-MM-DD')}`;
}