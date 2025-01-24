from django.shortcuts import render
import zipfile
from bs4 import BeautifulSoup
import os
# Create your views here.

def estante(request):
    """
    Funcionalidade: Lista os livros do usuario.

    """
    return render(request, 'estante.html')


def upload_epub(request):
    if request.method ==  'POST' and request.FILES['epub-file']:
        epub_file = request.FILES['epub-file']
        processa_epub(epub_file)
        
        return render(request, 'estante.html')
    
def processa_epub(epub_file):

    """
    Processa um arquivo EPUB, extraindo seu conteúdo e gerando um arquivo HTML.
    Args:
        epub_file (str): Caminho para o arquivo EPUB a ser processado.
    Returns:
        None
    """
    nome_do_livro = str(epub_file).replace('.epub','')
    os.makedirs(nome_do_livro, exist_ok=True)
    # Nome do arquivo HTML de saída
    output_file = os.path.join(nome_do_livro, f"{nome_do_livro}.html")

    # Abrir e listar os arquivos no ePub
    with zipfile.ZipFile(epub_file, 'r') as z:
        page_content = ''
        for file in z.namelist():
            # Verificar e salvar imagens
            if file.lower().endswith(('.png', '.jpg', '.jpeg', '.gif', '.svg')):
                image_data = z.read(file)
                image_path = os.path.join(nome_do_livro, os.path.basename(file))
                with open(image_path, 'wb') as img_file:
                    img_file.write(image_data)

            # Processar arquivos HTML ou XHTML
            elif file.endswith('.html') or file.endswith('.xhtml'):
                content = z.read(file).decode('utf-8')

                # Usar BeautifulSoup para processar o HTML
                soup = BeautifulSoup(content, 'html.parser')

                # Atualizar caminhos das imagens no HTML
                for img in soup.find_all('img'):
                    if 'src' in img.attrs:
                        img_src = img['src']
                        img_name = os.path.basename(img_src)
                        img['src'] = img_name

                # Obter o conteúiner principal (geralmente <body> ou equivalente)
                body = soup.find('body') or soup
                #print(body)
                body_content = body.decode_contents()
                soup_content = BeautifulSoup(body_content, 'html.parser')
                for p in soup_content.find_all('p'):
                    page_content += f"\n<div class='page'>\n{p}\n</div>\n"
                for img in soup_content.find_all('img'):
                    page_content += f"\n<div class='page'>\n{img}\n</div>\n"
                
 # Salvar o arquivo HTML
    with open(output_file, "w", encoding="utf-8") as f:
        f.write(page_content)

    return 'ok'
