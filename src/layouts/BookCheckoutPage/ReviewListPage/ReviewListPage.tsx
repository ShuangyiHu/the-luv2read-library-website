import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ReviewModel from "../../../models/ReviewModel";
import Spinner from "../../Utils/Spinner";
import Review from "../../Utils/Review";
import Pagination from "../../Utils/Pagination";

export default function ReviewListPage() {
  const { bookId } = useParams<{ bookId: string }>();

  const [reviews, setReviews] = useState<ReviewModel[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [httpError, setHttpError] = useState(null);

  //pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [reviewsPerPage] = useState(5);
  const [totalAmountOfReviews, setTotalAmountOfReviews] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  // //Fetch book reviews

  useEffect(() => {
    async function fetchBookReviews() {
      const reviewUrl = `${
        process.env.REACT_APP_API
      }/reviews/search/findByBookId?bookId=${bookId}&pages=${
        currentPage - 1
      }&size=${reviewsPerPage}`;
      const response = await fetch(reviewUrl);
      const data = await response.json();
      console.log(data);

      setTotalAmountOfReviews(data?.page?.totalElements);
      setTotalPages(data?.page?.totalPages);

      const reviewsFromDB = data._embedded.reviews;

      const loadedReviews: ReviewModel[] = reviewsFromDB.map((review: any) => ({
        id: review.id,
        userEmail: review.userEmail,
        date: review.date,
        rating: review.rating,
        book_id: review.bookId,
        reviewDescription: review.reviewDescription,
      }));

      setIsLoading(false);
      setReviews(loadedReviews);
    }

    fetchBookReviews().catch((error: any) => {
      setIsLoading(false);
      setHttpError(error.message);
    });
  }, [currentPage]);

  if (isLoading) return <Spinner />;

  if (httpError)
    return (
      <div className="container m-5">
        <p>❌❌ {httpError}</p>
      </div>
    );

  //0-based indexes
  const indexOfLastReview = reviewsPerPage * currentPage - 1;
  const indexOfFirstReview = indexOfLastReview - reviewsPerPage + 1;
  const lastItem =
    indexOfLastReview < totalAmountOfReviews - 1
      ? indexOfLastReview
      : totalAmountOfReviews - 1;

  function paginate(pageNumber: number) {
    setCurrentPage(pageNumber);
  }
  return (
    <div className="container m-5">
      <div>
        <h3>Comments: {totalAmountOfReviews}</h3>
      </div>
      <p>
        {indexOfFirstReview + 1} to {lastItem + 1} of {totalAmountOfReviews}{" "}
        results
      </p>

      <div className="row">
        {reviews.map((review) => (
          <Review review={review} key={review.id} />
        ))}
      </div>
      <Pagination
        paginate={paginate}
        currentPage={currentPage}
        totalPages={totalPages}
      />
    </div>
  );
}
