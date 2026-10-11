const furnitureProfiles = {
  desk: {
    name: 'Study Desk',
    base: 180,
    labor: 22,
    steps: [
      'Cut the top panel to the required dimensions and smooth all edges.',
      'Assemble the leg frame and reinforce each corner for daily stability.',
      'Attach the top surface and check for even balance across the full length.',
      'Apply the final finish, seal the surface, and polish the natural grain.'
    ]
  },
  bookshelf: {
    name: 'Bookshelf',
    base: 220,
    labor: 24,
    steps: [
      'Measure and cut the vertical panels, shelves, and top board carefully.',
      'Mark each shelf position evenly to keep the design clean and balanced.',
      'Secure each shelf using strong connectors and reinforce the structure.',
      'Finish the exposed edges and install the back panel for rigidity.'
    ]
  },
  table: {
    name: 'Dining Table',
    base: 260,
    labor: 28,
    steps: [
      'Shape the tabletop and trim the board edges for a polished look.',
      'Build the support frame around the center for even weight distribution.',
      'Fix the frame to the top with durable connectors and test for wobble.',
      'Sand the surface and finish it with a durable protective coating.'
    ]
  },
  wardrobe: {
    name: 'Wardrobe',
    base: 320,
    labor: 30,
    steps: [
      'Cut the side panels, doors, and interior partitions according to the design.',
      'Assemble the carcass and confirm the outer frame stays square.',
      'Install the doors, rails, and shelving support before finishing details.',
      'Adjust the alignment, add the final interior units, and inspect the finish.'
    ]
  }
};

const materialProfiles = {
  pine: {
    label: 'Pine Wood',
    cost: 18,
    note: 'Warm, affordable, and ideal for everyday family furniture.'
  },
  oak: {
    label: 'Oak Wood',
    cost: 24,
    note: 'Strong and timeless with excellent durability for long-term use.'
  },
  walnut: {
    label: 'Walnut Wood',
    cost: 32,
    note: 'Luxury grain and premium finish for elevated interior pieces.'
  },
  mdf: {
    label: 'Premium MDF',
    cost: 20,
    note: 'Smooth painted finish and excellent value for tailored custom styles.'
  }
};

const furnitureType = document.getElementById('furnitureType');
const material = document.getElementById('material');
const width = document.getElementById('width');
const height = document.getElementById('height');
const depth = document.getElementById('depth');
const quantity = document.getElementById('quantity');
const drawerOption = document.getElementById('drawerOption');
const shelfOption = document.getElementById('shelfOption');
const finishOption = document.getElementById('finishOption');

const selectedFurniture = document.getElementById('selectedFurniture');
const selectedColor = document.getElementById('selectedColor');
const dimensionsText = document.getElementById('dimensionsText');
const totalPrice = document.getElementById('totalPrice');
const quoteSummary = document.getElementById('quoteSummary');
const boardPreview = document.getElementById('boardPreview');
const buildSteps = document.getElementById('buildSteps');
const materialInfo = document.getElementById('materialInfo');

const heroFurniture = document.getElementById('heroFurniture');
const colorSwatches = document.querySelectorAll('.color-swatch');

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

function adjustColor(hex, amount) {
  const value = hex.replace('#', '');
  const num = parseInt(value, 16);
  const r = Math.min(255, Math.max(0, (num >> 16) + amount));
  const g = Math.min(255, Math.max(0, ((num >> 8) & 0x00ff) + amount));
  const b = Math.min(255, Math.max(0, (num & 0x0000ff) + amount));
  return `rgb(${r}, ${g}, ${b})`;
}

function updatePreviewColors() {
  const primary = selectedColorHex;
  const highlight = adjustColor(primary, 28);
  boardPreview.style.background = `linear-gradient(135deg, ${primary}, ${highlight})`;
  heroFurniture.style.background = `linear-gradient(135deg, ${primary}, ${adjustColor(primary, 18)})`;
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
  const drawerCost = drawerOption.checked ? 55 : 0;
  const shelfCost = shelfOption.checked ? 45 : 0;
  const finishCost = finishOption.checked ? 65 : 0;
  const laborCost = furniture.labor * surfaceArea * unitQty;

  const total = (boardCost + laborCost + drawerCost + shelfCost + finishCost) * unitQty;

  selectedFurniture.textContent = furniture.name;
  dimensionsText.textContent = `${widthValue} × ${heightValue} × ${depthValue} cm`;
  totalPrice.textContent = formatCurrency(total);
  quoteSummary.textContent = `${materialConfig.label} • ${selectedColorName} • ${unitQty} unit${unitQty > 1 ? 's' : ''}`;
}

function updateSteps() {
  const furniture = getFurnitureConfig();
  const materialConfig = getMaterialConfig();

  buildSteps.innerHTML = furniture.steps.map((step) => `<li>${step}</li>`).join('');
  materialInfo.innerHTML = `
    <li>${materialConfig.note}</li>
    <li>Recommended panel thickness: 18 mm for everyday residential furniture.</li>
    <li>Suggested finish pairing: ${selectedColorName} with a satin clear coat.</li>
  `;
}

function refreshUI() {
  selectedColor.textContent = selectedColorName;
  updatePreviewColors();
  updateQuote();
  updateSteps();
}

colorSwatches.forEach((swatch) => {
  swatch.addEventListener('click', () => {
    colorSwatches.forEach((button) => button.classList.remove('active'));
    swatch.classList.add('active');
    selectedColorHex = swatch.dataset.color;
    selectedColorName = swatch.dataset.name;
    refreshUI();
  });
});

[furnitureType, material, width, height, depth, quantity, drawerOption, shelfOption, finishOption].forEach((element) => {
  element.addEventListener('input', refreshUI);
  element.addEventListener('change', refreshUI);
});

refreshUI();
