class CheckoutModel {
  id: number;
  bookId: number;
  checkoutDate: string;
  returnDate: string;

  constructor(
    id: number,
    bookId: number,
    checkoutDate: string,
    returnDate: string
  ) {
    this.id = id;
    this.bookId = bookId;
    this.checkoutDate = checkoutDate;
    this.returnDate = returnDate;
  }
}

export default CheckoutModel;
