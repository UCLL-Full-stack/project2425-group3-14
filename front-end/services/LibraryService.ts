import { Book } from "@/types";

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

const addBook = (book: Book) => {
    if (typeof window !== "undefined") {
        const token = JSON.parse(sessionStorage.getItem("loggedInUser")!).token;
        return fetch(process.env.NEXT_PUBLIC_API_URL + "/books/add", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify(book),
        });
    }
};

const removeBook = (id: number) => {
    if (typeof window !== "undefined") {
        const token = JSON.parse(sessionStorage.getItem("loggedInUser")!).token;
        return fetch(process.env.NEXT_PUBLIC_API_URL + `/books/remove/${id}`, {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
        });
    }
}

const LibraryService = {
    getAllBooks,
    getBookById,
    addBook,
    removeBook,
};
export default LibraryService;