import { useAuth, useUser } from "@clerk/clerk-react";
import React, { useEffect, useState } from "react";
import HistoryModel from "../../../models/HistoryModel";
import { error } from "console";
import Spinner from "../../Utils/Spinner";
import { signedIn } from "@clerk/backend/dist/tokens/authStatus";
import { Link } from "react-router-dom";
import Pagination from "../../Utils/Pagination";
import History from "./History";

export default function HistoryPage(props: { isBookReturned: boolean }) {
  //user info
  const { isSignedIn, getToken } = useAuth();
  const { user } = useUser();
  const userEmail = user?.primaryEmailAddress?.emailAddress;

  //util states
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);
  const [httpError, setHttpError] = useState(null);

  //histories per page
  const [histories, setHistories] = useState<HistoryModel[]>([]);

  //pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalAmountOfHistories, setTotalAmountOfHistories] = useState(0);

  useEffect(() => {
    async function fetchUserHistory() {
      setIsLoadingHistory(true);
      if (isSignedIn) {
        const url = `${
          process.env.REACT_APP_API
        }/users/secure/history/user?page=${currentPage - 1}&size=5`;

        const token = await getToken();
        const response = await fetch(url, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
            "User-Email": userEmail || "",
          },
        });
        if (!response.ok) {
          throw new Error("Error fetching user history");
        }
        const data = await response.json();
        // console.log(data);
        setHistories(data.content);
        setTotalPages(data.totalPages);
        setTotalAmountOfHistories(data.totalElements);
      }
      setIsLoadingHistory(false);
    }

    fetchUserHistory().catch((error: any) => {
      setIsLoadingHistory(false);
      setHttpError(error.message);
    });
  }, [isSignedIn, currentPage, props.isBookReturned]);

  if (isLoadingHistory) return <Spinner />;
  if (httpError)
    return (
      <div className="container m-5">
        <p>{httpError}</p>
      </div>
    );

  function paginate(pageNumber: number) {
    setCurrentPage(pageNumber);
  }

  const firstItemOnPage = (currentPage - 1) * 5 + 1;
  const lastItemOnPage =
    (currentPage - 1) * 5 + histories.length > totalAmountOfHistories
      ? totalAmountOfHistories
      : (currentPage - 1) * 5 + histories.length;

  return (
    <div className="my-5">
      {histories.length > 0 ? (
        <>
          <h5>Recent History: </h5>
          <p>
            Showing {firstItemOnPage} to {lastItemOnPage} of{" "}
            {totalAmountOfHistories} results
          </p>
          {histories.map((history) => {
            return <History history={history} key={history.id} />;
          })}
        </>
      ) : (
        <>
          <div className="m-5">
            <h3 className="my-3">Currently no history</h3>
            <Link to={"/search"} className="btn main-color text-black">
              Search for a new book
            </Link>
          </div>
        </>
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
