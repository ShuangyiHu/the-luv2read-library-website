import BookModel from "../../../models/BookModel";

export default function LoansModal(props: {
  book: BookModel;
  daysLeft: number;
  returnBook: any;
  renewLoan: any;
}) {
  return (
    <div
      className="modal fade"
      id={`modal${props.book.id}`}
      data-bs-backdrop="static"
      data-bs-keyboard="false"
      aria-labelledby="staticBackdropLabel"
      aria-hidden="true"
      key={props.book.id}
    >
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title" id="staticBackdropLabel">
              Loan Options
            </h5>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div className="modal-body">
            <div className="container">
              <div className="mt-3">
                <div className="row">
                  <div className="col-2">
                    {props.book.img ? (
                      <img
                        src={props.book.img}
                        width={56}
                        alt={`Cover of ${props.book.title}`}
                      />
                    ) : (
                      <img
                        src={require("./../../../Images/BooksImages/book-luv2code-1000.png")}
                        width={56}
                        alt={`Default book cover`}
                      />
                    )}
                  </div>
                  <div className="col-10">
                    <h6>{props.book.author}</h6>
                    <h4>{props.book.title}</h4>
                  </div>
                </div>
                <hr />
                {props.daysLeft > 0 && (
                  <p className="text-secondary">
                    Due in {props.daysLeft}{" "}
                    {props.daysLeft === 1 ? "day" : "days"}.
                  </p>
                )}

                {props.daysLeft === 0 && (
                  <p className="text-success">Due today.</p>
                )}

                {props.daysLeft < 0 && (
                  <p className="text-danger">
                    Past due {-props.daysLeft}{" "}
                    {-props.daysLeft === 1 ? "day" : "days"}.
                  </p>
                )}
                <div className="list-group mt-3">
                  <button
                    className="list-group-item list-group-item-action"
                    aria-current="true"
                    data-bs-dismiss="modal"
                    onClick={() => props.returnBook(props.book.id)}
                  >
                    Return Book
                  </button>
                  <button
                    className={`list-group-item list-group-item-action ${
                      props.daysLeft < 0 ? "inactiveLink" : ""
                    }`}
                    aria-current="true"
                    data-bs-dismiss="modal"
                    onClick={() =>
                      props.renewLoan(props.book.id, props.daysLeft)
                    }
                    disabled={props.daysLeft < 0}
                  >
                    {props.daysLeft < 0
                      ? "Late dues cannot be renewed"
                      : "Renew loan for 15 days"}
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary"
              data-bs-dismiss="modal"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
