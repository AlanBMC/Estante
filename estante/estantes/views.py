from django.shortcuts import render, redirect,get_object_or_404
import zipfile
from bs4 import BeautifulSoup
import os
from django.contrib import messages
from django.conf import settings
from .models import Documento
import shutil
from django.core.files.storage import default_storage

# Create your views here.
MAX_FILENAME_LENGTH = 255

def estante(request):
    """
    Funcionalidade: Lista os livros do usuario(no tengo users).

    """
    livros = Documento.objects.all()
    
    return render(request, 'estante.html', {'livros': livros})


def upload_epub(request):
    if request.method ==  'POST' and request.FILES['epub-file'] and  request.FILES['capa']:
        epub_file = request.FILES['epub-file']
        capa = request.FILES['capa']

        titulo, html_path = processa_epub(epub_file)
        documento_existente = Documento.objects.filter(titulo=titulo).first()
        if documento_existente:
            # Se o documento já existe, evite duplicar
            # Opcional: Atualize os campos caso necessário
            documento_existente.capa = capa  # Atualiza a capa, se necessário
            documento_existente.save()
            messages.error(request,'Livro repetido')
            return redirect('estante')
        documento = Documento.objects.create(
            titulo=titulo.replace('_',' '),
            conteudo_html=os.path.relpath(html_path, settings.MEDIA_ROOT),  # Caminho relativo ao MEDIA_ROOT
            autor=titulo,
            capa=capa
        )
        
        return redirect('estante')


def processa_epub(epub_file):

    """
    Processa um arquivo EPUB, extraindo seu conteúdo e gerando um arquivo HTML.
    Args:
        epub_file (str): Caminho para o arquivo EPUB a ser processado.
    Returns:
        None
    """
    nome_do_livro = str(epub_file).replace('.epub','')
    livro_dir = os.path.join(settings.MEDIA_ROOT, 'documentos', nome_do_livro)
    os.makedirs(livro_dir, exist_ok=True)

    # Nome do arquivo HTML de saída
    output_file = os.path.join(livro_dir, f"{nome_do_livro}.html")


    # Abrir e listar os arquivos no ePub
    with zipfile.ZipFile(epub_file, 'r') as z:
        page_content = ''
        for file in z.namelist():
            # Verificar e salvar imagens
            if file.lower().endswith(('.png', '.jpg', '.jpeg', '.gif', '.svg')):
                image_data = z.read(file)
                image_path = os.path.join(livro_dir, os.path.basename(file))
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
                        img['src'] = f"{settings.MEDIA_URL}documentos/{nome_do_livro}/{img_name}"


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

    return nome_do_livro, output_file


def livro(request, id_livro):
    # Chave única para o HTML na sessão, baseada no id do livro
    session_key = f"html_content_{id_livro}"
    livro = Documento.objects.get(id=id_livro)
    # Verifica se o HTML já está na sessão
    html_content = request.session.get(session_key, None)
    
    if html_content is None:  # Se não estiver na sessão, carregue do arquivo
        try:
            livro = Documento.objects.get(id=id_livro)
            print('ta entrando aqui')
            # Verifica se há conteúdo HTML associado ao livro
            if livro.conteudo_html:
                file_path = livro.conteudo_html.path  # Caminho completo do arquivo
                with open(file_path, "r", encoding="utf-8") as f:
                    html_content = f.read()
                
                # Armazena o conteúdo na sessão
                request.session[session_key] = html_content
            else:
                html_content = ""  # Define como vazio caso não haja arquivo HTML
            
        except Documento.DoesNotExist:
            return redirect('estante')  # Lida com livro inexistente
    
    context = {
        "livro": livro,
        "html_content": html_content,
    }
    
    return render(request, 'livro.html', context)



def delete_livro(request, id_livro):
    if request.method == 'POST':
        documento = get_object_or_404(Documento, id=id_livro)

        # Obter o caminho da pasta baseada no arquivo
        if documento.conteudo_html:
            folder_path = os.path.join(settings.MEDIA_ROOT, os.path.dirname(str(documento.conteudo_html)))
            #print(f"Pasta caminho: {folder_path}")  # Debug para verificar o caminho da pasta

            # Verifica se a pasta existe e exclui
            if os.path.isdir(folder_path):
                shutil.rmtree(folder_path)  # Remove a pasta inteira
                documento.delete()
                messages.success(request,"Livro deletado")
            else:
                messages.error(request, 'Pasta não encontrada no sistema de arquivos')

        # Exclua o objeto do banco de dados
        
        return redirect('estante')