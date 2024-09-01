import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import BookModel from "../../models/BookModel";
import Spinner from "../Utils/Spinner";
import ReviewModel from "../../models/ReviewModel";
import LatestReviews from "./LatestReviews";
import CheckoutAndReviewBox from "./CheckoutAndReviewBox";
import { useAuth, useUser } from "@clerk/clerk-react";
import CheckoutBookInfo from "./CheckoutBookInfo";
import ReviewRequestModel from "../../models/ReviewRequestModel";

export default function BookCheckoutPage() {
  const { bookId } = useParams<{ bookId: string }>();
  const [book, setBook] = useState<BookModel>();
  const [isLoading, setIsLoading] = useState(true);
  const [httpError, setHttpError] = useState(null);

  // Review state
  const [reviews, setReviews] = useState<ReviewModel[]>([]);
  const [totalStars, setTotalStars] = useState(0);
  const [isLoadingReview, setIsLoadingReview] = useState(true);

  //User review state
  const [isBookReviewedByUser, setIsBookReviewedByUser] = useState(false);
  const [isLodingUserReview, setIsLodingUserReview] = useState(true);
  const [userRating, setUserRating] = useState(0);
  const [reviewDescription, setReviewDescription] = useState("");

  //User state
  const { isSignedIn, getToken } = useAuth();
  const { user } = useUser();
  const userEmail = user?.primaryEmailAddress?.emailAddress;

  //Current loans count
  const [currentLoansCount, setCurrentLoansCount] = useState(0);
  const [isLoadingCurrentLoansCount, setIsLoadingCurrentLoansCount] =
    useState(true);

  //Is book checked out?
  const [isBookCheckedOut, setIsBookCheckedOut] = useState(false);
  const [isLoadingBookCheckedOut, setIsLoadingBookCheckedOut] = useState(false);

  //payment
  const [displayError, setDisplayError] = useState(false);

  function handleUserRating(value: number) {
    setUserRating(value);
  }

  //Fetch book
  useEffect(() => {
    async function fetchBook() {
      const url: string = `${process.env.REACT_APP_API}/books/${bookId}`;
      const response = await fetch(url);

      if (!response.ok)
        throw new Error(
          "Something went wrong fetching the book of id: " + bookId
        );
      const data = await response.json();
      // console.log(data);
      setIsLoading(false);
      setBook(data);
    }

    fetchBook().catch((error: any) => {
      setIsLoading(false);
      setHttpError(error.message);
    });
  }, [isBookCheckedOut, isBookReviewedByUser]);

  //Fetch current loans
  useEffect(() => {
    async function fetchUserCurrentLoansCount() {
      if (isSignedIn) {
        const url: string = `${process.env.REACT_APP_API}/books/secure/currentloans/count`;
        const token = await getToken();
        const response = await fetch(url, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "User-Email": userEmail || "",
          },
        });

        if (!response.ok)
          throw new Error(
            "Something went wrong fetching the current loans count of user."
          );
        const data = await response.json();
        setIsLoadingCurrentLoansCount(false);
        setCurrentLoansCount(data);
      }
    }

    fetchUserCurrentLoansCount().catch((error: any) => {
      setIsLoadingCurrentLoansCount(false);
      setHttpError(error.message);
    });
  }, [isSignedIn, isBookCheckedOut]);

  //Fetch user review
  useEffect(() => {
    async function fetchUserReview() {
      if (isSignedIn) {
        const url: string = `${process.env.REACT_APP_API}/reviews/secure/user/book?bookId=${bookId}`;
        const token = await getToken();
        const response = await fetch(url, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "User-Email": userEmail || "",
          },
        });

        if (!response.ok)
          throw new Error("Something went wrong fetching user review.");
        const data = await response.json();
        setIsLodingUserReview(false);
        setIsBookReviewedByUser(data);
      }
    }

    fetchUserReview().catch((error: any) => {
      setIsLodingUserReview(false);
      setHttpError(error.message);
    });
  }, [isSignedIn, isBookReviewedByUser]);

  // //Fetch book reviews
  useEffect(() => {
    async function fetchBookReviews() {
      const reviewUrl = `${process.env.REACT_APP_API}/reviews/search/findByBookId?bookId=${bookId}`;
      const response = await fetch(reviewUrl);
      const data = await response.json();
      // console.log(data);

      const reviewsFromDB = data._embedded.reviews;
      if (reviewsFromDB.length === 0) {
        setIsLoadingReview(false);
        setReviews([]);
        setTotalStars(0);
        return;
      }
      let starsTotalNum: number = 0;

      for (const key in reviewsFromDB) {
        starsTotalNum += reviewsFromDB[key].rating;
      }

      const loadedReviews: ReviewModel[] = reviewsFromDB.map((review: any) => ({
        id: review.id,
        userEmail: review.userEmail,
        date: review.date,
        rating: review.rating,
        book_id: review.bookId,
        reviewDescription: review.reviewDescription,
      }));

      const starsAverage = (
        Math.round((starsTotalNum / loadedReviews?.length) * 2) / 2
      ).toFixed(1);

      setTotalStars(Number(starsAverage));
      if (Number(starsAverage) !== 0) {
        await updateBookRating(Number(bookId), Number(starsAverage));
      }

      setIsLoadingReview(false);
      setReviews(loadedReviews);
    }

    fetchBookReviews().catch((error: any) => {
      setIsLoadingReview(false);
      setHttpError(error.message);
    });
  }, [isBookReviewedByUser, userRating]);

  //Fetch book checked out
  useEffect(() => {
    async function fetchUserCheckedOutBook() {
      if (isSignedIn) {
        const url: string = `${process.env.REACT_APP_API}/books/secure/ischeckedout/byuser?bookId=${bookId}`;
        const token = await getToken();
        const response = await fetch(url, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "User-Email": userEmail || "",
          },
        });

        if (!response.ok)
          throw new Error(
            "Something went wrong fetching the checked out status of the book."
          );
        const data = await response.json();
        setIsLoadingBookCheckedOut(false);
        setIsBookCheckedOut(data);
      }
    }

    fetchUserCheckedOutBook().catch((error: any) => {
      setIsLoadingBookCheckedOut(false);
      setHttpError(error.message);
    });
  }, [isSignedIn]);

  async function updateBookRating(bookId: number, newRating: number) {
    if (!bookId) return;
    try {
      const url = `${process.env.REACT_APP_API}/books/secure/rating?bookId=${bookId}`;
      const token = await getToken();

      const response = await fetch(url, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newRating),
      });

      if (!response.ok) {
        throw new Error(`Failed to update rating: ${response.statusText}`);
      }
    } catch (error) {
      console.error("Error updating book rating:", error);
    }
  }

  async function checkoutBook() {
    const url: string = `${process.env.REACT_APP_API}/books/secure/checkout?bookId=${bookId}`;
    const token = await getToken();
    // console.log(token);
    const response = await fetch(url, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        "User-Email": userEmail?.toString() || "",
      },
    });
    // console.log(response);
    if (!response.ok) {
      setDisplayError(true);
      return;
      // throw new Error("Something went wrong checking out the book.");
    }
    setDisplayError(false);
    setIsBookCheckedOut(true);
  }

  async function postUserReview() {
    try {
      const url = `${process.env.REACT_APP_API}/reviews/secure/post`;

      const token = await getToken();

      const reviewRequest = new ReviewRequestModel(
        userRating,
        Number(bookId),
        reviewDescription
      );

      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          "User-Email": userEmail?.toString() || "",
        },
        body: JSON.stringify(reviewRequest),
      });

      if (!response.ok) {
        throw new Error(`Failed to post review: ${response.statusText}`);
      }
      setIsBookReviewedByUser(true);
    } catch (error) {
      console.error(error);
    }
  }

  if (httpError)
    return (
      <div className="container m-5">
        <p>❌❌{httpError}</p>
      </div>
    );

  return (
    //separate the loading status of book info and reviews
    <div>
      {isLoading ||
      (isSignedIn && isLoadingBookCheckedOut) ||
      (isSignedIn && isLoadingCurrentLoansCount) ? (
        <Spinner />
      ) : (
        <>
          {displayError && (
            <div className="alert alert-danger mt-3" role="alert">
              Please pay outstanding fees and return late book(s).
            </div>
          )}
          <div className="row g-0 p-5 d-flex flex-lg-row flex-md-row  flex-sm-row flex-xs-column justify-content-center align-items-center">
            <CheckoutBookInfo book={book} rating={Number(totalStars)} />
            <div className="col-lg-3 col-md-auto mt-3">
              <CheckoutAndReviewBox
                isBookCheckedOut={isBookCheckedOut}
                book={book || undefined}
                currentLoansCount={currentLoansCount}
                checkoutBook={checkoutBook}
                isBookReviewedByUser={isBookReviewedByUser}
                handleUserRating={handleUserRating}
                userRating={userRating}
                setReviewDescription={setReviewDescription}
                postUserReview={postUserReview}
              />
            </div>
          </div>
        </>
      )}

      <div className="col-12 mt-3">
        {isLoadingReview || isLodingUserReview ? (
          <Spinner />
        ) : (
          <LatestReviews bookId={Number(bookId)} reviews={reviews} />
        )}
      </div>
    </div>
  );
}
