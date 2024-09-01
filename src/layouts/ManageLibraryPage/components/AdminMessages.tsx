import { useAuth, useUser } from "@clerk/clerk-react";
import React, { useEffect, useState } from "react";
import MessageModel from "../../../models/MessageModel";
import Spinner from "../../Utils/Spinner";
import Pagination from "../../Utils/Pagination";
import AdminMessage from "./AdminMessage";

export default function AdminMessages() {
  //user info
  const { isSignedIn, getToken } = useAuth();
  // const { user } = useUser();
  // const userEmail = user?.primaryEmailAddress?.emailAddress;

  //
  const [isLoading, setIsLoading] = useState(true);
  const [httpError, setHttpError] = useState(null);

  //
  const [messages, setMessages] = useState<MessageModel[]>([]);
  const [isResponseSubmitted, setIsResponseSubmitted] = useState(false);

  //pagination
  const [messagesPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalAmountOfMessages, setTotalAmountOfMessages] = useState(0);

  useEffect(() => {
    async function fetchAdminMessages() {
      if (isSignedIn) {
        const url = `${
          process.env.REACT_APP_API
        }/messages/secure/admin?closed=false&size=${messagesPerPage}&page=${
          currentPage - 1
        }`;
        const token = await getToken();
        const response = await fetch(url, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
            // "User-Email": userEmail || "",
          },
        });

        if (!response.ok) {
          throw new Error("Error fetching messages");
        }
        const data = await response.json();
        setMessages(data.content);
        setTotalPages(data.totalPages);
        setTotalAmountOfMessages(data.totalElements);
      }
      setIsLoading(false);
    }

    fetchAdminMessages().catch((error: any) => {
      setIsLoading(false);
      setHttpError(error.message);
    });
    window.scrollTo(0, 0);
  }, [isSignedIn, currentPage, isResponseSubmitted]);

  if (isLoading) return <Spinner />;
  if (httpError)
    return (
      <div className="container m-5">
        <p>❌❌{httpError}</p>
      </div>
    );
  function paginate(pageNumber: number) {
    setCurrentPage(pageNumber);
  }

  const firstItemOnPage = (currentPage - 1) * 5 + 1;
  const lastItemOnPage =
    (currentPage - 1) * 5 + messages.length > totalAmountOfMessages
      ? totalAmountOfMessages
      : (currentPage - 1) * 5 + messages.length;

  return (
    <div className="my-3">
      {messages.length > 0 && (
        <p>
          Showing {firstItemOnPage} to {lastItemOnPage} of{" "}
          {totalAmountOfMessages} messages
        </p>
      )}
      {messages.length > 0 ? (
        <>
          <h5>Pending Q/A: </h5>
          {messages.map((message) => (
            <AdminMessage
              message={message}
              key={message.id}
              setIsResponseSubmitted={setIsResponseSubmitted}
            />
          ))}
        </>
      ) : (
        <h5>No pending Q/A</h5>
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
