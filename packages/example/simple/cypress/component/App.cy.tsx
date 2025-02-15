import { HookProvider } from "@hookland/inject";
import React from "react";
import App from "../../src/App";
import { randomNumbersMock } from "../../src/__mocks__/useRandomNumbersMock";

function MockedApp() {
  return <HookProvider
    hooks={
      [randomNumbersMock]
    }>
    <App />
  </HookProvider>;
}

describe('App.cy.tsx', () => {
  it('playground', () => {
    cy.mount(<MockedApp />)
  })
})