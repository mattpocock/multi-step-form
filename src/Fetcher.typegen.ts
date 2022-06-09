// This file was automatically generated. Edits will be overwritten

export interface Typegen0 {
  "@@xstate/typegen": true;
  eventsCausingActions: {
    showErrorMessage: "error.platform.Fetcher.Fetching:invocation[0]";
    incrementErrorCount: "error.platform.Fetcher.Fetching:invocation[0]";
    resetErrorCount: "done.invoke.Fetcher.Fetching:invocation[0]";
    clearError: "done.invoke.Fetcher.Fetching:invocation[0]";
  };
  internalEvents: {
    "error.platform.Fetcher.Fetching:invocation[0]": {
      type: "error.platform.Fetcher.Fetching:invocation[0]";
      data: unknown;
    };
    "done.invoke.Fetcher.Fetching:invocation[0]": {
      type: "done.invoke.Fetcher.Fetching:invocation[0]";
      data: unknown;
      __tip: "See the XState TS docs to learn how to strongly type this.";
    };
    "xstate.after(RETRY_DELAY)#Fetcher.Waiting before retry": {
      type: "xstate.after(RETRY_DELAY)#Fetcher.Waiting before retry";
    };
    "xstate.init": { type: "xstate.init" };
  };
  invokeSrcNameMap: {
    makeFetch: "done.invoke.Fetcher.Fetching:invocation[0]";
  };
  missingImplementations: {
    actions:
      | "showErrorMessage"
      | "incrementErrorCount"
      | "resetErrorCount"
      | "clearError";
    services: "makeFetch";
    guards: never;
    delays: "RETRY_DELAY";
  };
  eventsCausingServices: {
    makeFetch:
      | "FETCH"
      | "xstate.after(RETRY_DELAY)#Fetcher.Waiting before retry";
  };
  eventsCausingGuards: {};
  eventsCausingDelays: {
    RETRY_DELAY: "xstate.init";
  };
  matchesStates: "Idle" | "Fetching" | "Waiting before retry" | "Timed out";
  tags: never;
}
