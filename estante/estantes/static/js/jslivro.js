let currentRange;
let selectedTextNode;

// Função para capturar o texto selecionado e exibir o modal
function marcatexto(){
    const selection = window.getSelection();
    if (selection.toString().trim().length > 0) {
        currentRange = selection.getRangeAt(0);
        const rect = currentRange.getBoundingClientRect(); // Posição do texto selecionado
        selectedTextNode = selection.anchorNode;

        const modal = document.getElementById("modal");
        modal.style.display = "flex";



        // Dimensões da tela e do modal
        const modalWidth = modal.offsetWidth;
        const modalHeight = modal.offsetHeight;
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;

        // Margem de segurança
        const margin = 10;

    
        // Aplica as posições ajustadas
        modal.style.top = `${top}px`;
        modal.style.left = `${left}px`;

        // Reseta o comentário no campo de texto
        document.getElementById("comment").value = "";
    }
};


// Função para salvar um comentário (com ou sem marcação)
function saveComment() {
    if (currentRange) {
        const comment = document.getElementById("comment").value;

        // Verifica se o texto já está marcado, caso contrário, cria um <span>
        if (selectedTextNode && selectedTextNode.parentElement.classList.contains("highlighted")) {
            selectedTextNode.parentElement.dataset.comment = comment; // Atualiza o comentário
        } else {
            const span = document.createElement("span");
            span.style.backgroundColor = "yellow"; // Define a cor padrão para marcação
            span.className = "highlighted";
            span.dataset.comment = comment; // Salva o comentário
            span.addEventListener("click", () => showComment(span)); // Torna clicável para exibir o comentário
            currentRange.surroundContents(span);
        }

        alert("Comentário salvo: " + comment);
        closeModal();
    }
}
document.addEventListener("mouseup", marcatexto); // Para desktop
document.addEventListener("touchend", marcatexto); 
function markText(color) {
    if (currentRange) {
    

    // Verifica se o texto já está marcado, caso contrário, cria um <span>
    if (selectedTextNode && selectedTextNode.parentElement.classList.contains("highlighted")) {
        selectedTextNode.parentElement.dataset.comment = comment; // Atualiza o comentário
    } else {
        const span = document.createElement("span");
        span.style.backgroundColor = color; // Define a cor padrão para marcação
        span.className = "highlighted";
        span.dataset.comment = comment; // Salva o comentário
        span.addEventListener("click", () => showComment(span)); // Torna clicável para exibir o comentário
        currentRange.surroundContents(span);
    }

    closeModal();
}
}
// Função para exibir o comentário do texto marcado
function showComment(element) {
    const modal = document.getElementById("modal");
    modal.style.display = "flex";

    // Preenche o campo com o comentário armazenado
    document.getElementById("comment").value = element.dataset.comment || "";

    // Atualiza o nó selecionado para edição ou remoção
    selectedTextNode = element.firstChild;
}

// Função para apagar a marcação
function removeHighlight() {
    if (selectedTextNode && selectedTextNode.parentElement.classList.contains("highlighted")) {
        const parent = selectedTextNode.parentElement;
        parent.replaceWith(...parent.childNodes); // Remove o <span> mantendo o texto
    }
    closeModal();
}

// Função para fechar o modal
function closeModal() {
    const modal = document.getElementById("modal");
    modal.style.display = "none";
    document.getElementById("comment").value = ""; // Limpa o campo de comentário
}


    const book = document.querySelector('.book');
    const pages = document.querySelectorAll('.page');
    let isPaginated = true;
    let currentPage = 0;

    



    // Adicionar suporte a swipe para paginação
    let startX = 0;

    book.addEventListener('touchstart', (e) => {
        if (!isPaginated) return;
        startX = e.touches[0].clientX;
    });

    book.addEventListener('touchend', (e) => {
        if (!isPaginated) return;
        const endX = e.changedTouches[0].clientX;
        const diff = startX - endX;

        if (diff > 50 && currentPage < pages.length - 1) {
            currentPage++;
        } else if (diff < -50 && currentPage > 0) {
            currentPage--;
        }
        updatePage();
    });

    function updatePage() {
        const offset = currentPage * -100;
        book.style.transform = `translateX(${offset}%)`;
    }
    document.getElementById("modal").addEventListener("click", function (event) {
        const modalContent = document.querySelector(".modal-content");
        if (!modalContent.contains(event.target)) {
            const modal = document.getElementById("modal");
             modal.style.display = "none";
        }
    });



function saveHtmlToServer() {
        const bookContainer = document.querySelector(".book-container"); // Seleciona o container do conteúdo
        const updatedHtml = bookContainer.innerHTML; // Captura o HTML atualizado
        const id_livro = document.getElementById('id_dolivro').value
        console.log(id_livro)
        fetch('/atualiza_livro/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': getCookie('csrftoken') // Adiciona o CSRF Token para segurança
            },
            body: JSON.stringify({
                html_content: updatedHtml,
                idLivro: id_livro
            })
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                console.log("HTML salvo com sucesso!");
            } else {
                console.log("Erro ao salvar o HTML: " + data.message);
            }
        })
        .catch(error => {
            console.error("Erro:", error);
            console.log("Ocorreu um erro ao salvar o HTML.");
        });
}

    function getCookie(name) {
        let cookieValue = null;
        if (document.cookie && document.cookie !== '') {
            const cookies = document.cookie.split(';');
            for (let i = 0; i < cookies.length; i++) {
                const cookie = cookies[i].trim();
                if (cookie.startsWith(name + '=')) {
                    cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                    break;
                }
            }
        }
        return cookieValue;
    }
    