import React, { useEffect, useState } from "react";
import MessageModel from "../../../models/MessageModel";
import { useAuth, useUser } from "@clerk/clerk-react";

export default function AdminMessage(props: {
  message: MessageModel;
  setIsResponseSubmitted: any;
}) {
  const [displayWarning, setDisplayWarning] = useState(false);
  const [response, setResponse] = useState("");
  const [isVisible, setIsVisible] = useState(false);

  const { isSignedIn, getToken } = useAuth();
  const { user } = useUser();
  const adminEmail = user?.primaryEmailAddress?.emailAddress;

  //display warning message for only 3 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, [isVisible]);

  async function submitResponse() {
    props.setIsResponseSubmitted(false);
    const url = `${process.env.REACT_APP_API}/messages/secure/admin/response`;

    if (isSignedIn && response !== "") {
      //   props.message.adminEmail = adminEmail;
      //   props.message.closed = true;

      const token = await getToken();

      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          "Admin-Email": adminEmail || "",
        },
        body: JSON.stringify(props.message),
      });

      if (!response.ok) {
        throw new Error("Error posting new response");
      }
      props.setIsResponseSubmitted(true);
      setResponse("");
      setDisplayWarning(false);
    } else {
      setDisplayWarning(true);
      setIsVisible(true);
    }
  }

  return (
    <div className="card mt-2 shadow p-3 bg-body rounded">
      <h5>
        Case #{props.message.id} : {props.message.title}
      </h5>
      <h6>{props.message.userEmail}</h6>
      <p>{props.message.question}</p>
      <hr />
      <div>
        <h5>Response: </h5>
        <form method="PUT">
          {isVisible && displayWarning && (
            <div className="alert alert-danger" role="alert">
              ❗️ All fields must be filled out
            </div>
          )}
          <div className="col-md-12 mb-3">
            <label className="form-label">Description</label>

            <textarea
              className="form-control"
              id="exampleFormControlTextarea1"
              placeholder="Response"
              rows={3}
              onChange={(e) => {
                setResponse(e.target.value);
                props.message.response = e.target.value;
              }}
              value={response}
            ></textarea>
          </div>
          <div>
            <button
              type="button"
              className="btn btn-color text-white mt-3"
              onClick={submitResponse}
            >
              Submit Response
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
