import styled from "@emotion/styled";
import { useGerglContext } from "./GerglState";
import React from 'react';


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

const KeyButton = styled.div({
  background: 'grey',
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
  fontSize: '11px'
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
  const label = getKeyLabel(props.value);;
  return (
    <KeyButton onClick={() => {
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
