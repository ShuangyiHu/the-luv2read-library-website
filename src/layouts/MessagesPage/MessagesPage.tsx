import { SignedIn, SignedOut, SignInButton } from "@clerk/clerk-react";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import PostNewMessages from "./components/PostNewMessages";
import Messages from "./components/Messages";

export default function MessagesPage() {
  const [messagesClick, setMessagesClick] = useState(false);
  return (
    <>
      <SignedIn>
        <div className="container">
          <div className="my-3">
            <nav>
              <div className="nav nav-tabs" id="nav-tab" role="tablist">
                <button
                  onClick={() => setMessagesClick(false)}
                  className="nav-link active"
                  id="nav-send-message-tab"
                  data-bs-toggle="tab"
                  data-bs-target="#nav-send-message"
                  type="button"
                  role="tab"
                  aria-controls="nav-send-message"
                  aria-selected="true"
                >
                  Submit Question
                </button>

                <button
                  onClick={() => setMessagesClick(true)}
                  className="nav-link"
                  id="nav-message-tab"
                  data-bs-toggle="tab"
                  data-bs-target="#nav-message"
                  type="button"
                  role="tab"
                  aria-controls="nav-message"
                  aria-selected="false"
                >
                  Q/A Response/Pending
                </button>
              </div>
            </nav>
            <div className="tab-content" id="nav-tabContent">
              <div
                className="tab-pane fade show active"
                id="nav-send-message"
                role="tabpanel"
                aria-labelledby="nav-send-message-tab"
              >
                <PostNewMessages />
              </div>
              <div
                className="tab-pane fade"
                id="nav-message"
                role="tabpanel"
                aria-labelledby="nav-message-tab"
              >
                {messagesClick ? <Messages /> : <></>}
              </div>
            </div>
          </div>
        </div>
      </SignedIn>
      <SignedOut>
        <div className="container my-5 p-5 border">
          <h3>Please log in to view the messages page.</h3>
          <SignInButton>
            <Link
              type="button"
              to="/shelf"
              className="btn btn-outline-dark btn-color text-white mt-3"
            >
              Log In
            </Link>
          </SignInButton>
        </div>
      </SignedOut>
    </>
  );
}
