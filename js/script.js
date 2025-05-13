let jsonData = null;

document.addEventListener("DOMContentLoaded", function () {
  const dropZone = document.getElementById("dropZone");
  const fileInput = document.getElementById("fileInput");
  const fileNameInput = document.getElementById("fileName");

  dropZone.addEventListener("dragover", function (e) {
    e.preventDefault();
    dropZone.classList.add("hover");
  });

  dropZone.addEventListener("dragleave", function () {
    dropZone.classList.remove("hover");
  });

  dropZone.addEventListener("drop", function (e) {
    e.preventDefault();
    dropZone.classList.remove("hover");
    const file = e.dataTransfer.files[0];
    handleFile(file);
  });

  fileInput.addEventListener("change", function () {
    const file = fileInput.files[0];
    handleFile(file);
  });

  function handleFile(file) {
    const reader = new FileReader();
    reader.onload = function (e) {
      try {
        jsonData = JSON.parse(e.target.result);
        fileNameInput.value = file.name;
      } catch (err) {
        alert("Arquivo JSON inválido.");
        jsonData = null;
      }
    };
    reader.readAsText(file);
  }
});

function corrigirCampos(obj) {
  if (obj.ifConcessora?.codigo) {
    obj.ifConcessora.codigo = obj.ifConcessora.codigo.toString().padStart(3, "0");
  }

  if (obj.cpf) {
    obj.cpf = obj.cpf.toString().padStart(11, "0");
  }

  if (obj.numeroInscricaoEmpregador) {
    obj.numeroInscricaoEmpregador = obj.numeroInscricaoEmpregador.toString();
  }

  if (obj.numeroInscricaoEstabelecimento) {
    obj.numeroInscricaoEstabelecimento = obj.numeroInscricaoEstabelecimento.toString();
  }

  return obj;
}

function downloadJSON() {
  if (!jsonData) {
    alert("Nenhum arquivo JSON carregado.");
    return;
  }

  let dataCorrigida;

  if (Array.isArray(jsonData)) {
    dataCorrigida = jsonData.map(item => corrigirCampos(item));
  } else {
    dataCorrigida = corrigirCampos(jsonData);
  }

  const blob = new Blob([JSON.stringify(dataCorrigida, null, 2)], {
    type: "application/json"
  });

  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "json_corrigido.json";
  a.click();
}
