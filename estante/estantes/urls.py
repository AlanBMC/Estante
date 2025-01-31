from django.contrib import admin
from django.urls import path
from . import views
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('estante/', views.estante, name='estante'),
    path('upload_epub/', views.upload_epub, name='upload_epub'),
    path('livro/<int:id_livro>/', views.livro, name='livro'),
    path('livro_delete/<int:id_livro>/', views.delete_livro, name='delete_livro'),
    path('atualiza_livro/', views.atualiza_livro, name='atualiza_livro'),
    path('reordenar-livros/', views.reordena_livros, name='reordenar-livros'),
]
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)