import { useEffect, useState } from "react";
import BookModel from "../../../models/BookModel";
import Spinner from "../../Utils/Spinner";
import Pagination from "../../Utils/Pagination";
import ChangeBookQuantity from "./ChangeBookQuantity";

export default function ChangeBooksQuantity() {
  const [books, setBooks] = useState<BookModel[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [httpError, setHttpError] = useState(null);

  const [booksPerPage] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);
  const [booksTotalNum, setBooksTotalNum] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const [clickDelete, setClickDelete] = useState(false);
  const baseUrl: string = `${process.env.REACT_APP_API}/books`;

  useEffect(() => {
    async function fetchBooks() {
      let url = `${baseUrl}?page=${currentPage - 1}&size=${booksPerPage}`;

      const response = await fetch(url);
      if (!response.ok) throw new Error("Something went wrong fetching books.");

      const data = await response.json();
      // console.log(data);

      const booksFromDB = data._embedded.books;
      setBooksTotalNum(data.page.totalElements);
      setTotalPages(data.page.totalPages);

      const booksForUser: BookModel[] = booksFromDB.map((book: any) => ({
        id: book.id,
        title: book.title,
        author: book.author,
        description: book.description,
        copies: book.copies,
        copiesAvailable: book.copiesAvailable,
        category: book.category,
        img: book.img,
      }));

      setIsLoading(false);
      setBooks(booksForUser);
    }

    fetchBooks().catch((error: any) => {
      setIsLoading(false);
      setHttpError(error.message);
    });

    window.scrollTo(0, 0);
  }, [currentPage, clickDelete]);

  const indexOfLastBook = currentPage * booksPerPage;
  const indexOfFirstBook = indexOfLastBook - booksPerPage + 1;
  const lastItem =
    currentPage * booksPerPage < booksTotalNum
      ? currentPage * booksPerPage
      : booksTotalNum;

  function paginate(pageNumber: number) {
    setCurrentPage(pageNumber);
  }

  if (isLoading) return <Spinner />;

  if (httpError)
    return (
      <div className="container m-5">
        <p>❌❌{httpError}</p>
      </div>
    );
  return (
    <div className="container my-5">
      {booksTotalNum > 0 ? (
        <>
          <div className="mt-3">
            <h3>Number of results: ({booksTotalNum})</h3>
          </div>
          <p>
            {indexOfFirstBook} to {lastItem} of {booksTotalNum} items:
          </p>
          {books.map((book) => (
            <ChangeBookQuantity
              book={book}
              key={book.id}
              setClickDelete={setClickDelete}
            />
          ))}
        </>
      ) : (
        <h5>Add a book before changing quantity</h5>
      )}
      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          paginate={paginate}
        />
      )}
    </div>
  );
}
