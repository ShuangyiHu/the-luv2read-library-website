import { useAuth, useUser } from "@clerk/clerk-react";
import React, { useEffect, useState } from "react";
import AddBookRequest from "../../../models/AddBookRequest";

export default function AddNewBook() {
  //User
  const { isSignedIn, getToken } = useAuth();
  const { user } = useUser();
  const adminEmail = user?.primaryEmailAddress?.emailAddress;

  //New book
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [description, setDescription] = useState("");
  const [copies, setCopies] = useState(0);
  const [category, setCategory] = useState("Category");
  const [selectedImg, setSelectedImg] = useState<any>(null);

  //Displays
  const [displayWarning, setDisplayWarning] = useState(false);
  const [displaySuccess, setDisplaySuccess] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const categoryOptions = [
    { value: "", label: "------" },
    { value: "fe", label: "Front End" },
    { value: "be", label: "Back End" },
    { value: "Data", label: "Data" },
    { value: "DevOps", label: "DevOps" },
  ];

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, [isVisible]);

  async function base64ConversionForImages(e: any) {
    if (e.target.files[0]) {
      getBase64(e.target.files[0]);
    }
  }

  async function getBase64(file: any) {
    let reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = function () {
      setSelectedImg(reader.result);
    };

    reader.onerror = function (err) {
      console.log("Error getting selected image:", err);
    };
  }
  async function submitNewBook() {
    const url = `${process.env.REACT_APP_API}/admin/secure/add/book`;

    if (
      isSignedIn &&
      title !== "" &&
      title !== "" &&
      author !== "" &&
      category !== "" &&
      description !== "" &&
      copies >= 0
    ) {
      const book: AddBookRequest = new AddBookRequest(
        title,
        author,
        description,
        copies,
        category
      );
      book.img = selectedImg;

      const token = await getToken();

      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          "Admin-Email": adminEmail || "",
        },
        body: JSON.stringify(book),
      });

      if (!response.ok) {
        throw new Error("Error adding new book");
      }
      setTitle("");
      setAuthor("");
      setCategory("");
      setDescription("");
      setCopies(0);
      setSelectedImg(null);
      setDisplayWarning(false);
      setDisplaySuccess(true);
      setIsVisible(true);
    } else {
      setDisplayWarning(true);
      setDisplaySuccess(false);
      setIsVisible(true);
    }
  }

  return (
    <div className="container my-5">
      <div className="card">
        <div className="card-header">Add a new book</div>
        <div className="card-body">
          <form method="POST">
            <div className="row">
              {isVisible && displaySuccess && (
                <div className="alert alert-success" role="alert">
                  Question added successfully
                </div>
              )}
              {isVisible && displayWarning && (
                <div className="alert alert-danger" role="alert">
                  ❗️ All fields must be filled out
                </div>
              )}
              <div className="col-md-6 mb-3">
                <label className="form-label">Title</label>
                <input
                  type="text"
                  className="form-control"
                  name="title"
                  placeholder="title"
                  onChange={(e) => setTitle(e.target.value)}
                  value={title}
                  required
                />
              </div>
              <div className="col-md-3 mb-3">
                <label className="form-label">Author</label>
                <input
                  type="text"
                  className="form-control"
                  name="author"
                  placeholder="author"
                  onChange={(e) => setAuthor(e.target.value)}
                  value={author}
                  required
                />
              </div>

              <div className="col-md-3 mb-3">
                <label className="form-label">Category</label>

                <select
                  className="form-select"
                  onChange={(e) => {
                    setCategory(e.target.value);
                  }}
                  value={category}
                >
                  {categoryOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="col-md-12 mb-3">
                <label className="form-label">Description</label>

                <textarea
                  className="form-control"
                  id="exampleFormControlTextarea1"
                  placeholder="Description"
                  rows={3}
                  onChange={(e) => {
                    setDescription(e.target.value);
                  }}
                  value={description}
                ></textarea>
              </div>

              <div className="col-md-3 mb-3">
                <label className="form-label">Copies</label>
                <input
                  type="number"
                  className="form-control"
                  name="copies"
                  placeholder="author"
                  onChange={(e) => setCopies(Number(e.target.value))}
                  value={copies}
                  required
                />
              </div>
              <input
                type="file"
                onChange={(e) => base64ConversionForImages(e)}
              />
              <div>
                <button
                  type="button"
                  className="btn btn-color text-white mt-3"
                  onClick={submitNewBook}
                >
                  Add book
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
