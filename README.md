
## Gerenciamento de Produtos

Este projeto foi desenvolvido como parte do desafio do processo seletivo da Aceleradora Ágil da PUCRS, conforme o Enunciado 01.

---

## Tecnologias Utilizadas

- **JavaScript**
- **Node.js**
- **readline-sync** (para entrada de dados via terminal)
- **fs (File System)** (para leitura e escrita de arquivos JSON)

---

## Como Executar

### Pré-requisitos
- Node.js (versão 16 ou superior)

Verifique com:
```bash
node -v
```

### 1 - Clonar o repositório

```bash
git clone https://github.com/KristianKirschner/desafio-puc-enunciado-1.git
cd desafio-puc-enunciado-1
```

### 2 - Instalar dependências

```bash
npm install 
```

### 3 - Executar a aplicação
```bash
node index.js
```

## Funcionalidades

- CRUD completo de produtos (criar, listar, atualizar e excluir)
- Interface CLI interativa executada via terminal
- Uso de caracteres Unicode de line-drawing para menus e tabelas
- Persistência de dados em arquivo JSON
- Busca de produtos por ID ou por parte do nome
- Geração automática de identificadores únicos
- Limpeza do terminal para melhor experiência de uso
