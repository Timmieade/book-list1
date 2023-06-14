//  Book Class: represents a Book
class Book {
    constructor(title, author, isbn) {
        this.title = title;
        this.author = author;
        this.isbn = isbn;
    }
}

// UI class: Handle UI Tasks
class UI {
    static displayBooks() {
     
        var books = Store.getBooks();

        books.forEach((book) => UI.addBookToList(book));
    }
    static addBookToList(book) {
        var list = document.querySelector('#book-list');

        var row = document.createElement('tr');

        row.innerHTML = `
        <td>${book.title}</td>
        <td>${book.author}</td>
        <td>${book.isbn}</td>
        <td><a hreff='#' class="delete has-background-danger is-medium">X</a></td>
        `;

        list.appendChild(row);
    }
    static delectBook(el) {
        if(el.classList.contains('delete')) {
            el.parentElement.parentElement.remove();
        }
    }
    static clearFields() {
        document.querySelector('#title').value = '';
        document.querySelector('#author').value = '';
        document.querySelector('#isbn').value = '';

    }
    static showAlert(message, className) {
        const div = document.createElement('div');
        div.className = `notification is-${className}`;
        div.appendChild(document.createTextNode(message));
        const container = document.querySelector('.container')
        const form = document.querySelector('#book-form');
        container.insertBefore(div, form);

        setTimeout(() => document.querySelector('.notification').remove(), 2000 );
    }

}

// Store Class: Handles Storage
class Store {
    static getBooks() {
        let books;
        if(localStorage.getItem('books') === null) {
            books = [];
        } else {
            books = JSON.parse(localStorage.getItem('books'));
        }
        return books;
    }
    
    static addBook(book) {
        const Books = Store.getBooks();

        Books.push(book);

        localStorage.setItem('books', JSON.stringify(Books));

    } 

    static removeBook(isbn) {
        const books = Store.getBooks();

        books.forEach((book, index) => {
            if(book.isbn === isbn) {
                books.splice(index, 1);
            }
        });

        localStorage.setItem('books', JSON.stringify(books))
    }
}




// Event: Display Books
document.addEventListener('DOMContentLoaded', UI.displayBooks);


// Event: Add a Book
document.querySelector('#book-form').addEventListener('submit', (e) => {

    //  prevent actual submit
    e.preventDefault();
    // get form values
    const title = document.querySelector('#title').value;
    const author = document.querySelector('#author').value;
    const isbn = document.querySelector('#isbn').value;
    //Validate 
    if(title === '' || author === '' || isbn === ''){
      UI.showAlert('Please fill in all fields', 'danger' );
    } else {
        // Instatiate book
        const book = new Book(title, author, isbn);

        // Add Book to UI
        UI.addBookToList(book);


        // Add book to store
        Store.addBook(book);


        // Show Success Massage
        UI.showAlert('Book Added', 'danger')

        // Add Clearfields
        UI.clearFields();
     }

   

 });



// Event: remove a book
document.querySelector('#book-list').addEventListener('click', (e) => {
    
    // Remove book from Ui
    UI.delectBook(e.target)
    
    // remove book from storage
    Store.removeBook(e.target.parentElement.previousElementSibling.textContent);

      // Show Success Massage
      UI.showAlert('Book Removed', 'danger')
});
