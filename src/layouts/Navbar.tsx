import { Link, NavLink } from "react-router-dom";
import {
  SignInButton,
  SignOutButton,
  SignUpButton,
  useAuth,
  useUser,
} from "@clerk/clerk-react";
import { useEffect } from "react";

export default function Navbar() {
  const { user } = useUser();
  const { isLoaded, isSignedIn, getToken, has } = useAuth();
  const userEmail = user?.primaryEmailAddress?.emailAddress;
  const canManage = has?.({ role: "org:admin" });

  async function checkUserExist(token: any, email: any): Promise<boolean> {
    // const token = await getToken();
    const response = await fetch(
      `${process.env.REACT_APP_API}/users/secure/all`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch users: ${response.statusText}`);
    }

    const users: { id: number; email: string }[] = await response.json();
    const ifExists = users.some((user) => user.email === email);
    // if (ifExists) console.log("User exists");
    // else {
    // console.log("User does not exists");
    // }
    return ifExists;
  }

  useEffect(() => {
    const addNewUser = async () => {
      if (!isSignedIn) return;

      try {
        const token = await getToken();
        // console.log(token);
        const userExists = await checkUserExist(token, userEmail);
        if (userExists) return;

        const response = await fetch(
          `${process.env.REACT_APP_API}/users/secure/addnew`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
              "User-Email": userEmail || "",
            },
          }
        );
        if (response.ok) {
          const result = await response.json();
          console.log("New user added successfully:", result);
        }
      } catch (error) {
        console.error("Error adding new user:", error);
      }
    };

    addNewUser();
  }, [isSignedIn, isLoaded, user, getToken]);

  return (
    <nav className="navbar navbar-expand-lg navbar-light main-color py-3">
      <div className="container-fluid">
        <Link to={"/home"} className="text-decoration-none">
          <span className="navbar-brand">Luv 2 Read</span>
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNavDropdown"
          aria-controls="navbarNavDropdown"
          aria-expanded="false"
          aria-label="Toggle Navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNavDropdown">
          <ul className="navbar-nav">
            <li className="nav-item">
              <NavLink className="nav-link fw-bold" to="/home">
                Home
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link fw-bold" to="/search">
                Search Books
              </NavLink>
            </li>
            {isSignedIn && (
              <>
                <li className="nav-item">
                  <NavLink className="nav-link fw-bold" to="/messages">
                    Library Services
                  </NavLink>
                </li>

                <li className="nav-item">
                  <NavLink className="nav-link fw-bold" to="/shelf">
                    Shelf
                  </NavLink>
                </li>

                <li className="nav-item">
                  <NavLink className="nav-link fw-bold" to="/payment">
                    Pay fees
                  </NavLink>
                </li>
              </>
            )}

            {isSignedIn && canManage && (
              <li className="nav-item">
                <NavLink className="nav-link fw-bold" to="/admin">
                  Admin
                </NavLink>
              </li>
            )}
          </ul>
          <ul className="navbar-nav ms-auto">
            {!isSignedIn && (
              <li className="nav-item m-1">
                <SignUpButton>
                  <Link
                    type="button"
                    to={window.location.href}
                    className="btn btn-light"
                    onClick={() => {
                      // console.log("SignUp button clicked");
                      // setJustSignedUp(true);
                    }}
                  >
                    Sign up
                  </Link>
                </SignUpButton>
              </li>
            )}
            <li className="nav-item m-1">
              {isSignedIn ? (
                <>
                  <span className="me-3">{userEmail}</span>
                  <SignOutButton>
                    <Link
                      type="button"
                      to="/"
                      className="btn btn-outline-dark btn-color text-white"
                    >
                      Log Out
                    </Link>
                  </SignOutButton>
                </>
              ) : (
                <SignInButton>
                  <Link
                    type="button"
                    to="/home"
                    className="btn btn-outline-dark btn-color text-white"
                  >
                    Log In
                  </Link>
                </SignInButton>
              )}
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}
