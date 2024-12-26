<!-- Gradient Button Generator -->
<div id="gradient-button-generator">    
      <div class="gbg-color-swatches">
        <h3 class="gbg-tool-title">Color Swatches</h3>
        <div id="gbg-swatches-container"></div>
      </div>
    
      <div class="gbg-main-content">
        <h2 class="gbg-tool-title">Gradient Button Generator</h2>
        
<div class="gbg-compact-group">
  <div class="gbg-input-group" style="flex: 1;">
    <label class="gbg-input-label">Button Type</label>
    <select id="gbg-button-type" class="gbg-input-field">
      <option value="primary">Primary Button</option>
      <option value="secondary">Secondary Button</option>
      <option value="tertiary">Tertiary Button</option>
    </select>
  </div>
  
  <div class="gbg-input-group" style="width: 200px;">
    <label class="gbg-input-label" title="Optional: Target specific section or block">Block/Section ID (Optional)</label>
    <input type="text" id="gbg-block-id" class="gbg-input-field" placeholder="Optional">
  </div>
</div>
    
        <!-- Add this right after the button type selection, before the gradient colors div -->
    <div class="gbg-gradient-type-control">
      <label class="gbg-input-label">Gradient Type</label>
      <div class="gbg-radio-group">
        <label class="gbg-radio-label">
          <input type="radio" name="gradientType" value="linear" checked class="gbg-radio-input">
          Linear
        </label>
        <label class="gbg-radio-label">
          <input type="radio" name="gradientType" value="radial" class="gbg-radio-input">
          Radial
        </label>
      </div>
    </div>
    
    <div id="gbg-angle-control" class="gbg-angle-control">
      <label class="gbg-input-label">Gradient Angle</label>
      <div class="gbg-angle-input-group">
        <input type="range" id="gbg-angle-slider" min="0" max="360" value="90" class="gbg-angle-slider">
        <input type="number" id="gbg-angle-number" min="0" max="360" value="90" class="gbg-angle-number">
        <span class="gbg-angle-unit">°</span>
      </div>
    </div>

<!-- Replace the unified grid div with this updated structure -->
<!-- First, a container for gradient colors -->
<div id="gbg-gradient-colors"></div>

<!-- Then, a separate unified grid for the rest of the inputs -->
<div class="gbg-unified-grid">
  <div class="gbg-input-group">
    <label class="gbg-input-label">Text Color</label>
    <input type="text" id="gbg-text-color" class="gbg-input-field" placeholder="e.g., #EBE8E0">
  </div>

  <div class="gbg-input-group">
    <label class="gbg-input-label">Border Color</label>
    <input type="text" id="gbg-border-color" class="gbg-input-field" placeholder="e.g., #000000">
  </div>

  <div class="gbg-input-group">
    <label class="gbg-input-label">Expand on Hover</label>
    <select id="gbg-expand-hover" class="gbg-input-field">
      <option value="no">No</option>
      <option value="yes">Yes</option>
    </select>
  </div>

  <div class="gbg-input-group">
    <label class="gbg-input-label">Shadow Color on Hover</label>
    <input type="text" id="gbg-shadow-color" class="gbg-input-field" placeholder="e.g., #4ea8de">
  </div>

  <div class="gbg-button-row" style="grid-column: 1 / -1;">
    <button onclick="gbgGenerateCssCode()" class="gbg-action-button gbg-generate-button">Generate Code</button>
    <button onclick="gbgCopyToClipboard()" class="gbg-action-button gbg-copy-button">Copy Code</button>
    <button onclick="gbgClearFields()" class="gbg-action-button gbg-clear-button">Clear All</button>
  </div>

  <textarea id="gbg-output" readonly placeholder="Generated CSS will appear here..." style="grid-column: 1 / -1;"></textarea>
</div>
    

    // Color conversion utilities
    const gbgColorUtils = {
      hexToHSL(hex) {
        let r = parseInt(hex.slice(1,3), 16) / 255;
        let g = parseInt(hex.slice(3,5), 16) / 255;
        let b = parseInt(hex.slice(5,7), 16) / 255;
        
        let max = Math.max(r, g, b);
        let min = Math.min(r, g, b);
        let h, s, l = (max + min) / 2;
    
        if (max === min) {
          h = s = 0;
        } else {
          let d = max - min;
          s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
          switch(max) {
            case r: h = (g - b) / d + (g < b ? 6 : 0); break;
            case g: h = (b - r) / d + 2; break;
            case b: h = (r - g) / d + 4; break;
          }
          h /= 6;
        }
    
        return [h * 360, s * 100, l * 100];
      },
    
      hslToHex(h, s, l) {
        l /= 100;
        const a = s * Math.min(l, 1 - l) / 100;
        const f = n => {
          const k = (n + h / 30) % 12;
          const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
          return Math.round(255 * color).toString(16).padStart(2, '0');
        };
        return `#${f(0)}${f(8)}${f(4)}`;
      },
    
      getComplementaryColors(hex) {
        const [h, s, l] = this.hexToHSL(hex);
        return [
          this.hslToHex((h + 120) % 360, s, l), // Triadic 1
          this.hslToHex((h + 240) % 360, s, l), // Triadic 2
        ];
      }
    };
      
    
    // Modify the existing gradient generation function
function gbgGenerateCssCode() {
  const buttonType = document.getElementById('gbg-button-type').value;
  const blockId = formatSquarespaceId(document.getElementById('gbg-block-id').value);
  const gradientType = document.querySelector('input[name="gradientType"]:checked').value;
  const gradientAngle = document.getElementById('gbg-angle-slider').value;
  
  const colors = [];
  for (let i = 0; i < 6; i++) { // Updated to 6 colors
    const colorValue = document.getElementById(`gbg-gradient-color-${i}`).value;
    if (colorValue) {
      const formattedColor = formatHexColor(colorValue);
      if (formattedColor) colors.push(formattedColor);
    }
  }
    
      const textColor = document.getElementById('gbg-text-color').value || '#EBE8E0';
      const borderColor = document.getElementById('gbg-border-color').value;
      const expandHover = document.getElementById('gbg-expand-hover').value;
      const shadowColor = document.getElementById('gbg-shadow-color').value;
    
      const gradientStyle = gradientType === 'linear' 
        ? `linear-gradient(${gradientAngle}deg, ${colors.join(', ')})`
        : `radial-gradient(circle, ${colors.join(', ')})`;
    
      const code = `<style>
    /* Gradient Button */
    .sqs-button-element--${buttonType} {
      background: ${gradientStyle} !important;
      color: ${textColor} !important;
      ${borderColor ? `border: 2px solid ${borderColor} !important;` : 'border: none !important;'}
    }
    .sqs-button-element--${buttonType}:hover {
      background: ${gradientType === 'linear' 
        ? `linear-gradient(${(Number(gradientAngle) + 180) % 360}deg, ${colors.join(', ')})`
        : `radial-gradient(circle at center, ${[...colors].reverse().join(', ')})`
      } !important;
      ${expandHover === 'yes' ? 'transform: scale(1.05);' : ''}
      ${shadowColor ? `box-shadow: 0 4px 8px ${shadowColor};` : ''}
    }
    </style>`;
    
      document.getElementById('gbg-output').value = code;
    }
    
    // Update preview function
    function gbgUpdatePreview() {
      // ... (keep your existing preview update code)
    }
    
    // Add angle control synchronization
    document.getElementById('gbg-angle-slider').addEventListener('input', (e) => {
      document.getElementById('gbg-angle-number').value = e.target.value;
      gbgUpdatePreview();
    });
    
    document.getElementById('gbg-angle-number').addEventListener('input', (e) => {
      document.getElementById('gbg-angle-slider').value = e.target.value;
      gbgUpdatePreview();
    });
    
    // Update initialization
    window.onload = () => {
      gbgInitializeColorInputs();
      document.querySelector('input[name="gradientType"]').checked = true;
      gbgUpdatePreview();
    };
    </script>
    
    
      <script>
    // Updated color swatches data with extra light variations
    const gbgColorSwatches = {
      Basics: [
        { name: 'Pure White', value: '#FFFFFF' },
        { name: 'Snow White', value: '#F5F5F5' },
        { name: 'Light Gray', value: '#D3D3D3' },
        { name: 'Medium Gray', value: '#808080' },
        { name: 'Dark Gray', value: '#404040' },
        { name: 'Pure Black', value: '#000000' }
      ],
      Blues: [
        { name: 'Arctic Blue', value: '#E3F2FD' },
        { name: 'Light Sky', value: '#87CEFA' },
        { name: 'Dodger Blue', value: '#1E90FF' },
        { name: 'Royal Blue', value: '#4169E1' },
        { name: 'Navy Blue', value: '#000080' },
        { name: 'Dark Navy', value: '#00005A' }
      ],
      Greens: [
        { name: 'Ice Mint', value: '#E0FFF0' },
        { name: 'Mint', value: '#98FF98' },
        { name: 'Spring Green', value: '#00FA9A' },
        { name: 'Lime Green', value: '#32CD32' },
        { name: 'Forest Green', value: '#228B22' },
        { name: 'Dark Forest', value: '#006400' }
      ],
      Reds: [
        { name: 'Misty Rose', value: '#FFE4E1' },
        { name: 'Light Coral', value: '#F08080' },
        { name: 'Indian Red', value: '#CD5C5C' },
        { name: 'Crimson', value: '#DC143C' },
        { name: 'Fire Brick', value: '#B22222' },
        { name: 'Dark Red', value: '#8B0000' }
      ],
      Purples: [
        { name: 'Lavender', value: '#E6E6FA' },
        { name: 'Light Purple', value: '#B19CD9' },
        { name: 'Medium Purple', value: '#9370DB' },
        { name: 'Rebecca Purple', value: '#663399' },
        { name: 'Dark Purple', value: '#4B0082' },
        { name: 'Deep Purple', value: '#2A0134' }
      ]
    };
    
    function gbgInitializeSwatches() {
  const container = document.getElementById('gbg-swatches-container');
  const gradientColors = document.getElementById('gbg-gradient-colors');

  // Create grid container just for gradient colors
  const gridContainer = document.createElement('div');
  gridContainer.className = 'gbg-gradient-colors-grid';
  
  // Create 6 gradient color inputs
  for (let i = 0; i < 6; i++) {
    const div = document.createElement('div');
    div.className = 'gbg-input-group';
    div.innerHTML = `
      <label class="gbg-input-label">Gradient Color ${i + 1} ${i > 1 ? '(optional)' : ''}</label>
      <input type="text" id="gbg-gradient-color-${i}" class="gbg-input-field" placeholder="e.g., #00FF87">
    `;
    gridContainer.appendChild(div);
  }

  // Add the grid container to the gradient colors section
  gradientColors.appendChild(gridContainer);

  // Create color swatches
  Object.entries(gbgColorSwatches).forEach(([category, colors]) => {
    const categoryDiv = document.createElement('div');
    categoryDiv.className = 'gbg-color-category';
    categoryDiv.innerHTML = `
      <h4 class="gbg-category-title">${category}</h4>
      <div class="gbg-swatches-grid">
        ${colors.map(color => `
          <div class="gbg-color-swatch" 
               style="background-color: ${color.value}" 
               onclick="gbgCopyColor('${color.value}')">
            <span class="gbg-swatch-tooltip">${color.name}</span>
          </div>
        `).join('')}
      </div>
    `;
    container.appendChild(categoryDiv);
  });
}
    
        function gbgCopyColor(color) {
          navigator.clipboard.writeText(color);
        }
    
 // Hex Validation
function formatHexColor(color) {
  if (!color) return '';
  // Remove any spaces and make sure it starts with #
  return color.trim().startsWith('#') ? color.trim() : '#' + color.trim();
}
// ID Validation
function formatSquarespaceId(id) {
  if (!id) return '';
  
  id = id.trim();
  
  // Check if it's a section ID (contains "section-id" or starts with "section[")
  if (id.includes('section-id') || id.startsWith('section[')) {
    // If user just pasted the ID number, format it as a section
    if (/^[a-f0-9]{24}$/i.test(id)) {
      return `section[data-section-id="${id}"]`;
    }
    // If it's already in correct format, return as is
    if (id.startsWith('section[data-section-id="') && id.endsWith('"]')) {
      return id;
    }
  }
  
  // Check if it's a block ID
  if (id.includes('block-yui') || id.startsWith('#block-')) {
    // Remove any existing # if present
    id = id.replace('#', '');
    // If it doesn't start with 'block-', add it
    if (!id.startsWith('block-')) {
      id = 'block-' + id;
    }
    return `#${id}`;
  }
  
  // If it's a plain block ID number, assume it's a block ID
  if (/^yui_\d+_\d+_\d+_\d+_\d+$/.test(id)) {
    return `#block-${id}`;
  }
  
  // Return original with # if no specific format detected
  return `#${id}`;
}

// Update the CSS generation function
function gbgGenerateCssCode() {
  const buttonType = document.getElementById('gbg-button-type').value;
  const blockId = formatSquarespaceId(document.getElementById('gbg-block-id').value);
  const gradientType = document.querySelector('input[name="gradientType"]:checked').value;
  const gradientAngle = document.getElementById('gbg-angle-slider').value;
  
  const colors = [];
  for (let i = 0; i < 5; i++) {
    const colorValue = document.getElementById(`gbg-gradient-color-${i}`).value;
    if (colorValue) {
      const formattedColor = formatHexColor(colorValue);
      if (formattedColor) colors.push(formattedColor);
    }
  }

  if (colors.length === 0) {
    colors.push('#00FF87', '#60EFFF');
  }

  const textColor = formatHexColor(document.getElementById('gbg-text-color').value) || '#EBE8E0';
  const borderColor = formatHexColor(document.getElementById('gbg-border-color').value);
  const shadowColor = formatHexColor(document.getElementById('gbg-shadow-color').value);
  const expandHover = document.getElementById('gbg-expand-hover').value;

  const gradientStyle = gradientType === 'linear' 
    ? `linear-gradient(${gradientAngle}deg, ${colors.join(', ')})`
    : `radial-gradient(circle, ${colors.join(', ')})`;

  // Create selector based on the ID type
  const selector = blockId
    ? `${blockId} .sqs-button-element--${buttonType}`
    : `.sqs-button-element--${buttonType}`;

  const code = `<style>
/* Gradient Button */
${selector} {
  background: ${gradientStyle} !important;
  color: ${textColor} !important;
  ${borderColor ? `border: 2px solid ${borderColor} !important;` : 'border: none !important;'}
}
${selector}:hover {
  background: ${gradientType === 'linear' 
    ? `linear-gradient(${(Number(gradientAngle) + 180) % 360}deg, ${colors.join(', ')})`
    : `radial-gradient(circle at center, ${[...colors].reverse().join(', ')})`
  } !important;
  ${expandHover === 'yes' ? 'transform: scale(1.05);' : ''}
  ${shadowColor ? `box-shadow: 0 4px 8px ${shadowColor};` : ''}
}
</style>`;

  document.getElementById('gbg-output').value = code;
}

// Add some helpful placeholder text to the input
document.getElementById('gbg-block-id').placeholder = 'e.g., section[data-section-id="..."] or block-yui_...';
    
        function gbgCopyToClipboard() {
          const output = document.getElementById('gbg-output');
          output.select();
          document.execCommand('copy');
        }
    
        function gbgClearFields() {
  document.getElementById('gbg-button-type').value = 'primary';
  document.getElementById('gbg-block-id').value = ''; // Add this line
  for (let i = 0; i < 6; i++) {
    document.getElementById(`gbg-gradient-color-${i}`).value = '';
  }
  document.getElementById('gbg-text-color').value = '';
  document.getElementById('gbg-border-color').value = '';
  document.getElementById('gbg-expand-hover').value = 'no';
  document.getElementById('gbg-shadow-color').value = '';
  document.getElementById('gbg-output').value = '';
}
    
        // Initialize the tool
        window.onload = gbgInitializeSwatches;
      </script>
    </div>
