import { GerglState } from "./GerglState";
import styled from "@emotion/styled";
import React from 'react';


const Container = styled.div({
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    flexGrow: 1,
});

const Grid = styled.div({
    width:"350px",
    height:"420px",
});

const Row = styled.div((props: any) => ({
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    width:"100%"
}));

const Square = styled.div((props: {correctness?: string}) => {
    const background = props?.correctness === 'correct'
        ? 'green'
        : props?.correctness === 'wrongPlace'
        ? 'orange'
        : 'white';

    return {
        display: 'flex',
        background,
        alignItems: 'center',
        justifyContent: 'center',
        width: '62px',
        height: '62px',
        borderRadius: '2px',
        borderColor: 'black',
        borderStyle: 'solid',
        borderWidth: '1px',
        margin: '4px',
        fontSize: '2rem',
        fontWeight: 'bold',
        userSelect: 'none',
    };
});

export function Board({state}: {state: GerglState}) {
    return (
        <Container>
            <Grid>
                {[0,1,2,3,4,5].map((rowNum) => {
                    const guess = 
                        state.guesses.length > rowNum 
                            ? state.guesses[rowNum]
                            : rowNum === state.guesses.length 
                            ? state.currentGuess
                            : '';
                    return (<BoardRow guess={guess} secret={state.secret} key={`guess${rowNum}`} isFinal={rowNum < state.guesses.length} />);
                })}
            </Grid>
        </Container>
    );
}

function BoardRow({guess, secret, isFinal}: {guess: string, secret: string, isFinal: boolean}) {
    const scoredLetters = getScoredLetters(guess, secret, isFinal);
    return <Row>{[0,1,2,3,4].map(colNum => {
        const scoredLetter = scoredLetters[colNum]
        return <Square key={`square${colNum}`} correctness={scoredLetter?.correctness}>{scoredLetter?.letter ?? ''}</Square>
    })}</Row>
}

type ScoredLetter = {letter: string, correctness?: 'correct' | 'wrongPlace'};
function getScoredLetters(guess: string, secret: string, isFinal: boolean): ScoredLetter[] {
    const secretLetters = secret.split('') as (string | null)[];
    const guessLetters = guess.split('');
    return isFinal 
        ? guessLetters.map((gl, i) => {
            if (secretLetters[i] === gl) {
                secretLetters[i] = null;
                return {letter: gl, correctness: 'correct'};
            }
            const secretIndex = secretLetters.indexOf(gl);
            if (secretIndex !== -1) {
                secretLetters[secretIndex] = null;
                return {letter: gl, correctness: 'wrongPlace'};
            }
            return {letter: gl};
        }) 
        : guessLetters.map((gl: string) => ({letter: gl}));
}