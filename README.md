# Onboarding (Back-end) - Synchro

API desenvolvida para o sistema de controle de contas contábeis.

O objetivo é permitir organizar contas através de um sistema intuitivo.

## Tecnologias Utilizadas
* Java 21
* Spring Boot 3
* Spring Data JPA / Hibernate
* Maven
* Banco de Dados: MySQL 8.0.33

## Como Executar a API

### Pré-requisitos
* Java instalado na versão usada.
* Maven instalado na versão usada.
* Uma instância do Mysql rodando.

### Configuração
1.  Clone este repositório
2.  Navegue até a pasta do projeto.
3.  Abra o arquivo: properties
4.  Altere as seguintes propriedades com as credenciais do seu banco de dados local:
    * `spring.datasource.url` 
    * `spring.datasource.username`
    * `spring.datasource.password`

### Execução
1.  Abra o projeto em sua IDE  e execute a classe principal da aplicação.
2.  A API estará disponível em `http://localhost:8080`.

#OBS: isso é só para o back end, para ver a aplicação completa tem que rodar juntamente com o front-end.
