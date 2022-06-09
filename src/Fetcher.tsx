import { useMachine } from "@xstate/react";
import { useCallback, useState } from "react";
import { createMachine } from "xstate";
import { Button } from "./Button";

const machine =
  /** @xstate-layout N4IgpgJg5mDOIC5QDEwBcDGALMAnAdAJIQA2YAxMgKIAqAwgBKKgAOA9rAJZqdsB2zEAA9EAWgBMARgCc+AGwBmSQoCsABgDsalQBYAHCrkAaEAE8xkyXvySdS6eLm2NOnSoC+7k6kw4CP7E4+KHIIfjB8IIA3NgBrCIC-fESgqARotgwAQx5+AG01AF1Bdi5cgSRhMTdJfBVxevEFaRkdcQbjM0QFcTq5NVdFcTU1PQ1JcR1Pb3RsPGTZrFTyPFw2AhYSHIAzdYBbBd95lOD0vhjs8oLiytLuXgrQEQRJEbq1SRUlfrHpFpNzAgFNZpBoXP05K4ZF9pNMQIljotlkJYGgchEsts0HgABTqNQASkoi0RvlSJQ4934gmeohk1ikajkcj0OmZCjUfxUAMQ7Tk+Ha40MX20OlhXnhJIIAHUsvdggACABGYF2uDACvVaFwpnIKLR2PwmOxuBxACVaGaAJoAfQAIlQADIAQStRIRMrlPEVKrVGq1OopZQeNIsPQFrw54g0CkUo25XQQojG+GksbkUh+Az0Y08Er4bAgcEEHqIpDAQapjyqSf0OnweharzkKnxrU6gLpLJsShjbX6jI04jhpZOUEr5VDSaaKnwaiUdmkzL0MikPIQOjUqZUDjFcmk+mjHxHUvwsvlUGVqvW-vQgdulMnlWerIb+7BCjsQ4z69EB-wrg9CyWgDAoCgaCeRwEDQnB7JACpsAArmgE4hs+YgqMoqY9DGwLaHoYEKOuUiyEOAwOJILKfuIrKQXMuCodS6FJl8GjYdGYF6PhhG-pMtSWCu85-GMsbKHm7hAA */
  createMachine({
    tsTypes: {} as import("./Fetcher.typegen").Typegen0,
    schema: {
      services: {
        makeFetch: {
          data: {} as any,
        },
      },
    },
    id: "Fetcher",
    initial: "Idle",
    states: {
      Idle: {
        entry: ["resetErrorCount", "clearError"],
        on: {
          FETCH: {
            target: "Fetching",
          },
        },
      },
      Fetching: {
        invoke: {
          src: "makeFetch",
          onDone: [
            {
              target: "Idle",
            },
          ],
          onError: [
            {
              actions: ["showErrorMessage", "incrementErrorCount"],
              target: "Waiting before retry",
            },
          ],
        },
        after: {
          "500": {
            target: "Timed out",
          },
        },
      },
      "Waiting before retry": {
        after: {
          RETRY_DELAY: {
            target: "Fetching",
          },
        },
      },
      "Timed out": {},
    },
  });

export const Fetcher = () => {
  const [data, setData] = useState();
  const [errorMessage, setErrorMessage] = useState("");
  const [errorCount, setErrorCount] = useState(0);

  const [state, send] = useMachine(machine, {
    services: {
      makeFetch: async () => {
        setData(undefined);
        const response = await fetch("https://swapi.dev/api/people/1/");
        const info = await response.json();
        setData(info);
      },
    },
    actions: {
      clearError: () => {
        setErrorMessage("");
      },
      incrementErrorCount: () => {
        setErrorCount(errorCount + 1);
      },
      resetErrorCount: () => {
        setErrorCount(0);
      },
      showErrorMessage: () => {
        setErrorMessage("Something went wrong");
      },
    },
    delays: {
      RETRY_DELAY: () => {
        const exponent = errorCount ** 2;
        return exponent * 200;
      },
    },
  });

  return (
    <div>
      <Button
        onClick={() => {
          send("FETCH");
        }}
      >
        Fetch
      </Button>
      {errorMessage && <div>{errorMessage}</div>}
      {data && <pre>{JSON.stringify(data, null, 2)}</pre>}
    </div>
  );
};
