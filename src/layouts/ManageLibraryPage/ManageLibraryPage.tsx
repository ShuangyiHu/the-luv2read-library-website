import { SignedIn, SignedOut, SignInButton, useAuth } from "@clerk/clerk-react";
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AdminMessages from "./components/AdminMessages";
import AddNewBook from "./components/AddNewBook";
import ChangeBookQuantity from "./components/ChangeBooksQuantity";

export default function ManageLibraryPage() {
  const { isSignedIn, has } = useAuth();
  const canManage = has?.({ role: "org:admin" });

  const [activeTab, setActiveTab] = useState("add");
  const navigate = useNavigate();

  useEffect(() => {
    if (isSignedIn && canManage !== undefined && !canManage) {
      navigate("/");
    }
  }, [canManage, navigate, isSignedIn]);

  return (
    <>
      <SignedIn>
        <div className="container">
          <div className="mt-5">
            <h3>Manage Library</h3>
            <nav>
              <div className="nav nav-tabs" id="nav-tab" role="tablist">
                <button
                  className="nav-link active"
                  id="nav-add-book-tab"
                  data-bs-toggle="tab"
                  data-bs-target="#nav-add-book"
                  type="button"
                  role="tab"
                  aria-controls="nav-add-book"
                  aria-selected="false"
                  onClick={() => setActiveTab("add")}
                >
                  Add new book
                </button>
                <button
                  className="nav-link"
                  id="nav-quantity-tab"
                  data-bs-toggle="tab"
                  data-bs-target="#nav-quantity"
                  type="button"
                  role="tab"
                  aria-controls="nav-quantity"
                  aria-selected="true"
                  onClick={() => setActiveTab("quantity")}
                >
                  Change quantity
                </button>
                <button
                  className="nav-link"
                  id="nav-messages-tab"
                  data-bs-toggle="tab"
                  data-bs-target="#nav-messages"
                  type="button"
                  role="tab"
                  aria-controls="nav-messages"
                  aria-selected="false"
                  onClick={() => setActiveTab("messages")}
                >
                  Messages
                </button>
              </div>
            </nav>
            <div className="tab-content" id="nav-tabContent">
              <div
                className="tab-pane fade show active "
                id="nav-add-book"
                role="tabpanel"
                aria-labelledby="nav-add-book-tab"
              >
                {activeTab === "add" && <AddNewBook />}
              </div>
              <div
                className="tab-pane fade"
                id="nav-quantity"
                role="tabpanel"
                aria-labelledby="nav-quantity-tab"
              >
                {activeTab === "quantity" && <ChangeBookQuantity />}
              </div>
              <div
                className="tab-pane fade"
                id="nav-messages"
                role="tabpanel"
                aria-labelledby="nav-messages-tab"
              >
                {activeTab === "messages" && <AdminMessages />}
              </div>
            </div>
          </div>
        </div>
      </SignedIn>
      <SignedOut>
        <div className="container my-5 p-5 border">
          <h3>Please log in to view the manage library page.</h3>
          <SignInButton>
            <Link
              type="button"
              to="/admin"
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
