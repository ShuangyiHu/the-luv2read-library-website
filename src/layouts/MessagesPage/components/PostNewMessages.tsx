import { useAuth, useUser } from "@clerk/clerk-react";
import React, { useEffect, useState } from "react";
import MessageModel from "../../../models/MessageModel";

export default function PostNewMessages() {
  //user info
  const { isSignedIn, getToken } = useAuth();
  const { user } = useUser();
  const userEmail = user?.primaryEmailAddress?.emailAddress;

  const [title, setTitle] = useState("");
  const [question, setQuestion] = useState("");
  const [displayWarning, setDisplayWarning] = useState(false);
  const [displaySuccess, setDisplaySuccess] = useState(false);

  const [isVisible, setIsVisible] = useState(false);

  //display success/ warning message for only 3 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, [isVisible]);

  async function submitNewQuestion() {
    const url = `${process.env.REACT_APP_API}/messages/secure/add/message`;
    if (isSignedIn && title !== "" && question !== "") {
      const message: MessageModel = new MessageModel(title, question);
      const token = await getToken();

      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          "User-Email": userEmail || "",
        },
        body: JSON.stringify(message),
      });

      if (!response.ok) {
        throw new Error("Error posting new message");
      }

      setTitle("");
      setQuestion("");
      setDisplayWarning(false);
      setDisplaySuccess(true);
      setIsVisible(true);
    } else {
      setDisplayWarning(true);
      setDisplaySuccess(false);
      setIsVisible(true);
    }
  }

  return (
    <div className="card my-3">
      <div className="card-header">Add question to Luv2Read Admin</div>
      <div className="card-body">
        <form method="POST">
          {isVisible && displaySuccess && (
            <div className="alert alert-success" role="alert">
              Question added successfully
            </div>
          )}
          {isVisible && displayWarning && (
            <div className="alert alert-danger" role="alert">
              ❗️ All fields must be filled out
            </div>
          )}
          <div className="mb-3">
            <label className="form-label">Title</label>
            <input
              type="text"
              className="form-control"
              id="exampleFormControlInput1"
              placeholder="title"
              onChange={(e) => setTitle(e.target.value)}
              value={title}
            ></input>
          </div>
          <div className="mb-3">
            <label className="form-label">Question</label>
            <textarea
              className="form-control"
              id="exampleFormControlTextarea1"
              placeholder="question"
              rows={3}
              onChange={(e) => setQuestion(e.target.value)}
              value={question}
            ></textarea>
          </div>
          <div>
            <button
              type="button"
              className="btn btn-color text-white mt-3"
              onClick={submitNewQuestion}
            >
              Submit Question
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
