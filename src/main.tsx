import React, { useCallback, useEffect, useState } from "react";
import ReactDOM from "react-dom/client";
import { useForm } from "react-hook-form";
import { Button } from "./Button";
import "./index.css";

type Step = "choose" | "payment" | "paypal" | "confirm";

function App() {
  const [step, setStep] = useState<Step>("choose");

  const [cardDetails, setCardDetails] = useState<PaymentFormDetails>();

  const [paypalToken, setPaypalToken] = useState<string>();

  const onBack = useCallback(() => {
    switch (step) {
      case "paypal":
      case "payment":
        setStep("choose");
        break;
      case "confirm":
        if (cardDetails) {
          setStep("payment");
          setPaypalToken(undefined);
        } else {
          setStep("choose");
        }
        break;
    }
  }, [step]);

  return (
    <div className="px-6 py-4">
      {step === "choose" && (
        <div>
          <h1 className="mb-4 text-xl font-medium tracking-tight text-gray-800">
            Choose your payment method
          </h1>
          <div className="space-x-2">
            <Button
              onClick={() => {
                setStep("paypal");
                setCardDetails(undefined);
              }}
              variant="secondary"
            >
              Pay via PayPal
            </Button>
            <Button
              onClick={() => {
                setStep("payment");
                setPaypalToken(undefined);
              }}
            >
              Pay via Card
            </Button>
          </div>
        </div>
      )}
      {step === "paypal" && (
        <PayPalForm
          onSubmit={(token) => {
            setStep("confirm");
            setPaypalToken(token);
          }}
          onClickBack={onBack}
        ></PayPalForm>
      )}
      {step === "payment" && (
        <PaymentForm
          onSubmit={(details) => {
            setStep("confirm");
            setCardDetails(details);
          }}
          initialValues={cardDetails}
          onClickBack={onBack}
        ></PaymentForm>
      )}
      {step === "confirm" && (
        <div>
          <h1 className="mb-4 text-xl font-medium tracking-tight text-gray-800">
            Confirm
          </h1>
          <pre className="mb-4 text-xs">
            {JSON.stringify(
              {
                cardDetails,
                paypalToken,
              },
              null,
              2,
            )}
          </pre>
          <div className="space-x-2">
            <Button onClick={onBack} variant="secondary">
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
      )}
    </div>
  );
}

interface PaymentFormDetails {
  cardNumber: string;
  expiry: string;
  cvv: string;
}

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

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
