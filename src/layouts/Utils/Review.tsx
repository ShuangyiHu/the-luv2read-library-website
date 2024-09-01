import React from "react";
import ReviewModel from "../../models/ReviewModel";
import StarReview from "./StarReview";
import { formatDate } from "date-fns";

export default function Review(props: { review: ReviewModel }) {
  const date = formatDate(
    new Date(props.review.date),
    "MMMM dd, yyyy  hh:mm:ss"
  );

  return (
    <div className="">
      <hr />

      <h5>{props.review.userEmail}</h5>
      <div className="row">
        <div className="col">{date}</div>
        <div className="col">
          <StarReview rating={props.review.rating} size={16} color="gold" />
        </div>
      </div>
      <div className="mt-2">{props.review.reviewDescription}</div>
      <hr />
    </div>
  );
}
