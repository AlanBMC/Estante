const books = document.querySelectorAll('.book');
let draggedBook = null;

books.forEach(book => {
    // Evento iniciado ao arrastar
    book.addEventListener('dragstart', () => {
        draggedBook = book;
        setTimeout(() => book.style.display = 'none', 0);
    });

    // Evento ao terminar o arrasto
    book.addEventListener('dragend', () => {
        setTimeout(() => {
            draggedBook.style.display = 'block';
            draggedBook = null;
        }, 0);
    });

    // Permitir que outros elementos sejam alvos de drop
    book.addEventListener('dragover', (e) => e.preventDefault());

    // Lógica de troca
    book.addEventListener('drop', (e) => {
        e.preventDefault();
        if (draggedBook && draggedBook !== book) {
            const parent = book.parentNode;
            parent.insertBefore(draggedBook, book.nextSibling);
        }
    });
});