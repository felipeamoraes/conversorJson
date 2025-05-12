let jsonData;

document.getElementById('jsonFile').addEventListener('change', function (e) {
  const file = e.target.files[0];
  const reader = new FileReader();

  reader.onload = function (event) {
    try {
      jsonData = JSON.parse(event.target.result);
      document.getElementById('output').textContent = JSON.stringify(jsonData, null, 2);
    } catch (err) {
      alert("Arquivo inválido: " + err.message);
    }
  };

  reader.readAsText(file);
});

function corrigirJSON() {
  if (!jsonData) {
    alert("Carregue um arquivo JSON primeiro.");
    return;
  }

  if (Array.isArray(jsonData)) {
    jsonData = jsonData.map(item => corrigirItem(item));
  } else {
    jsonData = corrigirItem(jsonData);
  }

  const jsonString = JSON.stringify(jsonData, null, 2);
  document.getElementById('output').textContent = jsonString;

  const blob = new Blob([jsonString], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.getElementById('downloadLink');
  link.href = url;
  link.download = 'json_corrigido.json';
  link.style.display = 'inline-block';
  link.textContent = '📥 Baixar JSON Corrigido';
}

function corrigirItem(item) {
  if (item.ifConcessora?.codigo) {
    item.ifConcessora.codigo = item.ifConcessora.codigo.toString().padStart(3, '0');
  }
  if (item.cpf) {
    item.cpf = item.cpf.toString().padStart(11, '0');
  }
  if (item.numeroInscricaoEmpregador !== undefined) {
    item.numeroInscricaoEmpregador = item.numeroInscricaoEmpregador.toString();
  }
  if (item.numeroInscricaoEstabelecimento !== undefined) {
    item.numeroInscricaoEstabelecimento = item.numeroInscricaoEstabelecimento.toString();
  }
  return item;
}

function limparTudo() {
  document.getElementById('jsonFile').value = '';
  document.getElementById('output').textContent = 'Carregue um arquivo JSON para visualizar aqui...';
  document.getElementById('downloadLink').style.display = 'none';
  jsonData = null;
}
