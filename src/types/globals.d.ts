export {};

declare global {
  interface ClerkAuthorization {
    permission: "";
    role: "org:admin" | "org:member";
    NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: "pk_test_c3VwcmVtZS1kb3ZlLTI1LmNsZXJrLmFjY291bnRzLmRldiQ";
    CLERK_SECRET_KEY: "sk_test_kozSDrCvZXb1pf1YqAK2WUy3ltpV4BZwEFirOATMIj";
  }
}
