let body = document.getElementsByTagName("body")[0];
let clearElements = (parent) => {
  parent.childNodes.forEach((node) => {
    node.remove();
  });
};
(async () => {
  let res = await fetch("https://anapioficeandfire.com/api/books");
  let books = await res.json();
  let suggestion = document.getElementById("datalist");
  books.map((book) => {
    let option = document.createElement("option");
    option.value = book.name;
    suggestion.appendChild(option);
  });
})();
let fetchBook = async (filter) => {
  try {
    let res = await fetch("https://anapioficeandfire.com/api/books");
    let books = await res.json();
    let old_data = document.getElementById("book");
    let filteredBooks = books.filter(
      (book) =>
        book.name.toLowerCase().includes(filter.toLowerCase()) && filter !== ""
    );
    clearElements(old_data);
    if (filteredBooks.length > 0) {
      filteredBooks.map(async (book) => {
        old_data.innerHTML += `<div id="loading">
        <span
          class="spinner-border spinner-border-sm"
          role="status"
          aria-hidden="true"
        ></span>
        Loading...</div>`;

        let bookContainer = createDiv(
          "book-container",
          "book-container bg-light p-5"
        );

        let bookName = createDiv(
          "bookName",
          "d-flex align-item-center justify-content-between bookDetail"
        );
        let title = createData("title", "font-weight-bold", "Book Name : ");
        let value = createData("title", "bold", book.name);
        bookName.appendChild(title);
        bookName.appendChild(value);

        let bookISBN = createDiv(
          "bookISBN",
          "d-flex align-item-center justify-content-between bookDetail"
        );
        title = createData("title", "font-weight-bold", "Book ISBN : ");
        value = createData("title", "bold", book.isbn);
        bookISBN.appendChild(title);
        bookISBN.appendChild(value);

        let bookNoOfPages = createDiv(
          "bookNoOfPages",
          "d-flex align-item-center justify-content-between bookDetail"
        );
        title = createData("title", "font-weight-bold", "No of Pages : ");
        value = createData("title", "bold", book.numberOfPages);
        bookNoOfPages.appendChild(title);
        bookNoOfPages.appendChild(value);

        let bookAuthor = createDiv(
          "bookAuthor",
          "d-flex align-item-center justify-content-between bookDetail"
        );
        title = createData("title", "font-weight-bold", "Authors : ");
        let authors = book.authors.map((author, i) => {
          if (i === 0) {
            return author;
          }
          return `, ${author}`;
        });
        value = createData("title", "bold", authors);
        bookAuthor.appendChild(title);
        bookAuthor.appendChild(value);

        let bookPublisher = createDiv(
          "bookPublisher",
          "d-flex align-item-center justify-content-between bookDetail"
        );
        title = createData("title", "font-weight-bold", "Publisher : ");
        value = createData("title", "bold", book.publisher);
        bookPublisher.appendChild(title);
        bookPublisher.appendChild(value);

        let bookReleased = createDiv(
          "bookReleased",
          "d-flex align-item-center justify-content-between bookDetail"
        );
        title = createData("title", "font-weight-bold", "Released  : ");
        value = createData("title", "bold", book.released.substring(0, 10));
        bookReleased.appendChild(title);
        bookReleased.appendChild(value);

        let bookCharacters = createDiv(
          "bookCharacters",
          "d-flex align-item-center justify-content-between bookDetail"
        );
        title = createData("title", "font-weight-bold", "Characters  : ");

        let getCharacterName = async (i) => {
          try {
            let res = await fetch(book.characters[i]);
            let data = await res.json();
            return data.name;
          } catch (err) {
            alert(err);
          }
        };
        let i = 0;
        let end = 5;
        let characters = "";
        while (i < end) {
          let name = await getCharacterName(i++);
          if (name === "") {
            end++;
          } else {
            if (i !== end) characters += name + " , ";
            else characters += name;
          }
        }

        value = createData("title", "bold", characters);
        bookCharacters.appendChild(title);
        bookCharacters.appendChild(value);

        bookContainer.appendChild(bookName);
        bookContainer.appendChild(bookISBN);
        bookContainer.appendChild(bookNoOfPages);
        bookContainer.appendChild(bookAuthor);
        bookContainer.appendChild(bookPublisher);
        bookContainer.appendChild(bookReleased);
        bookContainer.appendChild(bookCharacters);
        old_data.removeChild(document.getElementById("loading"));
        old_data.appendChild(bookContainer);
      });
    }
  } catch (err) {
    alert(err);
  }
};
let searchBooks = () => {
  fetchBook(inputField.value);
};
let createDiv = (id, className) => {
  let div = document.createElement("div");
  div.id = id;
  div.className = className;

  return div;
};
let createData = (id, className, text) => {
  let p = document.createElement("p");
  p.id = id;
  p.className = className;
  p.innerText = text;
  return p;
};
let filterContainer = document.createElement("form");
filterContainer.id = "filter-container";
filterContainer.className = "form-inline mt-5";
filterContainer.onsubmit = function (e) {
  e.preventDefault();
};
let formGroup = createDiv("form-group", "form-group searchBox w-75");
let inputField = document.createElement("input");
inputField.type = "search";
inputField.id = "search-box";
inputField.className = "form-control form-control-lg";
inputField.placeholder = "Enter your search query";
inputField.setAttribute("list", "datalist");
let suggestionBox = document.createElement("datalist");
suggestionBox.id = "datalist";
formGroup.appendChild(inputField);
formGroup.appendChild(suggestionBox);
let button = document.createElement("button");
button.id = "search-btn";
button.className = "btn-lg btn-primary";
button.innerText = "Search";
button.addEventListener("click", searchBooks);
let bookContainer = createDiv("book", "book mt-5 container");
filterContainer.appendChild(formGroup);
filterContainer.appendChild(button);
body.appendChild(filterContainer);
body.appendChild(bookContainer);
