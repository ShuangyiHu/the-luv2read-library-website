import "./App.css";
import { Routes, Route, Navigate } from "react-router-dom";
import { ClerkProvider } from "@clerk/clerk-react";
import Footer from "./layouts/Footer";
import Navbar from "./layouts/Navbar";
import SearchBooksPage from "./layouts/SearchBooksPage/SearchBooksPage-v2";
import BookCheckoutPage from "./layouts/BookCheckoutPage/BookCheckoutPage";
import ReviewListPage from "./layouts/BookCheckoutPage/ReviewListPage/ReviewListPage";
import ShelfPage from "./layouts/ShelfPage/ShelfPage";
import MessagesPage from "./layouts/MessagesPage/MessagesPage";
import ManageLibraryPage from "./layouts/ManageLibraryPage/ManageLibraryPage";
import PaymentPage from "./layouts/PaymentPage/PaymentPage";
import Homepage from "./layouts/Homepage/Homepage";

const publishableKey =
  "pk_test_c3VwcmVtZS1kb3ZlLTI1LmNsZXJrLmFjY291bnRzLmRldiQ";

function App() {
  if (!publishableKey) {
    throw new Error(
      "Missing Clerk publishable key. Ensure NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY is set in your environment variables."
    );
  }

  return (
    <ClerkProvider publishableKey={publishableKey}>
      <div className="d-flex flex-column min-vh-100">
        <Navbar />
        <div className="flex-grow-1">
          <Routes>
            <Route path="/" element={<Navigate to="/home" />} />
            <Route path="/home" element={<Homepage />} />
            <Route path="/search" element={<SearchBooksPage />} />
            <Route path="/checkout/:bookId" element={<BookCheckoutPage />} />
            <Route path="/reviewlist/:bookId" element={<ReviewListPage />} />
            <Route path="/shelf" element={<ShelfPage />} />
            <Route path="/messages" element={<MessagesPage />} />
            <Route path="/admin" element={<ManageLibraryPage />} />
            <Route path="/payment" element={<PaymentPage />} />
          </Routes>
        </div>
        <Footer />
      </div>
    </ClerkProvider>
  );
}

export default App;
