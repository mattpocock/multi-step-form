// This file was automatically generated. Edits will be overwritten

export interface Typegen0 {
  "@@xstate/typegen": true;
  eventsCausingActions: {
    resetPaypalToken: "CHOOSE_CREDIT_CARD" | "BACK";
    resetCardDetails: "CHOOSE_PAYPAL";
  };
  internalEvents: {
    "xstate.init": { type: "xstate.init" };
  };
  invokeSrcNameMap: {};
  missingImplementations: {
    actions: "resetPaypalToken" | "resetCardDetails";
    services: never;
    guards: never;
    delays: never;
  };
  eventsCausingServices: {};
  eventsCausingGuards: {};
  eventsCausingDelays: {};
  matchesStates:
    | "choosing"
    | "enteringCardDetails"
    | "payingViaPaypal"
    | "confirming"
    | "confirming.paypal"
    | "confirming.creditCard"
    | { confirming?: "paypal" | "creditCard" };
  tags: never;
}
