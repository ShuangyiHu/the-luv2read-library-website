import React, { useEffect, useState } from "react";
import BookModel from "../../../models/BookModel";
import { useAuth, useUser } from "@clerk/clerk-react";

export default function ChangeBookQuantity(props: {
  book: BookModel;
  setClickDelete: any;
}) {
  //User
  const { isSignedIn, getToken } = useAuth();
  const { user } = useUser();
  const adminEmail = user?.primaryEmailAddress?.emailAddress;

  const [copies, setCopies] = useState(0);
  const [copiesAvailable, setCopiesAvailable] = useState(0);

  useEffect(() => {
    function fetchBookInState() {
      props.book.copies ? setCopies(props.book.copies) : setCopies(0);
      props.book.copiesAvailable
        ? setCopiesAvailable(props.book.copiesAvailable)
        : setCopiesAvailable(0);
    }
    fetchBookInState();
  }, []);

  async function increaseQuantity() {
    const url = `${process.env.REACT_APP_API}/admin/secure/increase/book/quantity/?bookId=${props.book.id}`;
    if (isSignedIn) {
      const token = await getToken();
      const response = await fetch(url, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          "Admin-Email": adminEmail || "",
        },
      });
      if (!response.ok)
        throw new Error("Something went wrong increasing book quantity.");

      setCopies((copies) => copies + 1);
      setCopiesAvailable((copiesAvailable) => copiesAvailable + 1);
    }
  }

  async function decreaseQuantity() {
    const url = `${process.env.REACT_APP_API}/admin/secure/decrease/book/quantity/?bookId=${props.book.id}`;
    if (isSignedIn) {
      const token = await getToken();
      const response = await fetch(url, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          "Admin-Email": adminEmail || "",
        },
      });
      if (!response.ok)
        throw new Error("Something went wrong decreasing book quantity.");

      setCopies((copies) => copies - 1);
      setCopiesAvailable((copiesAvailable) => copiesAvailable - 1);
    }
  }

  async function deleteBook() {
    const url = `${process.env.REACT_APP_API}/admin/secure/delete/book/?bookId=${props.book.id}`;
    if (isSignedIn) {
      const token = await getToken();
      const response = await fetch(url, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          "Admin-Email": adminEmail || "",
        },
      });
      if (!response.ok) throw new Error("Something went wrong deleting book.");
      props.setClickDelete(true);
    }
  }
  return (
    <div className="card mt-3 shadow p-3 mb-3 bg-body rounded">
      <div className="row g-0">
        <div className="col-md-2">
          {/* <div className="d-none d-lg-block">
          {props.book.img ? <></> : <></>}</div> */}
          <div className="mt-5 d-flex justify-content-center align-items-center flex-column gap-3">
            {props.book.img ? (
              <img
                src={props.book.img}
                width={123}
                alt={`Cover of book ${props.book.title}`}
              />
            ) : (
              <img
                src={require("../../../Images/BooksImages/book-luv2code-1000.png")}
                width={123}
                alt="Default book cover"
              />
            )}
            <button className="m-3 btn btn-md btn-danger" onClick={deleteBook}>
              Delete
            </button>
          </div>
        </div>
        <div className="col-md-6">
          <div className="card-body">
            <h5 className="card-title">{props.book.author}</h5>
            <h4>{props.book.title}</h4>
            <p className="card-text">{props.book.description}</p>
          </div>
        </div>
        <div className="mt-3 col-md-4 d-flex justify-content-center align-items-center flex-column">
          {/* <div className="d-flex justify-content-center align-items-center"> */}
          <p>
            Total quantity: <b>{copies}</b>
          </p>
          {/* </div> */}
          {/* <div className="d-flex justify-content-center align-items-center"> */}
          <p>
            Copies available: <b>{copiesAvailable}</b>
          </p>
          {/* </div> */}
          <button
            className="m-2 btn btn-md main-color text-black"
            style={{ width: "200px" }}
            onClick={increaseQuantity}
          >
            Add Quantity
          </button>
          <button
            className="m-2 mb-5 btn btn-md btn-warning"
            style={{ width: "200px" }}
            onClick={decreaseQuantity}
          >
            Decrease Quantity
          </button>
        </div>
        {/* <div className="mt-3 col-md-1">
          <div className="d-flex justify-content-start">
            <button className="m-1 btn btn-md btn-danger">Delete</button>
          </div>
        </div> */}
        {/* <button className="m-1 btn btn-md main-color text-black">
          Add Quantity
        </button>
        <button className="m-1 btn btn-md btn-warning">
          Decrease Quantity
        </button> */}
      </div>
    </div>
  );
}
