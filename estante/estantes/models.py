from django.db import models
import os
import uuid
import time
from django.utils.text import slugify

def upload_to(instance, filename):
    base_filename, file_extension = os.path.splitext(filename)
    # Adiciona um timestamp único ao nome do arquivo
    unique_id = f"{int(time.time())}-{uuid.uuid4().hex[:6]}"
    filename = f"{slugify(base_filename[:40])}-{unique_id}{file_extension}"
    titulo_slug = slugify(instance.titulo[:100])  # Limita o título
    return os.path.join("documentos", titulo_slug, filename)

# Create your models here.
class Documento(models.Model):
    titulo = models.CharField(max_length=500)  # Título do documento
    autor = models.CharField(max_length=500, blank=True, null=True)  # Autor (opcional)
    conteudo_html = models.FileField(upload_to=upload_to)  # HTML bruto convertido
    data_criacao = models.DateTimeField(auto_now_add=True)  # Data de criação
    data_atualizacao = models.DateTimeField(auto_now=True)  # Data da última atualização
    capa = models.ImageField(upload_to=upload_to, blank=True, null=True, max_length=500)
    ordem = models.PositiveIntegerField(default=0)
    class Meta:
        ordering = ['ordem'] 
    def __str__(self):
        return self.titulo
    def delete(self, *args, **kwargs):
        # Remove o arquivo associado antes de excluir o objeto
        if self.conteudo_html:
            self.conteudo_html.delete(save=False)
        if self.capa:
            self.capa.delete(save=False)
        super().delete(*args, **kwargs)
