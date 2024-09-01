import React, { useEffect, useState } from "react";
import BookModel from "../../models/BookModel";
import Spinner from "../Utils/Spinner";
import SearchBook from "./components/SearchBook";
import Pagination from "../Utils/Pagination";
import { Link } from "react-router-dom";

export default function SearchBooksPage() {
  const [books, setBooks] = useState<BookModel[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [httpError, setHttpError] = useState(null);

  const [booksPerPage] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);
  const [BooksTotalNum, setBooksTotalNum] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const baseUrl: string = `${process.env.REACT_APP_API}/books`;

  useEffect(() => {
    async function fetchBooks() {
      let url = `${baseUrl}?page=${currentPage - 1}&size=${booksPerPage}`;

      if (search) {
        setCategory("");
        url = `${baseUrl}/search/findByTitleContaining?title=${search}&page=${
          currentPage - 1
        }&size=${booksPerPage}`;
      }

      if (category) {
        setSearch("");
        url = `${baseUrl}/search/findByCategory?category=${category}&page=${
          currentPage - 1
        }&size=${booksPerPage}`;
      }

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
  }, [currentPage, search, category]);

  if (isLoading) return <Spinner />;

  if (httpError)
    return (
      <div className="container m-5">
        <p>❌❌{httpError}</p>
      </div>
    );

  const categoryOptions = [
    { value: "", label: "Category" },
    { value: "fe", label: "Front End" },
    { value: "be", label: "Back End" },
    { value: "Data", label: "Data" },
    { value: "DevOps", label: "DevOps" },
  ];

  const indexOfLastBook = currentPage * booksPerPage;
  const indexOfFirstBook = indexOfLastBook - booksPerPage + 1;
  const lastItem =
    currentPage * booksPerPage < BooksTotalNum
      ? currentPage * booksPerPage
      : BooksTotalNum;

  return (
    <div>
      <div className="container">
        <div>
          <div className="row mt-5">
            <div className="col-md-4 col-lg-4 col-6">
              <div className="d-flex">
                <input
                  className="form-control me-md-2"
                  type="search"
                  placeholder="Search"
                  aria-labelledby="Search"
                  onChange={(e) => {
                    setSearch(e.target.value);
                    setCurrentPage(1);
                  }}
                  value={search}
                />
              </div>
            </div>
            <div className="col-md-3 col-lg-3 col-5 d-flex">
              <select
                className="form-select"
                onChange={(e) => {
                  setCategory(e.target.value);
                  setCurrentPage(1);
                }}
                value={category}
              >
                {categoryOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
          {BooksTotalNum > 0 ? (
            <>
              <div className="mt-3">
                <h4>Number of results: {BooksTotalNum}</h4>
              </div>
              <p>
                {indexOfFirstBook} to {lastItem} of {BooksTotalNum} items
              </p>
              {books.map((book) => (
                <SearchBook book={book} key={book.id} />
              ))}
            </>
          ) : (
            <div className="m-5">
              <h3>Can't find what you are looking for?</h3>
              <Link
                type="button"
                className="btn btn-lg btn-color fw-bold text-white px-4"
                to={"/messages"}
              >
                Library services
              </Link>
            </div>
          )}
          {totalPages > 1 && (
            <Pagination
              paginate={setCurrentPage}
              currentPage={currentPage}
              totalPages={totalPages}
            />
          )}
        </div>
      </div>
    </div>
  );
}
