import React, { useEffect } from 'react';
import styled from "@emotion/styled";
import { useGerglContext } from './GerglState';

const Container = styled.div({
  fontSize: "27px",
  position: "absolute",
  top: "60px",
  background: "white",
  color: "black",
  borderRadius: "10px",
  borderWidth: "1px",
  borderColor: "black",
  borderStyle: "solid",
  paddingLeft: "25px",
  paddingRight: "25px",
  paddingTop: "10px",
  paddingBottom: "10px",
});
export function Toast() {
  const { mutations, state } = useGerglContext();
  if (state.toast == null) {
    return null;
  }
  useEffect(() => {
    setTimeout(() => mutations.setToast(state, null), 1000)
  }, [mutations])
  return (<Container>{state.toast}</Container>);
}