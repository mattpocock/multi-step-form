// This file was automatically generated. Edits will be overwritten

export interface Typegen0 {
  "@@xstate/typegen": true;
  eventsCausingActions: {};
  internalEvents: {
    "xstate.init": { type: "xstate.init" };
  };
  invokeSrcNameMap: {
    makeFetch: "done.invoke.Fetcher.Fetching:invocation[0]";
  };
  missingImplementations: {
    actions: never;
    services: "makeFetch";
    guards: never;
    delays: never;
  };
  eventsCausingServices: {
    makeFetch: "FETCH";
  };
  eventsCausingGuards: {};
  eventsCausingDelays: {};
  matchesStates: "Idle" | "Fetching";
  tags: never;
}
