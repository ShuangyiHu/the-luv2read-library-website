import React, { useState } from "react";
import BookModel from "../../../models/BookModel";
import { Link } from "react-router-dom";

export default function SearchBook(props: { book: BookModel; key: any }) {
  const [showMore, setShowMore] = useState(false);
  return (
    <div className="card my-3 shadow bg-body p-5 rounded">
      <div className="row g-0">
        <div className="col-md-3 d-flex justify-content-center align-items-center m-md-3">
          <div>
            {props.book.img ? (
              <img
                src={props.book.img}
                width={151}
                // height={196}
                alt={`Cover of book ${props.book.title}`}
              />
            ) : (
              <img
                src={require("../../../Images/BooksImages/book-luv2code-1000.png")}
                width={151}
                // width={123}
                // height={196}
                alt="Default book cover"
              />
            )}
          </div>
        </div>
        <div className="col-md-5 col-sm-8">
          <div className="card-body">
            <h5 className="card-title">{props.book.author}</h5>
            <h4>{props.book.title}</h4>
            <p className="card-text">
              {showMore
                ? props.book.description
                : props.book.description?.slice(0, 300) + " ..."}
              <span
                role="button"
                className="text-decoration-underline fw-bold"
                onClick={() => setShowMore((show) => !show)}
              >
                {showMore ? " Show less" : " Show more"}
              </span>
            </p>
          </div>
        </div>
        <div className="col-md-3 col-sm-4 d-flex justify-content-center align-items-center mt-3">
          <Link
            className="btn btn-md btn-color text-white"
            to={`/checkout/${props.book.id}`}
          >
            View details
          </Link>
        </div>
      </div>
    </div>
  );
}
