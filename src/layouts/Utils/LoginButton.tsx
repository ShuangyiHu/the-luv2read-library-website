import { SignInButton, useAuth, useUser } from "@clerk/clerk-react";
import React from "react";

export default function LoginButton(props: { children: any }) {
  const { isSignedIn, getToken } = useAuth();
  const { user } = useUser();
  return <SignInButton>{props.children}</SignInButton>;
}
