let originalJSON = {};
let fixedJSON = {};

const dropArea = document.getElementById('drop-area');
const fileElem = document.getElementById('fileElem');
const fileNameDisplay = document.getElementById('fileName');
const output = document.getElementById('output');

// Upload por arrastar e soltar
dropArea.addEventListener('dragover', (e) => {
  e.preventDefault();
  dropArea.classList.add('hover');
});

dropArea.addEventListener('dragleave', () => {
  dropArea.classList.remove('hover');
});

dropArea.addEventListener('drop', (e) => {
  e.preventDefault();
  dropArea.classList.remove('hover');
  handleFile(e.dataTransfer.files[0]);
});

fileElem.addEventListener('change', (e) => {
  handleFile(e.target.files[0]);
});

function handleFile(file) {
  if (!file.name.endsWith('.json')) {
    alert('Por favor, selecione um arquivo .json');
    return;
  }

  const reader = new FileReader();
  reader.onload = function (e) {
    try {
      originalJSON = JSON.parse(e.target.result);
      output.textContent = JSON.stringify(originalJSON, null, 2);
      fileNameDisplay.textContent = file.name;
      fileNameDisplay.classList.remove('hidden');
    } catch (err) {
      alert('Erro ao ler o JSON: ' + err.message);
    }
  };
  reader.readAsText(file);
}

function applyFixes() {
  fixedJSON = fixJSON(originalJSON);
  output.textContent = JSON.stringify(fixedJSON, null, 2);
}

function fixJSON(data) {
  // Exemplo: transforma chaves em minúsculas
  const newData = {};
  for (const key in data) {
    newData[key.toLowerCase()] = data[key];
  }
  return newData;
}

function downloadJSON() {
  const blob = new Blob([JSON.stringify(fixedJSON, null, 2)], { type: 'text/plain' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = 'corrigido.txt';
  link.click();
}
