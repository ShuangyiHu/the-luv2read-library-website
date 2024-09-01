import React from "react";

export default function Spinner() {
  return (
    <div
      className="m-5 d-flex justify-content-center align-items-center"
      style={{ height: 550 }}
    >
      <span className="spinner-border text-primary" role="status">
        <div className="visually-hidden">Loading...</div>
      </span>
    </div>
  );
}
