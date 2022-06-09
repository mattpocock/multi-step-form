import { useMachine } from "@xstate/react";
import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom/client";
import { useForm } from "react-hook-form";
import { createMachine } from "xstate";
import { Button } from "./Button";
import "./index.css";

const machine =
  /** @xstate-layout N4IgpgJg5mDOIC5QDEwBcDGALMAnAdAJIQA2YAxMgKIAqAwgBKKgAOA9rAJZqdsB2zEAA9EAWgCc4-AHYArAAZxADgCMAFgDM0leM1KANCACeY9QCZ8ugGzarWpbKtWzAXxeHUmHAU-ZOfKHIIfjB8fwA3NgBrUN9vfDj-KAQItgwAQx5+AG15AF1Bdi4sgSRhMS01fDMlRXU1FTNleQNjRGkZR3EzM1lHMytZNRa3dxA+Ngg4QTi8IlIwQo5uXlLQEQRRDTVZfCVpK115bTVe8WlDE031KR2NDVqNFSVJNQO3D3RsOcSApeLVoINqIVLIOtJ9oorGpBk4ampLmIzFUzFo+vtJM4zPJeh8QLNcP8VvwgRVlNVauJ6o1mq0rqIehZNOctFZFL0BhpRi4gA */
  createMachine({
    tsTypes: {} as import("./CardForm.typegen").Typegen0,
    schema: {
      events: {} as
        | {
            type: "BACK";
          }
        | {
            type: "CHOOSE_PAYPAL";
          }
        | {
            type: "CHOOSE_CREDIT_CARD";
          }
        | {
            type: "SUBMIT";
          },
    },
    id: "Fetcher",
    initial: "Idle",
    states: {
      Idle: {
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
        },
      },
    },
  });

export function CardForm() {
  const [cardDetails, setCardDetails] = useState<PaymentFormDetails>();
  const [paypalToken, setPaypalToken] = useState<string>();

  const [state, send] = useMachine(machine, {
    actions: {
      resetCardDetails: () => {
        setCardDetails(undefined);
      },
      resetPaypalToken: () => {
        setPaypalToken(undefined);
      },
    },
  });

  const onBack = () => {
    send("BACK");
  };

  return (
    <div>
      {state.matches("choosing") && (
        <div>
          <h1 className="mb-4 text-xl font-medium tracking-tight text-gray-800">
            Choose your payment method
          </h1>
          <div className="space-x-2">
            <Button
              onClick={() => {
                send("CHOOSE_PAYPAL");
              }}
              variant="secondary"
            >
              Pay via PayPal
            </Button>
            <Button
              onClick={() => {
                send("CHOOSE_CREDIT_CARD");
              }}
            >
              Pay via Card
            </Button>
          </div>
        </div>
      )}
      {state.matches("payingViaPaypal") && (
        <PayPalForm
          onSubmit={(token) => {
            send("SUBMIT");
            setPaypalToken(token);
          }}
          onClickBack={onBack}
        ></PayPalForm>
      )}
      {state.matches("enteringCardDetails") && (
        <PaymentForm
          onSubmit={(details) => {
            send("SUBMIT");
            setCardDetails(details);
          }}
          initialValues={cardDetails}
          onClickBack={onBack}
        ></PaymentForm>
      )}
      {state.matches("confirming") && (
        <ConfirmStep
          onClickBack={onBack}
          details={{
            cardDetails,
            paypalToken,
          }}
        />
      )}
    </div>
  );
}

interface PaymentFormDetails {
  cardNumber: string;
  expiry: string;
  cvv: string;
}

const ConfirmStep = (props: { onClickBack: () => void; details: {} }) => {
  return (
    <div>
      <h1 className="mb-4 text-xl font-medium tracking-tight text-gray-800">
        Confirm
      </h1>
      <pre className="mb-4 text-xs">
        {JSON.stringify(props.details, null, 2)}
      </pre>
      <div className="space-x-2">
        <Button onClick={props.onClickBack} variant="secondary">
          Back
        </Button>
        <Button
          onClick={() => {
            alert("Complete!");
          }}
        >
          Submit
        </Button>
      </div>
    </div>
  );
};

const PaymentForm = (props: {
  onSubmit: (details: PaymentFormDetails) => void;
  onClickBack: () => void;
  initialValues: PaymentFormDetails | undefined;
}) => {
  const form = useForm<PaymentFormDetails>({
    defaultValues: props.initialValues,
  });
  return (
    <div>
      <h1 className="mb-4 text-xl font-medium tracking-tight text-gray-800">
        Paying via card
      </h1>
      <form
        onSubmit={form.handleSubmit((values) => props.onSubmit(values))}
        className="space-y-6"
      >
        <label className="block">
          <span className="block text-sm text-gray-600">Card Number</span>
          <input
            className="bg-gray-200"
            type="text"
            {...form.register("cardNumber")}
          ></input>
        </label>
        <label className="block">
          <span className="block text-sm text-gray-600">Expiry</span>
          <input
            className="bg-gray-200"
            type="text"
            {...form.register("expiry")}
          ></input>
        </label>
        <label className="block">
          <span className="block text-sm text-gray-600">CVV</span>
          <input
            className="bg-gray-200"
            type="text"
            {...form.register("cvv")}
          ></input>
        </label>
        <div className="space-x-2">
          <Button type="button" onClick={props.onClickBack} variant="secondary">
            Back
          </Button>
          <Button type="submit">Submit</Button>
        </div>
      </form>
    </div>
  );
};

const PayPalForm = (props: {
  onSubmit: (payPalToken: string) => void;
  onClickBack: () => void;
}) => {
  useEffect(() => {
    new Promise<string>((resolve) => {
      setTimeout(() => {
        resolve("paypal-token");
      }, 1000);
    }).then((result) => {
      props.onSubmit(result);
    });
  }, []);

  return (
    <div>
      <h1 className="mb-4 text-xl font-medium tracking-tight text-gray-800">
        Contacting PayPal...
      </h1>
      <div className="space-x-2">
        <Button onClick={props.onClickBack} variant="secondary">
          Back
        </Button>
      </div>
    </div>
  );
};
