import { useEffect, useState } from "react";
import ReturnBook from "./ReturnBook";
import BookModel from "../../../models/BookModel";
import Spinner from "../../Utils/Spinner";
import { Link } from "react-router-dom";

export default function Carousel() {
  const [books, setBooks] = useState<BookModel[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [httpError, setHttpError] = useState(null);

  useEffect(() => {
    async function fetchBooks() {
      const url: string = `${process.env.REACT_APP_API}/books?page=0&size=9`;

      const response = await fetch(url);
      if (!response.ok)
        throw new Error("Something went wrong fetching books on the carousel.");

      const data = await response.json();
      const booksFromDB = data._embedded.books;
      const booksForUser: BookModel[] = [];

      for (const book of booksFromDB) {
        const {
          id,
          title,
          author,
          description,
          copies,
          copiesAvailable,
          category,
          img,
          rating,
        } = book;

        booksForUser.push(
          new BookModel(
            id,
            title,
            author,
            description,
            copies,
            copiesAvailable,
            category,
            img,
            rating
          )
        );
      }
      setIsLoading(false);
      setBooks(booksForUser);
    }

    fetchBooks().catch((error: any) => {
      setIsLoading(false);
      setHttpError(error.message);
    });
  }, []);

  if (isLoading) return <Spinner />;
  if (httpError)
    return (
      <div className="container m-5">
        <p>❌❌{httpError}</p>
      </div>
    );

  return (
    <div className="container mt-5">
      <div className="homepage-carousel-title">
        <h2 className="display-7">
          Find your next "I stayed up too late reading" book.
        </h2>
      </div>
      <div
        id="carouselExampleControls"
        className="carousel carousel-dark slide d-none d-md-block mt-5"
        data-bs-interval="false"
      >
        {/* Desktop */}
        <div className="carousel-inner ">
          <div className="carousel-item active ">
            <div className="row d-flex justify-content-center align-items-center">
              {books.slice(0, 3).map((book) => (
                <ReturnBook screenSize="desktop" book={book} key={book.id} />
              ))}
            </div>
          </div>
          <div className="carousel-item ">
            <div className="row d-flex justify-content-center align-items-center">
              {books.slice(3, 6).map((book) => (
                <ReturnBook screenSize="desktop" book={book} key={book.id} />
              ))}
            </div>
          </div>
          <div className="carousel-item ">
            <div className="row d-flex justify-content-center align-items-center">
              {books.slice(6, 9).map((book) => (
                <ReturnBook screenSize="desktop" book={book} key={book.id} />
              ))}
            </div>
          </div>
        </div>
        <button
          className="carousel-control-prev"
          type="button"
          data-bs-target="#carouselExampleControls"
          data-bs-slide="prev"
        >
          <span
            className="carousel-control-prev-icon"
            aria-hidden="true"
          ></span>
          <span className="visually-hidden">Previous</span>
        </button>
        <button
          className="carousel-control-next"
          type="button"
          data-bs-target="#carouselExampleControls"
          data-bs-slide="next"
        >
          <span
            className="carousel-control-next-icon"
            aria-hidden="true"
          ></span>
          <span className="visually-hidden">Next</span>
        </button>
      </div>

      {/* Mobile */}
      <div className="d-md-none mt-3">
        <div className="d-flex flex-column justify-content-center align-items-center">
          {books.slice(0, 3).map((book) => (
            <ReturnBook screenSize="mobile" book={book} key={book.id} />
          ))}
        </div>
      </div>
      <div className="homepage-carousel-title mt-3">
        <Link className="btn btn-outline-secondary btn-lg" to="/search">
          View More
        </Link>
      </div>
    </div>
  );
}
