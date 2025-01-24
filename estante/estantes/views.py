from django.shortcuts import render

# Create your views here.

def estante(request):
    """
    Funcionalidade: Lista os livros do usuario.

    """
    return render(request, 'estante.html')


def upload_epub(request):
    pass