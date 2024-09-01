import { useAuth, useUser } from "@clerk/clerk-react";
import React, { useEffect, useState } from "react";
import MessageModel from "../../../models/MessageModel";
import Spinner from "../../Utils/Spinner";
import Pagination from "../../Utils/Pagination";
import Message from "./Message";

export default function Messages() {
  //user info
  const { isSignedIn, getToken } = useAuth();
  const { user } = useUser();
  const userEmail = user?.primaryEmailAddress?.emailAddress;

  //
  const [isLoading, setIsLoading] = useState(true);
  const [httpError, setHttpError] = useState(null);

  //
  const [messages, setMessages] = useState<MessageModel[]>([]);

  //pagination
  const [messagesPerPage] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalAmountOfMessages, setTotalAmountOfMessages] = useState(0);

  useEffect(() => {
    async function fetchUserMessages() {
      if (isSignedIn) {
        const url = `${
          process.env.REACT_APP_API
        }/messages/secure/allmessages?size=${messagesPerPage}&page=${
          currentPage - 1
        }`;
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
          throw new Error("Error fetching messages");
        }
        const data = await response.json();
        setMessages(data.content);
        setTotalPages(data.totalPages);
        setTotalAmountOfMessages(data.totalElements);
      }
      setIsLoading(false);
    }

    fetchUserMessages().catch((error: any) => {
      setIsLoading(false);
      setHttpError(error.message);
    });
    window.scrollTo(0, 0);
  }, [isSignedIn, currentPage]);

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
        messages.map((message) => (
          <Message message={message} key={message.id} />
        ))
      ) : (
        <>
          <div className="m-5">
            <h3 className="my-3">
              All questions you submit will be shown here.
            </h3>
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
