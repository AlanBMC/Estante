from django.db import models
import os
def upload_to(instance, filename):
    """
    Define o caminho onde o arquivo será salvo.
    Exemplo: documentos/<titulo_do_documento>/<arquivo_html>
    """
    return os.path.join("documentos", instance.titulo, filename)

# Create your models here.
class Documento(models.Model):
    titulo = models.CharField(max_length=255)  # Título do documento
    autor = models.CharField(max_length=255, blank=True, null=True)  # Autor (opcional)
    conteudo_html = models.FileField(upload_to=upload_to)  # HTML bruto convertido
    data_criacao = models.DateTimeField(auto_now_add=True)  # Data de criação
    data_atualizacao = models.DateTimeField(auto_now=True)  # Data da última atualização
    capa = models.ImageField(upload_to=upload_to, blank=True, null=True)
    def __str__(self):
        return self.titulo
    def delete(self, *args, **kwargs):
        # Remove o arquivo associado antes de excluir o objeto
        if self.conteudo_html:
            self.conteudo_html.delete(save=False)
        if self.capa:
            self.capa.delete(save=False)
        super().delete(*args, **kwargs)

class Marcacao(models.Model):
    documento = models.ForeignKey(
        Documento,
        on_delete=models.CASCADE,
        related_name='marcacoes'
    )  # Documento onde a marcação foi feita
    selecao = models.TextField()  # Texto selecionado
    offset_inicio = models.IntegerField()  # Posição inicial no HTML
    offset_fim = models.IntegerField()  # Posição final no HTML
    cor = models.CharField(max_length=7, default="#FFFF00")  # Cor da marcação (hexadecimal, default amarelo)
    data_criacao = models.DateTimeField(auto_now_add=True)  # Data de criação

    def __str__(self):
        return f"Marcação no documento '{self.documento.titulo}' - {self.selecao}"
    

class Comentario(models.Model):
    marcacao = models.ForeignKey(
        Marcacao,
        on_delete=models.CASCADE,
        related_name='comentarios'
    )  # Relaciona o comentário a uma marcação
    texto = models.TextField()  # Texto do comentário
    data_criacao = models.DateTimeField(auto_now_add=True)  # Data de criação do comentário

    def __str__(self):
        return f"Comentário na marcação: '{self.marcacao.selecao[:30]}...'"
    
