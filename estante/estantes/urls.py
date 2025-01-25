from django.contrib import admin
from django.urls import path
from . import views
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('estante/', views.estante, name='estante'),
    path('upload_epub/', views.upload_epub, name='upload_epub'),
    path('livro/<int:id_livro>', views.livro, name='livro')
    
]
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)