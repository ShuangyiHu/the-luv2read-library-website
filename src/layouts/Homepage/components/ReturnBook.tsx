import React from "react";
import BookModel from "../../../models/BookModel";
import { Link } from "react-router-dom";

export default function ReturnBook(props: {
  screenSize: string;
  book: BookModel;
  key: any;
}) {
  return (
    <div className="col-xl-3 col-lg-3 col-md-3 my-4">
      <div className="text-center">
        {props.book.img ? (
          <img
            src={props.book.img}
            width={props.screenSize === "desktop" ? 233 : 151}
            alt={`Cover of book ${props.book.title}`}
          />
        ) : (
          <img
            src={require("../../../Images/BooksImages/book-luv2code-1000.png")}
            width={props.screenSize === "desktop" ? 233 : 151}
            alt="Default book cover"
          />
        )}
        <h3 className="my-2" style={{ height: 70 }}>
          {props.book.title}
        </h3>
        <p className="display-9 mt-2">{props.book.author}</p>
        <Link
          className="btn btn-color text-white mb-auto"
          to={`/checkout/${props.book.id}`}
        >
          Reserve
        </Link>
      </div>
    </div>
  );
}
