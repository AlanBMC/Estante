# Estante

**Estante** é uma aplicação desenvolvida em Django que permite a organização e leitura de arquivos PDF e EPUB. Este projeto busca fornecer uma experiência intuitiva para usuários que desejam gerenciar suas bibliotecas digitais de forma eficiente.

## Funcionalidades

- **Gerenciamento de Biblioteca:** Permite o upload, organização e remoção de arquivos PDF e EPUB.
- **Leitura de Arquivos:** Inclui um leitor integrado para visualização de conteúdo diretamente na plataforma.
- **Busca:** Sistema de busca para localizar títulos ou autores na biblioteca.
- **Interface Responsiva:** Desenvolvida com HTML e CSS para uma experiência fluida em dispositivos móveis e desktops.

## Tecnologias Utilizadas

- **Backend:** Django 4.x
- **Frontend:** HTML5 e CSS3
- **Banco de Dados:** SQLite (configuração padrão, mas pode ser alterado para outro banco, como PostgreSQL ou MySQL).
- **Outras Dependências:**
  - PyMuPDF (fitz) para manipulação de arquivos PDF.
  - Biblioteca ebooklib e zipfile para arquivos EPUB.
  

## Requisitos do Sistema

- Python 3.10 ou superior
- Django 4.x
- Virtualenv (recomendado)

## Configuração e Execução do Projeto

### 1. Clone o Repositório

```bash
$ git clone https://github.com/seu-usuario/estante.git
$ cd estante
```

### 2. Crie e Ative o Ambiente Virtual

```bash
$ python -m venv venv
$ source venv/bin/activate  # No Windows: venv\Scripts\activate
```

### 3. Instale as Dependências

```bash
$ pip install -r requirements.txt
```

### 4. Configure o Banco de Dados

Crie as migrações e aplique-as ao banco de dados:

```bash
$ python manage.py makemigrations
$ python manage.py migrate
```

### 5. Execute o Servidor de Desenvolvimento

Inicie o servidor local:

```bash
$ python manage.py runserver
```

Acesse a aplicação no navegador em [http://127.0.0.1:8000](http://127.0.0.1:8000).

## Estrutura do Projeto

```
estante/
|-- estante/
|   |-- settings.py        # Configurações do Django
|   |-- urls.py            # Configuração de rotas
|   |-- wsgi.py            # Entrada WSGI
|-- biblioteca/            # Aplicativo principal
|   |-- models.py          # Modelos do banco de dados
|   |-- views.py           # Lógica do backend
|   |-- templates/         # Templates HTML
|   |-- static/            # Arquivos CSS e JS
|-- manage.py              # Comando para gerenciar o projeto
|-- requirements.txt       # Lista de dependências
```

## Como Contribuir

1. Faça um fork deste repositório.
2. Crie uma branch para sua feature ou correção de bug: `git checkout -b minha-feature`.
3. Faça suas alterações e comite: `git commit -m 'Minha nova feature'`.
4. Envie para o repositório remoto: `git push origin minha-feature`.
5. Abra um Pull Request.

## Licença

Este projeto está licenciado sob a [MIT License](LICENSE).

---

**Aproveite sua leitura com o Estante!**

