import {
  SignedIn,
  SignedOut,
  SignInButton,
  useAuth,
  useUser,
} from "@clerk/clerk-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Spinner from "../Utils/Spinner";
import LoanedBook from "./components/LoanedBook";
import HistoryPage from "./components/HistoryPage";

export default function ShelfPage() {
  //User state
  const { isSignedIn, getToken } = useAuth();
  const { user } = useUser();
  const userEmail = user?.primaryEmailAddress?.emailAddress;

  const [isLoading, setIsLoading] = useState(true);
  const [httpError, setHttpError] = useState(null);
  const [currentLoans, setCurrentLoans] = useState<any[]>([]);

  const [isBookReturned, setIsBookReturned] = useState(false);
  const [isBookRenewed, setIsBookRenewed] = useState(false);

  useEffect(() => {
    async function fetchUserCurrentLoans() {
      if (isSignedIn) {
        const url: string = `${process.env.REACT_APP_API}/users/secure/currentloans/user`;
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
            "Something went wrong fetching the current loans of user."
          );
        const data = await response.json();
        // console.log(data);
        setIsLoading(false);
        setCurrentLoans(data);
      }
    }

    fetchUserCurrentLoans().catch((error: any) => {
      setIsLoading(false);
      setHttpError(error.message);
    });
  }, [isSignedIn, isBookReturned, isBookRenewed]);

  async function returnBook(bookId: number) {
    setIsBookReturned(false);
    const url = `${process.env.REACT_APP_API}/books/secure/return?bookId=${bookId}`;

    const token = await getToken();

    const response = await fetch(url, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "User-Email": userEmail || "",
      },
    });
    if (!response.ok) throw new Error("Error returning book.");
    setCurrentLoans(currentLoans.filter((loan) => loan.book.id !== bookId));
    setIsBookReturned(true);
  }

  async function renewLoan(bookId: number, daysLeft: number) {
    setIsBookRenewed(false);
    const url = `${process.env.REACT_APP_API}/books/secure/renew?bookId=${bookId}`;

    const token = await getToken();

    const response = await fetch(url, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        "User-Email": userEmail || "",
      },
      body: JSON.stringify(daysLeft),
    });

    if (!response.ok) throw new Error("Error renewing loan.");
    setIsBookRenewed(true);
  }

  if (isLoading) return <Spinner />;
  if (httpError)
    return (
      <div className="container m-5">
        <p>❌❌{httpError}</p>
      </div>
    );
  return (
    <>
      <SignedIn>
        <div className="container">
          <div className="mt-3">
            <nav>
              <div className="nav nav-tabs" id="nav-tab" role="tablist">
                <button
                  className="nav-link active"
                  id="nav-loans-tab"
                  data-bs-toggle="tab"
                  data-bs-target="#nav-loans"
                  type="button"
                  role="tab"
                  aria-controls="nav-loans"
                  aria-selected="true"
                >
                  Loans
                </button>
                <button
                  className="nav-link"
                  id="nav-history-tab"
                  data-bs-toggle="tab"
                  data-bs-target="#nav-history"
                  type="button"
                  role="tab"
                  aria-controls="nav-history"
                  aria-selected="false"
                >
                  Your history
                </button>
              </div>
            </nav>
            <div className="tab-content" id="nav-tabContent">
              <div
                className="tab-pane fade show active"
                id="nav-loans"
                role="tabpanel"
                aria-labelledby="nav-loans-tab"
              >
                <div className="mt-2">
                  {currentLoans.length > 0 ? (
                    <>
                      <h5>Current Loans:</h5>
                      {currentLoans.map((loan) => (
                        <LoanedBook
                          key={loan.book.title}
                          book={loan.book}
                          daysLeft={loan.daysLeft}
                          returnBook={returnBook}
                          renewLoan={renewLoan}
                        />
                      ))}
                    </>
                  ) : (
                    <div className="m-5">
                      <h3 className="my-3">Currently no loans</h3>
                      <Link
                        to={"/search"}
                        className="
                        btn main-color text-black"
                      >
                        Search for a new book
                      </Link>
                    </div>
                  )}
                </div>
              </div>
              <div
                className="tab-pane fade"
                id="nav-history"
                role="tabpanel"
                aria-labelledby="nav-history-tab"
              >
                <HistoryPage isBookReturned={isBookReturned} />
              </div>
            </div>
          </div>
        </div>
      </SignedIn>
      <SignedOut>
        <div className="container mt-5 p-5 border">
          <h3>Please log in to view the shelf page.</h3>
          <SignInButton>
            <Link
              type="button"
              to="/shelf"
              className="btn btn-outline-dark btn-color text-white"
            >
              Log In
            </Link>
          </SignInButton>
        </div>
      </SignedOut>
    </>
  );
}
