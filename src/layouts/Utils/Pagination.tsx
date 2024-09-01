import React from "react";

export default function Pagination(props: {
  currentPage: number;
  totalPages: number;
  paginate: any;
}) {
  const pageNumbers = [];

  if (props.currentPage === 1) {
    pageNumbers.push(props.currentPage);

    if (props.totalPages >= props.currentPage + 1) {
      pageNumbers.push(2);
    }

    if (props.totalPages >= props.currentPage + 2) {
      pageNumbers.push(3);
    }
  } else if (props.currentPage > 1) {
    if (props.currentPage >= 3) {
      pageNumbers.push(props.currentPage - 2);
      pageNumbers.push(props.currentPage - 1);
    } else {
      pageNumbers.push(props.currentPage - 1);
    }
    pageNumbers.push(props.currentPage);

    if (props.totalPages >= props.currentPage + 1) {
      pageNumbers.push(props.currentPage + 1);
    }
    if (props.totalPages >= props.currentPage + 2) {
      pageNumbers.push(props.currentPage + 2);
    }
  }
  return (
    <nav aria-label="..." className="my-5">
      <ul className="pagination">
        <li className="page-item" onClick={() => props.paginate(1)}>
          <button
            className={`page-link page-btn`}
            disabled={props.currentPage === 1}
          >
            First page
          </button>
        </li>
        {pageNumbers.map((num) => (
          <li
            key={num}
            // className={`page-item ${
            //   props.currentPage === num ? "clicked" : ""
            // }`}
            className={`page-item`}
            onClick={() => props.paginate(num)}
          >
            <button
              className={`page-link page-btn ${
                props.currentPage === num ? "clicked" : ""
              }`}
            >
              {num}
            </button>
          </li>
        ))}
        <li
          className="page-item"
          onClick={() => props.paginate(props.totalPages)}
        >
          <button
            className={`page-link page-btn`}
            disabled={props.currentPage === props.totalPages}
          >
            Last page
          </button>
        </li>
      </ul>
    </nav>
  );
}
