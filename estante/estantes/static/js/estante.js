document.addEventListener('DOMContentLoaded', () => {
    const books = document.querySelectorAll('.book');
    let draggedBook = null;
    const shelf = document.querySelector('.shelf');
    const dropIndicator = document.querySelector('.drop-indicator');
    
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
                hideDropIndicator();
            }, 0);
        });

        // Permitir drop
        book.addEventListener('dragover', (e) => {
            e.preventDefault();
            const rect = book.getBoundingClientRect();
            const offset = e.clientY - rect.top;

            // Mostra a barra de indicação
            const dropIndicator = book.parentElement.querySelector('.drop-indicator');
            if (offset < rect.height / 2) {
                dropIndicator.style.display = 'block';
                dropIndicator.style.top = `${rect.top}px`;
            } else {
                dropIndicator.style.display = 'block';
                dropIndicator.style.top = `${rect.bottom}px`;
            }
        });

        // Esconde a barra de indicação ao sair do livro
        book.addEventListener('dragleave', () => {
            hideDropIndicator();
        });

        // Realiza a troca
        book.addEventListener('drop', (e) => {
            e.preventDefault();
            if (draggedBook && draggedBook !== book) {
                const parent = book.parentNode;
                parent.insertBefore(draggedBook, book.nextSibling);
                salvarOrdem();
            }
            hideDropIndicator();
        });
    });

    // Função para esconder a barra de indicação
    function hideDropIndicator() {
        const dropIndicators = document.querySelectorAll('.drop-indicator');
        dropIndicators.forEach(indicator => {
            indicator.style.display = 'none';
        });
    }
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
                    console.log('Ordem salva com sucesso!');
                } else {
                    console.log('Erro ao salvar ordem: ' + data.message);
                }
            })
            .catch(error => {
                console.log('Erro ao salvar ordem: ' + error.message);
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





