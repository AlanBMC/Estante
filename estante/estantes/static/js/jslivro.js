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


        // Reseta o comentário no campo de texto
        document.getElementById("comment").value = "";
    }
};


// Função para salvar um comentário (com ou sem marcação)
function saveComment() {
    if (currentRange) {
        // Obtemos o comentário da área de texto
        let comment = document.getElementById("comment").value.trim();

        // Se o comentário estiver vazio, definimos um espaço como padrão
        if (!comment) {
            comment = " ";
        }

        // Verifica se o texto já está marcado
        if (selectedTextNode && selectedTextNode.parentElement.classList.contains("highlighted")) {
            selectedTextNode.parentElement.dataset.comment = comment; // Atualiza o comentário existente
        } else {
            // Cria um novo <span> para envolver o texto selecionado
            const span = document.createElement("span");
            span.style.backgroundColor = "yellow"; // Cor padrão
            span.className = "highlighted";
            span.dataset.comment = comment; // Salva o comentário (mesmo que seja um espaço)
            span.addEventListener("click", () => showComment(span)); // Exibe o comentário ao clicar
            currentRange.surroundContents(span); // Envolve o texto no <span>
        }

        // Alerta o usuário sobre o comentário salvo
        alert("Comentário salvo: " + comment);
        closeModal(); // Fecha o modal
    }
}

document.addEventListener("mouseup", marcatexto); // Para desktop
document.addEventListener("touchend", marcatexto); 

function markText(color) {
    if (currentRange) {
        

    let comment = document.getElementById("comment")?.value.trim() || " ";
    // Verifica se o texto já está marcado, caso contrário, cria um <span>
    if (selectedTextNode && selectedTextNode.parentElement.classList.contains("highlighted")) {
        const parent = selectedTextNode.parentElement;

        // Atualiza o comentário e a cor da marcação
        parent.dataset.comment = comment; // Atualiza o comentário
        parent.style.backgroundColor = color; // Atualiza a cor
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
    document.getElementById("comment").value = element.dataset.comment || " ";

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
    saveHtmlToServer();
}


    const book = document.querySelector('.book');
    const pages = document.querySelectorAll('.page');

    const pageAtual = document.getElementById('paginaatual').value
    let isPaginated = true;
    let currentPage =pageAtual;
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
        saveHtmlToServer();
    }
    


function saveHtmlToServer() {
        const bookContainer = document.querySelector(".book-container"); // Seleciona o container do conteúdo
        const updatedHtml = bookContainer.innerHTML; // Captura o HTML atualizado
        const id_livro = document.getElementById('id_dolivro').value
        

        fetch('/atualiza_livro/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': getCookie('csrftoken') // Adiciona o CSRF Token para segurança
            },
            body: JSON.stringify({
                html_content: updatedHtml,
                idLivro: id_livro,
                paginaAtual: currentPage,
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

function addClickEventToHighlights() {
    // Seleciona todos os elementos destacados
    const highlights = document.querySelectorAll('.highlighted');
    highlights.forEach((highlight) => {
        // Adiciona o evento de clique para exibir o modal
        highlight.addEventListener('click', () => showComment(highlight));
    });
}

// Chama a função ao carregar a página para garantir que todos os spans tenham o evento
document.addEventListener('DOMContentLoaded', addClickEventToHighlights);


if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker
            .register('/static/sw.js') // Atualize o caminho conforme necessário
            .then((registration) => {
                console.log('Service Worker registrado:', registration);
            })
            .catch((error) => {
                console.error('Erro ao registrar o Service Worker:', error);
            });
    });
}
