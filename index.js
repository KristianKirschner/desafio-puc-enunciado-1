const fs = require("fs");
const readline = require("readline-sync");

const DATA_FILE = "products.json";

/* =====================================================
   UTILITÁRIOS DE CLI (LINE-DRAWING)
===================================================== */

function clear() {
  console.clear();
}

function pause() {
  readline.question("\n│ Pressione ENTER para continuar...");
}

function box(title, lines = []) {
  const width =
    Math.max(title.length, ...lines.map(l => l.length)) + 4;

  console.log("┌" + "─".repeat(width) + "┐");
  console.log("│ " + title.padEnd(width - 2) + " │");
  console.log("├" + "─".repeat(width) + "┤");

  lines.forEach(l =>
    console.log("│ " + l.padEnd(width - 2) + " │")
  );

  console.log("└" + "─".repeat(width) + "┘");
}

function input(label) {
  return readline.question(`│ ${label}: `);
}

function inputInt(label) {
  return readline.questionInt(`│ ${label}: `);
}

function inputFloat(label) {
  return readline.questionFloat(`│ ${label}: `);
}

/* =====================================================
   PERSISTÊNCIA
===================================================== */

function loadProducts() {
  if (!fs.existsSync(DATA_FILE)) return [];
  return JSON.parse(fs.readFileSync(DATA_FILE, "utf-8"));
}

function saveProducts(products) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(products, null, 2));
}

/* =====================================================
   UTILIDADES
===================================================== */

function generateId(products) {
  return products.length > 0
    ? Math.max(...products.map(p => p.id)) + 1
    : 1;
}

function findProductById(products, id) {
  return products.find(p => p.id === id);
}

/* =====================================================
   CRUD
===================================================== */

function addProduct(products) {
  clear();

  console.log("│ Informe os dados abaixo:\n");

  const name = input("Nome do produto");
  const category = input("Categoria");
  const quantity = inputInt("Quantidade em estoque");
  const price = inputFloat("Preço");

  products.push({
    id: generateId(products),
    name,
    category,
    quantity,
    price
  });

  saveProducts(products);

  clear();
  box("Sucesso", ["Produto adicionado com sucesso"]);
}

function listProducts(products) {
  if (products.length === 0) {
    box("Lista de Produtos", ["Nenhum produto cadastrado"]);
    return;
  }

  const headers = ["ID", "Produto", "Categoria", "Qtd", "Preço"];
  const rows = products.map(p => [
    String(p.id),
    p.name,
    p.category,
    String(p.quantity),
    `R$ ${p.price.toFixed(2)}`
  ]);

  const widths = headers.map((h, i) =>
    Math.max(h.length, ...rows.map(r => r[i].length))
  );

  const line = (l, m, r) =>
    l + widths.map(w => "─".repeat(w + 2)).join(m) + r;

  const row = r =>
    "│ " + r.map((c, i) => c.padEnd(widths[i])).join(" │ ") + " │";

  console.log(line("┌", "┬", "┐"));
  console.log(row(headers));
  console.log(line("├", "┼", "┤"));
  rows.forEach(r => console.log(row(r)));
  console.log(line("└", "┴", "┘"));
}

function updateProduct(products) {
  clear();
    console.log("│ Atualizar Produto:\n");


  const id = inputInt("Informe o ID");
  const product = findProductById(products, id);

  if (!product) {
    box("Erro", ["Produto não encontrado"]);
    return;
  }

  box("Dados Atuais", [
    `Nome: ${product.name}`,
    `Categoria: ${product.category}`,
    `Quantidade: ${product.quantity}`,
    `Preço: ${product.price}`
  ]);

  const name = input("Novo nome (enter p/ manter)");
  const category = input("Nova categoria (enter p/ manter)");
  const quantity = input("Nova quantidade (enter p/ manter)");
  const price = input("Novo preço (enter p/ manter)");

  if (name) product.name = name;
  if (category) product.category = category;
  if (quantity) product.quantity = Number(quantity);
  if (price) product.price = Number(price);

  saveProducts(products);
  box("Sucesso", ["Produto atualizado"]);
}

function deleteProduct(products) {
  clear();

console.log("│ Excluir Produto:\n");

  const id = inputInt("Informe o ID");
  const index = products.findIndex(p => p.id === id);

  const product = findProductById(products, id);

  if (!product) {
    box("Erro", ["Produto não encontrado"]);
    return;
  }

  box("Dados Atuais", [
    `Nome: ${product.name}`,
    `Categoria: ${product.category}`,
    `Quantidade: ${product.quantity}`,
    `Preço: ${product.price}`
  ]);

  const confirm = input("Confirma exclusão? (s/n)");
  if (confirm.toLowerCase() === "s") {
    products.splice(index, 1);
    saveProducts(products);
    box("Sucesso", ["Produto removido"]);
  } else {
    box("Cancelado", ["Ação cancelada"]);
  }
}

function searchProduct(products) {
  clear();
  console.log("│ Buscar Produto:\n");

  const term = input("ID ou nome");
  let results = [];

  if (!isNaN(term)) {
    const p = findProductById(products, Number(term));
    if (p) results.push(p);
  } else {
    results = products.filter(p =>
      p.name.toLowerCase().includes(term.toLowerCase())
    );
  }

  if (results.length === 0) {
    box("Resultado", ["Nenhum produto encontrado"]);
  } else {
    listProducts(results);
  }
}

/* =====================================================
   MENU PRINCIPAL
===================================================== */

function menu() {
  const products = loadProducts();

  while (true) {
    clear();
    console.log("┌────────────────────────────────────────┐");
    console.log("│        AGILSTORE • INVENTÁRIO          │");
    console.log("├────────────────────────────────────────┤");
    console.log("│ 1 ▸ Adicionar produto                  │");
    console.log("│ 2 ▸ Listar produtos                    │");
    console.log("│ 3 ▸ Atualizar produto                  │");
    console.log("│ 4 ▸ Excluir produto                    │");
    console.log("│ 5 ▸ Buscar produto                     │");
    console.log("│                                        │");
    console.log("│ 0 ▸ Sair                               │");
    console.log("└────────────────────────────────────────┘");

    const op = readline.question("\n│ Escolha uma opção: ");

    switch (op) {
      case "1":
        addProduct(products);
        pause();
        break;
      case "2":
        clear();
        listProducts(products);
        pause();
        break;
      case "3":
        updateProduct(products);
        pause();
        break;
      case "4":
        deleteProduct(products);
        pause();
        break;
      case "5":
        searchProduct(products);
        pause();
        break;
      case "0":
        clear();
        box("Encerrando", ["Aplicação finalizada"]);
        return;
      default:
        box("Erro", ["Opção inválida"]);
        pause();
    }
  }
}

menu();
