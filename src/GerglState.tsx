import React, { useContext, useState } from "react"

export type GerglState = {
    secret: string,
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
        secret: "GERGL",
        guesses: [],
        currentGuess: '',
    }
}

export function useGerglStateMachine(): GerglStateMachine {
    const [state, setState] = useState<GerglState>(newGerglState)
    return newGerglStateMachine(state, setState);
}

function newGerglStateMachine(state: GerglState, setState: SetStateFn) {
    return {
        state,
        mutations: {
            addLetter: addLetterMutation(setState),
            removeLetter: removeLetterMutation(setState),
            makeGuess: makeGuessMutation(setState),
        },
        selectors: {
            isGameComplete,
        }
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
        || (state.guesses.length >= 6 );
}

function mutation(setState: SetStateFn, mutator: () => GerglState) {
    const newState = mutator();
    setState(newState);
    return newState;
}

export const GerglStateContext = React.createContext<
  GerglStateMachine
>(newGerglStateMachine(newGerglState(), (value: any) => {}));

export function useGerglContext() {
    return useContext(GerglStateContext);
}