document.addEventListener('DOMContentLoaded', () => {
    const books = document.querySelectorAll('.book');
    const saveButton = document.getElementById('save-order');
    let draggedBook = null;

    books.forEach(book => {
        // Evento ao arrastar
        book.addEventListener('dragstart', () => {
            draggedBook = book;
            setTimeout(() => book.style.display = 'none', 0);
        });

        // Evento ao soltar
        book.addEventListener('dragend', () => {
            setTimeout(() => {
                draggedBook.style.display = 'block';
                draggedBook = null;
            }, 0);
        });

        // Permitir drop
        book.addEventListener('dragover', (e) => e.preventDefault());

        // Realiza a troca
        book.addEventListener('drop', (e) => {
            e.preventDefault();
            if (draggedBook && draggedBook !== book) {
                const parent = book.parentNode;
                parent.insertBefore(draggedBook, book.nextSibling);
                salvarOrdem();
            }
        });
    });

    // Salvar a ordem ao clicar no botão
    function salvarOrdem() {
        const bookOrder = Array.from(document.querySelectorAll('.book')).map(book => book.dataset.id);

        // Enviar a nova ordem ao backend via AJAX
        fetch('/reordenar-livros/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': getCsrfToken(), // Obtém o CSRF token
            },
            body: JSON.stringify({ ordem: bookOrder }),
        })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    alert('Ordem salva com sucesso!');
                } else {
                    alert('Erro ao salvar ordem: ' + data.message);
                }
            })
            .catch(error => {
                alert('Erro ao salvar ordem: ' + error.message);
            });
    };

    // Função para obter o CSRF token
    function getCsrfToken() {
        const cookieValue = document.cookie.split('; ')
            .find(row => row.startsWith('csrftoken='))
            ?.split('=')[1];
        return cookieValue;
    }
});





