from django.shortcuts import render
import zipfile
from bs4 import BeautifulSoup

# Create your views here.

def estante(request):
    """
    Funcionalidade: Lista os livros do usuario.

    """
    return render(request, 'estante.html')


def upload_epub(request):
    if request.method ==  'POST' and request.FILES['epub-file']:
        epub_file = request.FILES['epub-file']
        
        return render(request, 'estante.html')