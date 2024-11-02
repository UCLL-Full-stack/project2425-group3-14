const getAllBooks = () => {
    return fetch(process.env.NEXT_PUBLIC_API_URL + '/books', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    })
};

const getBookById = (bookId: number) => {
    return fetch(process.env.NEXT_PUBLIC_API_URL + `/books/${bookId}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    })
};


const LibraryService = {
    getAllBooks,
    getBookById
};
export default LibraryService;