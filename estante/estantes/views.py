from django.shortcuts import render

# Create your views here.
def inicio(request):
    return render(request, 'base.html')
def estante(request):
    """
    Funcionalidade: Lista os livros do usuario.
    
    """
    return render(request, 'estante.html')