import React from "react";
import MessageModel from "../../../models/MessageModel";

export default function Message(props: { message: MessageModel }) {
  return (
    <div className="card mt-2 shadow p-3 bg-body rounded">
      <h5 className="text-success">
        {props.message.closed ? (
          <span className="btn-sm btn-success me-3">Closed</span>
        ) : (
          <span className="btn-sm btn-warning me-3">Pending</span>
        )}
        Case #{props.message.id}: {props.message.title}{" "}
      </h5>

      <h6>{props.message.userEmail}</h6>
      <p className="ps-2">{props.message.question}</p>
      <hr />
      <div>
        <h5 className="text-primary">Response: </h5>
        {props.message.response && props.message.adminEmail ? (
          <>
            <h6>{props.message.adminEmail} (Admin)</h6>
            <p>{props.message.response}</p>
          </>
        ) : (
          <p className="ps-2">
            <i>
              Pending response from administration. Thank you for your patience.
            </i>
          </p>
        )}
      </div>
    </div>
  );
}
