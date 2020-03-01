const moment = require("moment");

//POST
exports.postRequest = (req, res) => {
  let transaction = req.body;

  // Valores do request
  const parcelamento = transaction.parcelamento;
  const valorCompra = transaction.valor_compra.toFixed(2);
  const bandeira = transaction.bandeira.toUpperCase();
  const dataCompra = moment(transaction.data_compra).format("YYYY-MM-DD");
  const diaHoje = moment(Date.now()).format("YYYY-MM-DD");

  // Realiza as validações necessárias (regras de negócio)
  if (parcelamento > 12 || moment(dataCompra).isAfter(diaHoje) == true) {
    return res.status(200).send({
      transacao_success: false
    });
  } else {
    // Mascara o número do cartão de crédito
    const cartaoMasc = transaction.cartao_credito.slice(12, 16);

    // Realiza as trasformações necessárias
    const taxaRepasse = calcularRepasse();
    const pagamentoLiq = calcularPgmtoLiq();
    const parcelas = calcularParcelas();

    // Devolve para o solicitante o resultado da transação
    const response = new Object();
    response.transacao_success = true;
    response.cartao_credito_mascarado = cartaoMasc;
    response.total_parcelas = parcelamento;
    response.pagamentos = parcelas;
    response.valor_compra = valorCompra;
    response.valor_pagamento = pagamentoLiq;
    response.percentual_repasse = `${taxaRepasse}%`;
    console.log(response);
    return res.status(200).send(response);
  }

  // determina o percentual de repasse baseado na bandeira do cartão
  function calcularRepasse() {
    if (bandeira == "MASTER") {
      return 5;
    } else if (bandeira == "VISA") {
      return 3;
    } else {
      return 4.9;
    }
  }

  // calcula o valor do pagamento após o desconto
  function calcularPgmtoLiq() {
    const taxaCartao = calcularRepasse() / 100;
    const desconto = valorCompra * taxaCartao;
    return valorCompra - desconto;
  }

  // Define as informações de cada parcela
  function calcularParcelas() {
    // Cálculo do valor de cada parcela
    const valorParcela = (calcularPgmtoLiq() / parcelamento).toFixed(2);

    // Define datas de pagamento de cada parcela
    let resultado = "";
    let parcelas = [];

    for (i = 1; i < parcelamento + 1; i++) {
      resultado = moment(dataCompra).add(i, "months");
      let data = moment(resultado).format("YYYY-MM-DD");
      parcelas.push({
        data_pagamento: data,
        valor: parseFloat(valorParcela),
        parcela: i
      });
    }
    return parcelas;
  }
};
