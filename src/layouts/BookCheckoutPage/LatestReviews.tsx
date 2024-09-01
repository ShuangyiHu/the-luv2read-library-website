import React, { useEffect, useState } from "react";
import ReviewModel from "../../models/ReviewModel";
import { Link } from "react-router-dom";
import Review from "../Utils/Review";
import BookModel from "../../models/BookModel";

export default function LatestReviews(props: {
  bookId: number | undefined;
  reviews: ReviewModel[];
}) {
  return (
    <div className="row ms-lg-5 m-3">
      <div className="col-lg-3 col-md-4 col-sm-5">
        <h2>Latest reviews</h2>
      </div>
      <div className="col-md-8 d-flex flex-column col-sm-12 ">
        {props.reviews?.length > 0 ? (
          <>
            {props.reviews?.slice(0, 3).map((review) => (
              <Review review={review} key={review.id} />
            ))}
            <div className="m-3">
              <Link
                to={`/reviewlist/${props.bookId}`}
                type="button"
                className="btn main-color btn-md text-black"
              >
                Reach all reviews
              </Link>
            </div>
          </>
        ) : (
          <>
            <hr />
            <div className="m-3">
              <p className="lead">
                Be the first to write a review for this book!
              </p>
            </div>
            <hr />
          </>
        )}
      </div>
    </div>
  );
}
