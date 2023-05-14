/* eslint-disable eqeqeq */
const { nanoid } = require('nanoid');
const books = require('./book');

const addBookHandler = (request, h) => {
  let { name } = request.payload;
  const {
    year, author, summary, publisher, pageCount, readPage, reading,
  } = request.payload;

  if (name !== undefined) name = name.trim();
  const id = nanoid(16);
  const finished = pageCount === readPage;
  const insertedAt = new Date().toISOString();
  const updatedAt = insertedAt;

  const newBook = {
    id,
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    finished,
    reading,
    insertedAt,
    updatedAt,
  };

  const nameIsEmpty = name === undefined || name === '';
  const readPageIsMoreThanPageCount = readPage > pageCount;

  if (nameIsEmpty) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. Mohon isi nama buku',
    });
    response.code(400);
    return response;
  }
  if (readPageIsMoreThanPageCount) {
    const response = h.response({
      status: 'fail',
      message:
        'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount',
    });
    response.code(400);
    return response;
  }

  const response = h.response({
    status: 'success',
    message: 'Buku berhasil ditambahkan',
    data: {
      bookId: id,
    },
  });
  books.push(newBook);
  response.code(201);
  return response;
};

const getAllBookHandler = (request, h) => {
  const { name, reading, finished } = request.query;
  let filteredBooks = books;

  if (reading) {
    filteredBooks = filteredBooks.filter((book) => book.reading == reading);
    filteredBooks = filteredBooks.map((book) => ({
      id: book.id,
      name: book.name,
      publisher: book.publisher,
    }));

    const response = h.response({
      status: 'success',
      data: {
        books: filteredBooks,
      },
    });
    response.code(200);
    return response;
  }

  if (finished) {
    filteredBooks = filteredBooks.filter((book) => book.finished == finished);

    filteredBooks = filteredBooks.map((book) => ({
      id: book.id,
      name: book.name,
      publisher: book.publisher,
    }));

    const response = h.response({
      status: 'success',
      data: {
        books: filteredBooks,
      },
    });
    response.code(200);
    return response;
  }

  if (name) {
    filteredBooks = filteredBooks.filter(
      (book) => book.name.toLowerCase().includes(name.toLowerCase()),
    );

    filteredBooks = filteredBooks.map((book) => ({
      id: book.id,
      name: book.name,
      publisher: book.publisher,
    }));

    const response = h.response({
      status: 'success',
      data: {
        books: filteredBooks,
      },
    });
    response.code(200);
    return response;
  }

  filteredBooks = filteredBooks.map((book) => ({
    id: book.id,
    name: book.name,
    publisher: book.publisher,
  }));

  const response = h.response({
    status: 'success',
    data: {
      books: filteredBooks,
    },
  });
  response.code(200);
  return response;
};

const getBookDetailHandler = (request, h) => {
  const { bookId } = request.params;
  const book = books.filter((b) => b.id === bookId)[0];

  const undefinedBook = book === undefined;

  if (undefinedBook) {
    const response = h.response({
      status: 'fail',
      message: 'Buku tidak ditemukan',
    });
    response.code(404);
    return response;
  }
  const response = h.response({
    status: 'success',
    data: {
      book,
    },
  });
  response.code(200);
  return response;
};

const updateBookHandler = (request, h) => {
  const { bookId } = request.params;
  let { name } = request.payload;
  const {
    year, author, summary, publisher, pageCount, readPage, reading,
  } = request.payload;

  if (name !== undefined) name = name.trim();
  const updatedAt = new Date().toISOString();
  const finished = pageCount === readPage;

  const indexBook = books.findIndex((index) => index.id === bookId);

  const nameIsEmpty = name === undefined || name === '';
  const readPageIsMoreThanPageCount = readPage > pageCount;
  const undefinedBook = indexBook === -1;

  if (nameIsEmpty) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. Mohon isi nama buku',
    });
    response.code(400);
    return response;
  }
  if (readPageIsMoreThanPageCount) {
    const response = h.response({
      status: 'fail',
      message:
        'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount',
    });
    response.code(400);
    return response;
  }
  if (undefinedBook) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. Id tidak ditemukan',
    });
    response.code(404);
    return response;
  }

  books[indexBook] = {
    ...books[indexBook],
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    finished,
    reading,
    updatedAt,
  };

  const response = h.response({
    status: 'success',
    message: 'Buku berhasil diperbarui',
  });
  response.code(200);
  return response;
};

const deleteBookHandler = (request, h) => {
  const { bookId } = request.params;
  const indexBook = books.findIndex((index) => index.id === bookId);

  const undefinedBook = indexBook === -1;

  if (undefinedBook) {
    const response = h.response({
      status: 'fail',
      message: 'Buku gagal dihapus. Id tidak ditemukan',
    });
    response.code(404);
    return response;
  }

  books.splice(indexBook, 1);
  const response = h.response({
    status: 'success',
    message: 'Buku berhasil dihapus',
  });
  response.code(200);
  return response;
};

module.exports = {
  addBookHandler,
  getAllBookHandler,
  getBookDetailHandler,
  updateBookHandler,
  deleteBookHandler,
};
