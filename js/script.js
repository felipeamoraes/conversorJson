let originalJsonData = null;

document.getElementById("fileInput").addEventListener("change", handleFileSelect);
document.getElementById("dropZone").addEventListener("dragover", handleDragOver);
document.getElementById("dropZone").addEventListener("drop", handleFileDrop);

function handleFileSelect(event) {
  const file = event.target.files[0];
  readFile(file);
}

function handleDragOver(event) {
  event.preventDefault();
  event.dataTransfer.dropEffect = "copy";
}

function handleFileDrop(event) {
  event.preventDefault();
  const file = event.dataTransfer.files[0];
  readFile(file);
}

function readFile(file) {
  if (!file || file.type !== "application/json") {
    alert("Por favor, envie um arquivo JSON válido.");
    return;
  }

  const reader = new FileReader();
  reader.onload = function (e) {
    try {
      originalJsonData = JSON.parse(e.target.result);
      document.getElementById("fileName").value = file.name;
    } catch (err) {
      alert("Erro ao ler o JSON: " + err.message);
    }
  };
  reader.readAsText(file);
}

function fixJSON(data) {
  if (!Array.isArray(data)) {
    alert("O JSON deve ser um array de objetos.");
    return data;
  }

  return data.map(item => {
    const corrected = { ...item };

    // Garantir estrutura aninhada
    if (!corrected.ifConcessora) corrected.ifConcessora = {};

    // ifConcessora.codigo: 3 dígitos
    if (corrected.ifConcessora.codigo !== undefined) {
      corrected.ifConcessora.codigo = String(corrected.ifConcessora.codigo).padStart(3, '0');
    }

    // cpf: 11 dígitos como string
    if (corrected.cpf !== undefined) {
      corrected.cpf = String(corrected.cpf).padStart(11, '0');
    }

    // numeroInscricaoEmpregador como string
    if (corrected.numeroInscricaoEmpregador !== undefined) {
      corrected.numeroInscricaoEmpregador = String(corrected.numeroInscricaoEmpregador);
    }

    // numeroInscricaoEstabelecimento como string
    if (corrected.numeroInscricaoEstabelecimento !== undefined) {
      corrected.numeroInscricaoEstabelecimento = String(corrected.numeroInscricaoEstabelecimento);
    }

    return corrected;
  });
}

function downloadJSON() {
  if (!originalJsonData) {
    alert("Carregue um arquivo JSON primeiro.");
    return;
  }

  const correctedJsonData = fixJSON(originalJsonData);

  const blob = new Blob([JSON.stringify(correctedJsonData, null, 2)], {
    type: "application/json"
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;

  const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
  a.download = `json_corrigido_${timestamp}.json`;

  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
