import StarReview from "./StarReview";

export default function LeaveAReview(props: {
  handleSelect: any;
  rating: number;
  setReviewDescription: any;
  postUserReview: any;
}) {
  function handleSubmit() {}
  return (
    <div className="dropdown">
      <h5
        className="dropdown-toggle"
        style={{ cursor: "pointer" }}
        id="dropdownMenuButton1"
        data-bs-toggle="dropdown"
      >
        {props.rating !== 0
          ? `Your rating: ${props.rating} star${props.rating > 1 ? "s" : ""}`
          : "Leave a review?"}
      </h5>
      <ul
        id="submitReviewRating"
        className="dropdown-menu"
        aria-labelledby="dropdownMenuButton1"
      >
        {Array.from({ length: 10 }, (_, i) => (i + 1) * 0.5).map((star) => (
          <li key={star}>
            <button
              className="dropdown-item btn-md"
              onClick={() => props.handleSelect(() => star)}
            >
              {star} {star > 1 ? "stars" : "star"}
            </button>
          </li>
        ))}
      </ul>
      <StarReview rating={props.rating} size={32} color="gold" />
      {props.rating !== 0 && (
        <form
          method="POST"
          action="#"
          //   onSubmit={(e) => {
          //     e.preventDefault();
          //     props.postUserReview();
          //   }}
        >
          <hr />
          <div className="mb-3">
            <label className="form-label">Description</label>
            <textarea
              className="form-control"
              id="submitReviewDescription"
              rows={3}
              placeholder="Optional"
              onChange={(e) => props.setReviewDescription(e.target.value)}
            ></textarea>
            <button
              type="button"
              className="btn btn-color text-white mt-3"
              onClick={() => props.postUserReview()}
            >
              Submit Review
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
