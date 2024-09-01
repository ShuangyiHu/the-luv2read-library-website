import Spinner from "../../Utils/Spinner";
import { Link } from "react-router-dom";
import { SignInButton, useAuth, useSignIn } from "@clerk/clerk-react";

export default function LibraryServices() {
  const { isSignedIn } = useAuth();

  return (
    <div className="container my-5">
      <div className="row p-4 align-items-center border shadow-lg">
        <div className="col-lg-7 p-3">
          <h2 className="display-5 fw-bold">
            Can't find what you are looking for?
          </h2>
          <p className="lead">
            If you cannot find what you are looking for, send our library admins
            a personal message!
          </p>
          <div className="d-grid gap-2 justify-content-md-start mb-4 mb-lg-3">
            {isSignedIn ? (
              <Link
                type="button"
                className="btn btn-lg btn-color text-white"
                to="/messages"
              >
                Library services
              </Link>
            ) : (
              <SignInButton>
                <Link
                  type="button"
                  className="btn btn-lg btn-color text-white"
                  to="login"
                >
                  Log in
                </Link>
              </SignInButton>
            )}
          </div>
        </div>
        <div className="lost-image col-lg-4 offset-lg-1 shadow-lg"></div>
      </div>
    </div>
  );
}
