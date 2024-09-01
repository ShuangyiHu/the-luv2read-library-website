import React from "react";
import HistoryModel from "../../../models/HistoryModel";
import { Link } from "react-router-dom";

export default function History(props: { history: HistoryModel }) {
  return (
    <div className="card mt-3 mb-3 shadow p-5 bg-body rounded">
      <div className="row g-0">
        <div className="col-lg-2 col-md-3">
          {/* <div className="d-none d-lg-block"> */}
          <div className="ms-3 mt-3">
            <Link to={`/checkout/${props.history.bookId}`}>
              {props.history.img ? (
                <img
                  src={props.history.img}
                  width={123}
                  alt={`Cover of ${props.history.title}`}
                />
              ) : (
                <img
                  src={require("./../../../Images/BooksImages/book-luv2code-1000.png")}
                  width={123}
                  alt={`Default book cover`}
                />
              )}
            </Link>
          </div>
        </div>
        <div className="col">
          <div className="card-body">
            <h5 className="card-title">{props.history.author}</h5>
            <Link to={`/checkout/${props.history.bookId}`}>
              <h4>{props.history.title}</h4>
            </Link>
            <p className="card-text">{props.history.description}</p>
            <hr />
            <p className="card-text">
              Checked out on: {props.history.checkoutDate}
            </p>
            <p className="card-text">
              Returned on: {props.history.returnedDate}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
