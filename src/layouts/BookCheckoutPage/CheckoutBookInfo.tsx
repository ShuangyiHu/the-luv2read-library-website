import BookModel from "../../models/BookModel";
import StarReview from "../Utils/StarReview";

function CheckoutBookInfo(props: {
  book: BookModel | undefined;
  rating: number;
}) {
  return (
    <>
      <div className="col-auto">
        {props.book?.img ? (
          <img
            className="mx-100"
            src={props.book.img}
            width={196}
            alt={`Cover of book ${props.book?.title}`}
          />
        ) : (
          <img
            className="mw-100"
            src={require("../../Images/BooksImages/book-luv2code-1000.png")}
            width={196}
            alt="Default book cover"
          />
        )}
      </div>
      <div className=" col-lg-5 col-md-6 col-sm-12 col-xs-12 d-flex flex-column p-2 mx-lg-5 mx-md-2 mx-md-1 mt-3">
        <h4 className="display-7">{props.book?.title}</h4>
        <h5 className="text-primary">{props.book?.author}</h5>
        <p className="py-2">{props.book?.description}</p>
        <StarReview rating={props.rating || 0} size={32} color="gold" />
      </div>
    </>
  );
}

export default CheckoutBookInfo;
