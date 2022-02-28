import styled from "@emotion/styled";
import { useGerglContext, GerglState } from "./GerglState";
import React from 'react';
import { Color } from './Color';

const Container = styled.div((props: any) => ({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  width: "100%",
  height: '200px',
}));

const Row = styled.div((props: any) => ({
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'center',
  width: "100%"
}));

const KeyButton = styled.div((props) => {
  return {
    background: 
      props.color,
    borderRadius: '3px',
    display: 'flex',
    justifyContent: 'center',
    minWidth: '20px',
    height: '54px',
    color: 'white',
    alignItems: 'center',
    fontWeight: 'bolder',
    paddingLeft: '6px',
    paddingRight: '6px',
    margin: '2px',
    fontSize: '11px',
  }
});

export function Keyboard() {
  return (
    <Container>
      <Row key='firstKeyboardRow'>{'QWERTYUIOP'.split('').map((c) => <Key value={c} key={`key${c}`} />)}</Row>
      <Row key='secondKeyboardRow'>{'ASDFGHJKL'.split('').map((c) => <Key value={c} key={`key${c}`} />)}</Row>
      <Row key='thirdKeyboardRow'>{'\nZXCVBNM\b'.split('').map((c) => <Key value={c} key={`key${c}`} />)}</Row>
    </Container>
  );
}

function Key(props: { value: string }) {
  const { mutations, state } = useGerglContext();
  const label = getKeyLabel(props.value);
  const color = getLetterColor(props.value, state);
  return (
    <KeyButton color={color} onClick={() => {
      if (props.value === '\n') {
        mutations.makeGuess(state);
      } else if (props.value === '\b') {
        mutations.removeLetter(state);
      } else {
        mutations.addLetter(state, props.value);
      }
    }}>
      {label}
    </KeyButton>);
}

function getKeyLabel(value: string) {
  return value === '\n' ? 'ENTER' : value === '\b' ? 'DEL' : value;
}

function getLetterColor(value: string, state: GerglState): string {
    const guessesWithLetter = state.guesses.filter(guess => guess.indexOf(value) !== -1);
  if (guessesWithLetter.length === 0) {
    return Color.unknown;
  }
  if (state.secret.indexOf(value) === -1) {
    return Color.notPresent;
  }

  return guessesWithLetter.reduce((color, guess) => {
    if (color === Color.correct) {
      return Color.correct;
    }
    return guess.split('').some((c,i) => c === value && state.secret[i] === value) 
      ? Color.correct 
      : Color.present;
  }, Color.present);
}