import React from "react";
import BookModel from "../../../models/BookModel";
import { Link } from "react-router-dom";
import LoansModal from "./LoansModal";

export default function LoanedBook(props: {
  book: BookModel;
  daysLeft: number;
  returnBook: any;
  renewLoan: any;
}) {
  return (
    <>
      <div className="d-flex mt-5 mb-5 flex-column flex-md-row">
        <div className="col-md-3 col-sm-6 container mb-3">
          {props.book.img ? (
            <img
              src={props.book.img}
              width={226}
              alt={`Cover of ${props.book.title}`}
            />
          ) : (
            <img
              src={require("./../../../Images/BooksImages/book-luv2code-1000.png")}
              width={226}
              alt={`Default book cover`}
            />
          )}
        </div>
        <div className="card  col-lg-3 col-md-5 col-sm-8 container d-flex  ">
          <div className="card-body">
            <div className="mt-3">
              <h4>Loan Options</h4>
              {props.daysLeft > 0 && (
                <p className="text-secondary">Due in {props.daysLeft} days.</p>
              )}

              {props.daysLeft === 0 && (
                <p className="text-success">Due today.</p>
              )}

              {props.daysLeft < 0 && (
                <p className="text-danger">Past due {-props.daysLeft} days.</p>
              )}

              <div className="list-group mt-3">
                <button
                  className="list-group-item list-group-item-action"
                  aria-current="true"
                  data-bs-toggle="modal"
                  data-bs-target={`#modal${props.book.id}`}
                >
                  Manage Loan
                </button>

                <Link
                  to={"/search"}
                  className="list-group-item list-group-item-action"
                >
                  Search more books?
                </Link>
              </div>
            </div>
            <hr />
            <p className="mt-3">
              Help others find their adventure by reviewing your loan.
            </p>
            <Link to={`/checkout/${props.book.id}`} className="btn main-color">
              Leave a review
            </Link>
          </div>
        </div>
      </div>
      <hr />
      <LoansModal
        daysLeft={props.daysLeft}
        book={props.book}
        returnBook={props.returnBook}
        renewLoan={props.renewLoan}
      />
    </>
  );
}
