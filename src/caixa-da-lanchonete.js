class CaixaDaLanchonete {
  constructor() {
    this.cardapio = [
      { codigo: "cafe", descricao: "Café", valor: 3.0 },
      { codigo: "chantily", descricao: "Chantily (extra do Café)", valor: 1.5 },
      { codigo: "suco", descricao: "Suco Natural", valor: 6.2 },
      { codigo: "sanduiche", descricao: "Sanduíche", valor: 6.5 },
      {
        codigo: "queijo",
        descricao: "Queijo (extra do Sanduíche)",
        valor: 2.0,
      },
      { codigo: "salgado", descricao: "Salgado", valor: 7.25 },
      { codigo: "combo1", descricao: "1 Suco e 1 Sanduíche", valor: 9.5 },
      { codigo: "combo2", descricao: "1 Café e 1 Sanduíche", valor: 7.5 },
    ];
  }

  calcularValorDaCompra(metodoDePagamento, itens) {
    const itensExtrasSelecionados = new Set();
    const itensPrincipaisSelecionados = new Set();
    const codigosItensPrincipais = new Set([
      "cafe",
      "suco",
      "sanduiche",
      "salgado",
      "combo1",
      "combo2",
    ]);
    const codigosItensValidos = new Set([
      "cafe",
      "chantily",
      "suco",
      "sanduiche",
      "queijo",
      "salgado",
      "combo1",
      "combo2",
    ]);
    const formasPagamentoValidas = new Set(["debito", "credito", "dinheiro"]);
    const itensExtrasDoPrincipal = {
      cafe: ["chantily"],
      sanduiche: ["queijo"],
      combo1: ["queijo"],
      combo2: ["chantily", "queijo"]
    };
    const extrasPermitidosNosCombos = {
      combo1: ["suco", "sanduiche"],
      combo2: ["cafe", "sanduiche"],
    };

    if (itens.length === 0) {
      return "Não há itens no carrinho de compra!";
    }

    for (const itemPedido of itens) {
      const [_, quantidade] = itemPedido.split(",");

      if (parseInt(quantidade) <= 0) {
        return "Quantidade inválida!";
      }
    }

    for (const itemPedido of itens) {
      const [codigo, _] = itemPedido.split(",");

      if (!codigosItensValidos.has(codigo)) {
        return "Item inválido!";
      }
    }

    if (!formasPagamentoValidas.has(metodoDePagamento)) {
      return "Forma de pagamento inválida!";
    }

    for (const itemPedido of itens) {
      const [codigo, _] = itemPedido.split(",");

      // Verificar se o item é um extra permitido nos combos
      if (extrasPermitidosNosCombos[codigo]) {
        for (const extra of extrasPermitidosNosCombos[codigo]) {
          itensExtrasSelecionados.add(extra);
        }
      }

      if (codigosItensPrincipais.has(codigo)) {
        itensPrincipaisSelecionados.add(codigo);

        // Verificar se o item tem extras e adicionar ao conjunto de extras selecionados
        if (itensExtrasDoPrincipal[codigo]) {
          itensExtrasSelecionados.add(...itensExtrasDoPrincipal[codigo]);
        }
      }
    }

    for (const itemPedido of itens) {
      const [codigo, _] = itemPedido.split(",");

      if (codigosItensPrincipais.has(codigo)) {
        itensPrincipaisSelecionados.add(codigo);

        if (itensExtrasDoPrincipal[codigo]) {
          for (const extra of itensExtrasDoPrincipal[codigo]) {
            itensExtrasSelecionados.add(extra);
          }
        }
      } else if (itensExtrasSelecionados.has(codigo)) {
        itensExtrasSelecionados.add(codigo);
      } else {
        return "Item extra não pode ser pedido sem o principal";
      }
    }

    const valorDosItens = itens.map((itemPedido) => {
      const [codigo, quantidade] = itemPedido.split(",");
      const itemCardapio = this.cardapio.find((item) => item.codigo === codigo);
      if (itemCardapio) {
        return itemCardapio.valor * parseInt(quantidade);
      }
    });

    var valorTotal = valorDosItens.reduce((acc, valor) => acc + valor, 0);
    metodoDePagamento == "dinheiro"
      ? (valorTotal -= (valorTotal * 5) / 100)
      : metodoDePagamento == "credito"
      ? (valorTotal += (valorTotal * 3) / 100)
      : 0;

    return `R$ ${valorTotal.toFixed(2).replace(".", ",")}`;
  }
}

export { CaixaDaLanchonete };
