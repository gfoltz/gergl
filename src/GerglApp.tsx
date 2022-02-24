import React from 'react';
import styled from '@emotion/styled'
import './App.css';
import { GerglStateContext, useGerglStateMachine } from './GerglState';
import { Keyboard } from './Keyboard';
import { Board } from './Board';
import KeyboardEventHandler from 'react-keyboard-event-handler';

const Container = styled.div((props: any) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  width: "100%",
  height: "calc(100% - 50px)",
}));

const PageHeader = styled.div({
  fontSize: "37px",
  fontWeight: 700,
  textAlign: "center",
  borderBottomStyle: "solid",
  borderBottomColor: 'lightgrey',
  paddingLeft: "16px",
  paddingRight: "16px",
  height: '50px',
});

export function GerglApp(props: any) {
  const stateMachine = useGerglStateMachine();
  const { state, mutations } = stateMachine;

  return (
    <GerglStateContext.Provider value={stateMachine}>
      <KeyboardEventHandler
        handleKeys={['alphabetic', 'backspace', 'enter']}
        onKeyEvent={(key: string) => {
          if (key === 'enter') {
            mutations.makeGuess(state);
          } else if (key === 'backspace') {
            mutations.removeLetter(state);
          } else {
            mutations.addLetter(state, key.toLocaleUpperCase());
          }
        }} />

      <PageHeader>
        GERGL
      </PageHeader>
      <Container>
        <Board state={state} />
        <Keyboard />
      </Container>
    </GerglStateContext.Provider>
  );
}
