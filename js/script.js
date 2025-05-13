let jsonData = null;

document.getElementById("fileElem").addEventListener("change", function(e) {
  const file = e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = function(event) {
    try {
      jsonData = JSON.parse(event.target.result);
      document.getElementById("file-name").innerText = file.name;
    } catch (err) {
      alert("Erro ao ler o JSON: " + err.message);
    }
  };
  reader.readAsText(file);
});

function fixJSON(data) {
  if (!Array.isArray(data)) {
    alert("O JSON deve ser um array de objetos.");
    return data;
  }

  return data.map(item => {
    const corrected = { ...item };

    // ifConcessora.codigo: padStart com 3 dígitos
    if (corrected.ifConcessora?.codigo !== undefined) {
      corrected.ifConcessora.codigo = String(corrected.ifConcessora.codigo).padStart(3, '0');
    }

    // cpf: string com 11 dígitos
    if (corrected.cpf !== undefined) {
      corrected.cpf = String(corrected.cpf).padStart(11, '0');
    }

    // numeroInscricaoEmpregador: garantir string
    if (corrected.numeroInscricaoEmpregador !== undefined) {
      corrected.numeroInscricaoEmpregador = String(corrected.numeroInscricaoEmpregador);
    }

    // numeroInscricaoEstabelecimento: garantir string
    if (corrected.numeroInscricaoEstabelecimento !== undefined) {
      corrected.numeroInscricaoEstabelecimento = String(corrected.numeroInscricaoEstabelecimento);
    }

    return corrected;
  });
}


function processJSON() {
  if (!jsonData) {
    alert("Nenhum JSON carregado.");
    return;
  }
  const correctedData = fixJSON(jsonData);
  const correctedText = JSON.stringify(correctedData, null, 2);
  const blob = new Blob([correctedText], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "json_corrigido.json";
  a.click();
  URL.revokeObjectURL(url);
}

