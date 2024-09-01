import { useAuth, useUser } from "@clerk/clerk-react";
import React, { useEffect, useState } from "react";
import Spinner from "../Utils/Spinner";
import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { Link } from "react-router-dom";
import PaymentInfoRequest from "../../models/PaymentInfoRequest";

export default function PaymentPage() {
  const { isSignedIn, getToken } = useAuth();
  const { user } = useUser();
  const userEmail = user?.primaryEmailAddress?.emailAddress;

  const [httpError, setHttpError] = useState(false);
  const [submitDisabled, setSubmitDisabled] = useState(false);
  const [fees, setFees] = useState(0);
  const [loadingFees, setLoadingFees] = useState(true);

  useEffect(() => {
    async function fetchFees() {
      if (isSignedIn) {
        const url: string = `${process.env.REACT_APP_API}/payment/secure/fees`;
        const token = await getToken();
        const response = await fetch(url, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
            "User-Email": userEmail || "",
          },
        });

        if (!response.ok)
          throw new Error("Something went wrong fetching the fees of user.");

        const data = await response.json();
        // console.log(data);
        setLoadingFees(false);
        setFees(data);
      }
    }

    fetchFees().catch((error: any) => {
      setLoadingFees(false);
      setHttpError(error.message);
    });
  }, [isSignedIn]);

  const elements = useElements();
  const stripe = useStripe();

  async function checkout() {
    if (!stripe || !elements || !elements.getElement(CardElement)) {
      return;
    }

    setSubmitDisabled(true);

    let paymentInfo = new PaymentInfoRequest(
      Math.round(fees * 100),
      "USD",
      userEmail
    );
    const token = await getToken();
    const url: string = `${process.env.REACT_APP_API}/payment/secure/payment-intent`;

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(paymentInfo),
    });

    if (!response.ok) {
      setHttpError(true);
      setSubmitDisabled(false);
      throw new Error("Something went wrong creating payment intent.");
    }

    const data = await response.json();
    stripe
      .confirmCardPayment(
        data.client_secret,
        {
          payment_method: {
            card: elements.getElement(CardElement)!,
            billing_details: {
              email: userEmail,
            },
          },
        },
        { handleActions: false }
      )
      .then(async function (result: any) {
        if (result.error) {
          setSubmitDisabled(false);
          alert("There was an error processing the payment");
        } else {
          const url: string = `${process.env.REACT_APP_API}/payment/secure/payment-complete`;

          const response = await fetch(url, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
              "User-Email": userEmail || "",
            },
          });
          if (!response.ok) {
            setHttpError(true);
            setSubmitDisabled(false);
            throw new Error("Something went wrong completing payment.");
          }
          setFees(0);
          setSubmitDisabled(false);
        }
      });
    setHttpError(false);
  }

  if (loadingFees) return <Spinner />;

  if (httpError)
    return (
      <div className="container m-5">
        <p>❌❌{httpError}</p>
      </div>
    );
  return (
    <div className="container">
      {fees > 0 && (
        <div className="card mt-3">
          <h5 className="card-header">
            Fees pending: <span className="text-danger">{fees}</span>
          </h5>
          <div className="card-body">
            <h5 className="card-title mb-3">Credit card</h5>
            <CardElement id="card-element" />
            <button
              disabled={submitDisabled}
              type="button"
              className="btn btn-md btn-color text-white mt-3"
              onClick={checkout}
            >
              Pay fees
            </button>
          </div>
        </div>
      )}

      {fees === 0 && (
        <div className="mt-5">
          <h5>You have no fees!</h5>

          <Link
            type="button"
            className="btn btn-color text-white mt-3"
            to={"/search"}
          >
            Explore top books
          </Link>
        </div>
      )}
      {submitDisabled && <Spinner />}
    </div>
  );
}
