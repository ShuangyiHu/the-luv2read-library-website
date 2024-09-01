import React from "react";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <div className="main-color">
      <footer className="container d-flex flex-wrap justify-content-between align-items-center py-5 main-color">
        <p className="col-md-4 mb-0 text-black">@Example Library App, Inc</p>
        <ul className="nav navbar-dark col-md-4 justify-content-end text-black">
          <li className="nav-item ">
            <Link to="/home" className="nav-link px-2 fw-bold ">
              Home
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/search" className="nav-link px-2 fw-bold">
              Search books
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/messages" className="nav-link px-2 fw-bold">
              Library Services
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/shelf" className="nav-link px-2 fw-bold">
              Shelf
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/payment" className="nav-link px-2 fw-bold">
              Pay Fees
            </Link>
          </li>
        </ul>
      </footer>
    </div>
  );
}
