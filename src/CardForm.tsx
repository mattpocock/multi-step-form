import { useMachine } from "@xstate/react";
import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom/client";
import { useForm } from "react-hook-form";
import { createMachine } from "xstate";
import { Button } from "./Button";
import "./index.css";

const machine =
  /** @xstate-layout N4IgpgJg5mDOIC5QFsCuAbALgSwMqbAAcAxAewCdkA6AYwAtTTZsA7KAYgGEAJAeV9wBRAPoAFAIIBNCQBlEoQk2w5SLeSAAeiALQAWAEwB2KgA4AbLoCMABhOWT+3dYCsh3QBoQATx2XnJqjNDEwBOa3t9AGZIkLMTXQBfBM80LDwCEgpqekZmNi4+ARFOACVBABEASQAVYU5xEvL1RWYVNSRNHV0QyKoQy319OLczWLdDTx8EbUjdKl1dQ31nM2c-IxcQ5ySUjBx8IjJKKjAWAnJWKE4AQ3IIcrBMa+x0WHZcAFUAIQBZGualG11FpptYqJEbGZ9CEYUM1uYTIZnJMdCEqEMQtCgoYIRYXCYdiBUvsMkdqKdzpcbncHk8Xm8vuJOABpAGtbCqYE6VxmKjWWwuRaWPyzSwohBOKj+GF2QaOJwhAnJIl7dKHLJUQjXLyXABq2Guom1WvQ72+f2qbOUHPaoBB2kswT5cS2iJWViWZnFen081sSJss0i-jciWVxLVmWOWp1bH1huN11NjJZVqBHXtll0vMiQzMcVlITcIW99l5Aqhzic1iCMLMhIjByj2VUADNsJRLprE8mmayOi1rZyMzpDMZrLpnP1hVFzHEvd4dMsAg4ofpwgM4osG6qm2TaG2O8guzRyJBlNSIOwU-2FICbVyEPZnOCBjWFlnnLnLAupsKX5EZjCt0ti6A4ir1oSLCkBAcDqI2pIajkShsGmD4jtMZjWMYoQ2DWYTdH4yKLtM+g-nyCyGPmAZVrEYa7Gke4ahSYAXGwl60s8rxocOdo6DEvKLEYURQoYYTQsRUyzHy8Q1lESJyV+O6MYh0banqBpGl4Jo8banSkdYvrOI4gxmBCIzBCYpaRGCPSLGBWaGNYMTxMpJLqscNCHp2bDdtpSa6Y+GxUGOiq5jiyxyqWkp2SMTiWNEoFuZG+5eSw7Y+VAtBnhAF63BAgUYcsaKToiFhmWE0RiiR2iGJYfS6JEdiNbEgo4slTGed5x6oQO968fpUQvqVVHZjEzkQvo3pkb0lVFtiQRNfRKoqR5yCFXxmEQqY-T8qME79M4kn8dtYlfs42FjvY5hJEkQA */
  createMachine({
    tsTypes: {} as import("./CardForm.typegen").Typegen0,
    id: "multiStepForm",
    initial: "choosing",
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
    states: {
      choosing: {
        on: {
          CHOOSE_PAYPAL: {
            target: "payingViaPaypal",
          },
          CHOOSE_CREDIT_CARD: {
            target: "enteringCardDetails",
          },
        },
      },
      enteringCardDetails: {
        entry: ["resetPaypalToken"],
        on: {
          SUBMIT: {
            target: "#multiStepForm.confirming.creditCard",
          },
          BACK: {
            target: "choosing",
          },
        },
      },
      payingViaPaypal: {
        entry: ["resetCardDetails"],
        on: {
          SUBMIT: {
            target: "#multiStepForm.confirming.paypal",
          },
          BACK: {
            target: "choosing",
          },
        },
      },
      confirming: {
        states: {
          paypal: {
            on: {
              BACK: {
                target: "#multiStepForm.choosing",
              },
            },
          },
          creditCard: {
            on: {
              BACK: {
                target: "#multiStepForm.enteringCardDetails",
              },
            },
          },
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
    <div className="px-6 py-4">
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
