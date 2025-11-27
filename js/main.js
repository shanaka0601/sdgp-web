// Simple demo JS for prescription scanning landing page

const prescriptionInput = document.getElementById('prescriptionInput');
const scanBtn = document.getElementById('scanBtn');
const scanStatus = document.getElementById('scanStatus');
const resultsContainer = document.getElementById('results');

// Sample medicines list used for demo extraction (fallback)
const SAMPLE_MEDICINES = [
  'Amoxicillin 500mg',
  'Paracetamol 500mg',
  'Ibuprofen 200mg',
  'Cetirizine 10mg',
  'Metformin 500mg'
];

function clearResults() {
  resultsContainer.innerHTML = '';
}

function renderPlaceholder() {
  resultsContainer.innerHTML = '<p class="muted">No scan yet. Upload a prescription and click "Scan & Extract" to try a demo.</p>';
}

function renderMedicineCard(name) {
  const card = document.createElement('div');
  card.className = 'card';
  card.innerHTML = `
    <h3>${name}</h3>
    <p>Quantity: <select aria-label="quantity-select"><option>1</option><option>2</option><option>3</option></select></p>
    <p><button class="btn primary" data-medicine="${name}">Order Now</button></p>
  `;
  resultsContainer.appendChild(card);
}

function simulateExtraction(file) {
  // In a real app you'd call OCR here (e.g. Tesseract or backend OCR service).
  // This demo simulates a short delay and returns a small random selection of sample medicines.
  return new Promise((resolve) => {
    setTimeout(() => {
      // pick 2-4 random sample medicines
      const count = 2 + Math.floor(Math.random() * 3);
      const shuffled = SAMPLE_MEDICINES.sort(() => 0.5 - Math.random());
      resolve(shuffled.slice(0, count));
    }, 1400);
  });
}

async function runScan() {
  const file = prescriptionInput.files && prescriptionInput.files[0];
  if (!file) {
    alert('Please select an image of the prescription first.');
    return;
  }
  scanStatus.textContent = 'Scanning...';
  scanBtn.disabled = true;
  clearResults();
  try {
    const medicines = await simulateExtraction(file);
    scanStatus.textContent = `Found ${medicines.length} medicine(s)`;
    medicines.forEach(renderMedicineCard);
  } catch (err) {
    scanStatus.textContent = 'Scan failed. Try again.';
    renderPlaceholder();
  } finally {
    scanBtn.disabled = false;
  }
}

// Delegate click for Order Now buttons
resultsContainer && resultsContainer.addEventListener('click', (e) => {
  if (e.target && e.target.matches('button[data-medicine]')) {
    const med = e.target.getAttribute('data-medicine');
    // For demo, we simply show an alert. Replace with actual ordering flow.
    alert(`Order placed for: ${med}\nOur partner pharmacy will contact you to confirm.`);
  }
});

scanBtn && scanBtn.addEventListener('click', runScan);

// Initialize placeholder
renderPlaceholder();

// Allow pressing Enter on file select area to trigger scan for accessibility
prescriptionInput && prescriptionInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') {
    runScan();
  }
});
