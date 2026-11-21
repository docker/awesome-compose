# Configurando um Ambiente de Desenvolvimento Laravel com DOCKER

## Índice
- [Pré-requisitos](#pré-requisitos)
- [Docker Desktop](#docker-desktop)
- [Windows](#windows)
- [Linux](#linux)
- [Rodando Comandos](#rodando-comandos)

## Pré-requisitos
- [Docker Desktop](https://www.docker.com/products/docker-desktop/)
- WSL (Windows Subsystem for Linux)

## Docker Desktop
Antes de qualquer coisa, certifique-se de ter o Docker Desktop instalado em seu sistema. Se você ainda não possui ou não configurou corretamente, siga o guia oficial de instalação do Docker Desktop.
- [Windows](https://www.docker.com/products/docker-desktop/)
- [Linux](https://docs.docker.com/engine/install/ubuntu/)

## Windows

### 1. Clonando o Repositório no WSL
Primeiro, certifique-se de ter o WSL (Windows Subsystem for Linux) configurado no seu sistema. Se você ainda não o configurou, siga o [guia oficial de instalação do WSL](https://docs.microsoft.com/pt-br/windows/wsl/install) para prepará-lo.

Depois que o WSL estiver configurado, abra um terminal WSL e navegue até o diretório onde deseja clonar o repositório do seu projeto Laravel. Execute o comando abaixo para clonar o repositório:

```bash
git clone https://github.com/IgorOliverx/docker-laravel.git
```

### 2. Rodando o Docker Compose
Após clonar o repositório, navegue até o diretório do projeto:

```bash
cd docker-laravel
```

Agora, execute o seguinte comando para construir e iniciar os contêineres Docker:

```bash
docker-compose up -d --build
```

Esse comando irá construir os contêineres definidos no arquivo `docker-compose.yml` e iniciá-los em segundo plano. A opção `--build` garante que as imagens Docker sejam construídas novamente, o que é útil se você fez alterações nos Dockerfiles.

---

## Linux

### 1. Clonando o Repositório
Abra um terminal e navegue até o diretório onde deseja clonar o repositório do seu projeto Laravel. Execute o comando abaixo para clonar o repositório:

```bash
git clone https://github.com/seu-usuario/seu-repositorio.git
```

Substitua `https://github.com/seu-usuario/seu-repositorio.git` pela URL do repositório que deseja clonar.

### 2. Rodando o Docker Compose
Após clonar o repositório, navegue até o diretório do projeto:

```bash
cd seu-repositorio
```

Agora, execute o seguinte comando para construir e iniciar os contêineres Docker:

```bash
docker-compose up -d --build
```

Esse comando irá construir os contêineres definidos no arquivo `docker-compose.yml` e iniciá-los em segundo plano. A opção `--build` garante que as imagens Docker sejam construídas novamente, o que é útil se você fez alterações nos Dockerfiles.

---

## Rodando Comandos

1. Após executar o comando de build, execute o comando:
    ```bash
    docker exec -it setup-php bash
    ```
   depois:
    ```bash
    composer install
    php artisan key:generate
    cp .env.example .env
    ```

2. Abra a IDE de sua escolha (recomendo o PHPStorm).
3. Edite o arquivo `.env`, as credenciais do banco de dados e do Redis devem ser alteradas.
4. Algo como:
    ```
    DB_CONNECTION=mysql
    DB_HOST=setup-mysql
    DB_PORT=3306
    DB_DATABASE=laravel
    DB_USERNAME=user
    DB_PASSWORD=root
    ```
PS: Se o laravel relatar o erro "Connection refused:" altere a porta para '3307'

5. Altere também as credenciais do Redis, algo como:
    ```
    REDIS_HOST=setup-redis
    REDIS_PASSWORD=null
    REDIS_PORT=6379
    ```

5. Agora
      ```bash
    php artisan migrate
                         
PS: A fim de elevar o nível de segurança, você pode alterar as credenciais no arquivo `docker-compose.yml`.

---

Com esses passos, você terá um ambiente de desenvolvimento Laravel configurado usando Docker tanto no Windows quanto no Linux. Se precisar de mais ajuda, consulte a documentação oficial do Docker e Laravel.
