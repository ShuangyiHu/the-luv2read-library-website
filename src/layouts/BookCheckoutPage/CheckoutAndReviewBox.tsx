import BookModel from "../../models/BookModel";
import { Link } from "react-router-dom";
import { SignInButton, useAuth } from "@clerk/clerk-react";
import LeaveAReview from "../Utils/LeaveAReview";

export default function CheckoutAndReviewBox(props: {
  book: BookModel | undefined;
  currentLoansCount: number;
  isBookCheckedOut: boolean;
  checkoutBook: any;
  isBookReviewedByUser: boolean;
  handleUserRating: any;
  userRating: number;
  setReviewDescription: any;
  postUserReview: any;
}) {
  const { isSignedIn } = useAuth();

  function buttonRender() {
    if (!isSignedIn) {
      return (
        <SignInButton>
          <Link
            type="button"
            to={window.location.href}
            className="btn btn-lg btn-success"
          >
            Log In
          </Link>
        </SignInButton>
      );
    }
    if (props.isBookCheckedOut) {
      return <p className="fw-bold text-success">Book checked out. Enjoy!</p>;
    }
    if (props.currentLoansCount === 5) {
      return <p className="fw-bold text-danger">Too many books checked out</p>;
    }
    if (props.book?.copiesAvailable === 0) {
      return <p className="fw-bold text-danger">Book not available for now</p>;
    }
    return (
      <Link
        className="btn btn-lg btn-success"
        to="#"
        onClick={() => props.checkoutBook()}
      >
        Check out
      </Link>
    );
  }

  function reviewRender() {
    if (isSignedIn && props.isBookReviewedByUser) {
      return (
        <p>
          <b>Thanks for your review!</b>
        </p>
      );
    } else if (isSignedIn && !props.isBookReviewedByUser) {
      return (
        <LeaveAReview
          handleSelect={props.handleUserRating}
          rating={props.userRating}
          setReviewDescription={props.setReviewDescription}
          postUserReview={props.postUserReview}
        />
      );
    } else {
      return <p>Sign in to leave a review.</p>;
    }
  }

  return (
    <div className="container card d-flex">
      <div className="card-body container">
        <div className="mt-3">
          <p>
            <b>{props.currentLoansCount} / 5 </b> books checked out
          </p>
          <hr />
          {props.book &&
          props.book.copiesAvailable &&
          props.book.copiesAvailable > 0 ? (
            <h4 className="text-success">Available</h4>
          ) : (
            <h4 className="text-danger">Wait list</h4>
          )}

          <div className="row">
            <p className="lead col-6">
              <b>{props.book?.copies}</b> copies
            </p>
            <p className="lead col-6">
              <b>{props.book?.copiesAvailable}</b> available
            </p>
          </div>
        </div>
        {buttonRender()}
        <hr />
        <p className="mt-3">
          This number can change until placing order has been complete.
        </p>
        {reviewRender()}
      </div>
    </div>
  );
}
