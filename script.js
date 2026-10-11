const furnitureProfiles = {
  desk: {
    name: 'Study Desk',
    base: 180,
    labor: 22,
    steps: [
      'Cut the top board to the selected width and depth.',
      'Prepare the legs and secure them with strong corner brackets.',
      'Sand all edges and apply the chosen finish to match the board color.',
      'Assemble the frame, check balance, and tighten all connections.'
    ]
  },
  bookshelf: {
    name: 'Bookshelf',
    base: 220,
    labor: 24,
    steps: [
      'Measure and cut the side panels, shelves, and top section.',
      'Mark shelf spacing evenly for a balanced layout.',
      'Mount each shelf using dowels or reinforced brackets.',
      'Finish the surfaces and install the backing panel for stability.'
    ]
  },
  table: {
    name: 'Dining Table',
    base: 260,
    labor: 28,
    steps: [
      'Cut the tabletop and edge trim to the required proportions.',
      'Build the leg assembly and align each support with the center.',
      'Attach the frame to the table top with durable connectors.',
      'Sand, finish, and check that the top sits level across all corners.'
    ]
  },
  wardrobe: {
    name: 'Wardrobe',
    base: 320,
    labor: 30,
    steps: [
      'Cut the side wall panels, doors, and internal frame sections.',
      'Build the main carcass and ensure the corners are square.',
      'Install the doors, hanging rail, and optional shelf compartments.',
      'Finish the assembly with edge treatment and alignment checking.'
    ]
  }
};

const materialProfiles = {
  pine: { label: 'Pine Wood', cost: 18, note: 'Soft, light, and budget-friendly for general furniture.' },
  oak: { label: 'Oak Wood', cost: 24, note: 'Strong, durable, and ideal for daily-use furniture.' },
  walnut: { label: 'Walnut Wood', cost: 32, note: 'Premium grain with elegant finish and rich warmth.' },
  mdf: { label: 'Premium MDF', cost: 20, note: 'Smooth finish and cost-effective for painted custom pieces.' }
};

const colorSwatches = document.querySelectorAll('.color-swatch');
const furnitureType = document.getElementById('furnitureType');
const material = document.getElementById('material');
const width = document.getElementById('width');
const height = document.getElementById('height');
const depth = document.getElementById('depth');
const quantity = document.getElementById('quantity');
const drawerOption = document.getElementById('drawerOption');
const shelfOption = document.getElementById('shelfOption');
const finishOption = document.getElementById('finishOption');

const boardPreview = document.getElementById('boardPreview');
const selectedFurniture = document.getElementById('selectedFurniture');
const selectedColor = document.getElementById('selectedColor');
const dimensionsText = document.getElementById('dimensionsText');
const totalPrice = document.getElementById('totalPrice');
const quoteSummary = document.getElementById('quoteSummary');
const buildSteps = document.getElementById('buildSteps');
const materialInfo = document.getElementById('materialInfo');

let selectedColorHex = '#8d6e63';
let selectedColorName = 'Walnut Brown';

function getFurnitureConfig() {
  return furnitureProfiles[furnitureType.value];
}

function getMaterialConfig() {
  return materialProfiles[material.value];
}

function formatCurrency(amount) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0
  }).format(amount);
}

function buildBoardPreview() {
  boardPreview.style.background = `linear-gradient(135deg, ${selectedColorHex}, ${adjustBrightness(selectedColorHex, 18)})`;
}

function adjustBrightness(hex, amount) {
  const value = hex.replace('#', '');
  const num = parseInt(value, 16);
  const r = Math.min(255, Math.max(0, (num >> 16) + amount));
  const g = Math.min(255, Math.max(0, ((num >> 8) & 0x00ff) + amount));
  const b = Math.min(255, Math.max(0, (num & 0x0000ff) + amount));
  return `rgb(${r}, ${g}, ${b})`;
}

function updateQuote() {
  const furniture = getFurnitureConfig();
  const materialConfig = getMaterialConfig();
  const widthValue = Number(width.value) || 0;
  const heightValue = Number(height.value) || 0;
  const depthValue = Number(depth.value) || 0;
  const unitQty = Number(quantity.value) || 1;

  const surfaceArea = (widthValue * heightValue + widthValue * depthValue + heightValue * depthValue) / 100;
  const boardCost = surfaceArea * materialConfig.cost * 1.2;
  const extraDrawerCost = drawerOption.checked ? 55 : 0;
  const shelfCost = shelfOption.checked ? 45 : 0;
  const premiumFinish = finishOption.checked ? 65 : 0;
  const laborCost = furniture.labor * surfaceArea * unitQty;

  const total = (boardCost + laborCost + extraDrawerCost + shelfCost + premiumFinish) * unitQty;

  selectedFurniture.textContent = furniture.name;
  dimensionsText.textContent = `${widthValue} × ${heightValue} × ${depthValue} cm`;
  totalPrice.textContent = formatCurrency(total);

  quoteSummary.textContent = `${materialConfig.label} • ${selectedColorName} • ${unitQty} unit${unitQty > 1 ? 's' : ''}`;
}

function updateSteps() {
  const furniture = getFurnitureConfig();
  buildSteps.innerHTML = furniture.steps.map((step) => `<li>${step}</li>`).join('');

  const materialConfig = getMaterialConfig();
  materialInfo.innerHTML = `
    <li>${materialConfig.note}</li>
    <li>Recommended thickness: 18 mm board for everyday use.</li>
    <li>Best finish pairing: ${selectedColorName} with a low-sheen lacquer.</li>
  `;
}

function updateSelection() {
  buildBoardPreview();
  selectedColor.textContent = selectedColorName;
  updateQuote();
  updateSteps();
}

colorSwatches.forEach((swatch) => {
  swatch.addEventListener('click', function () {
    colorSwatches.forEach((button) => button.classList.remove('active'));
    this.classList.add('active');
    selectedColorHex = this.dataset.color;
    selectedColorName = this.dataset.name;
    updateSelection();
  });
});

[furnitureType, material, width, height, depth, quantity, drawerOption, shelfOption, finishOption].forEach((element) => {
  element.addEventListener('input', updateSelection);
  element.addEventListener('change', updateSelection);
});

updateSelection();
