;(function() {
    'use strict';
    
    // Generate unique widget ID
    const widgetId = 'gradient-button-' + Math.random().toString(36).substr(2, 9);

    let currentlyFocusedInput = null;

    // Widget Configuration
    const CONFIG = {
    defaultColors: ['', ''],
    defaultAngle: 90,
    defaultButtonType: 'primary',
    maxGradientColors: 6,
    defaults: {
        textColor: '',
        expandOnHover: 'no',
        gradientType: 'linear'
    },
    analytics: {
        enabled: true,
        creator: 'luxwebsitetemplates.com',
        version: '1.0.0'
    }
};


const COLOR_SWATCHES = {
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
        ],
        Gradients: [
            { name: 'Ocean Breeze', values: ['#48c6ef', '#6f86d6'] },
            { name: 'Purple Dream', values: ['#c471f5', '#fa71cd'] },
            { name: 'Sunset', values: ['#ff6a00', '#ee0979'] },
            { name: 'Forest', values: ['#00b09b', '#96c93d'] },
            { name: 'Midnight', values: ['#232526', '#414345'] },
            { name: 'Smooth', values: ['#5e60ce', '#4ea8de'] }
        ]
    };

    
    // Add Recently Used Gradients functionality
const RECENT_GRADIENTS_KEY = 'recentGradients';

function addToRecentGradients(colors) {
    try {
        let recent = JSON.parse(localStorage.getItem(RECENT_GRADIENTS_KEY) || '[]');
        // Add new gradient to the beginning
        recent.unshift(colors);
        // Keep only last 5 gradients
        recent = recent.slice(0, 5);
        // Remove duplicates
        recent = Array.from(new Set(recent.map(JSON.stringify))).map(JSON.parse);
        localStorage.setItem(RECENT_GRADIENTS_KEY, JSON.stringify(recent));
        updateRecentGradientsDisplay();
    } catch (error) {
        console.log('Error updating recent gradients:', error);
    }
}

function updateRecentGradientsDisplay() {
    try {
        const recentContainer = document.getElementById('gbg-recent-gradients');
        if (!recentContainer) return;

        const recent = JSON.parse(localStorage.getItem(RECENT_GRADIENTS_KEY) || '[]');
        recentContainer.innerHTML = recent.map((colors, index) => `
            <div class="gbg-color-swatch" 
                 style="background: linear-gradient(90deg, ${colors.join(', ')})"
                 data-colors='${JSON.stringify(colors)}'>
                <span class="gbg-swatch-tooltip">Recent ${index + 1}</span>
            </div>
        `).join('');
    } catch (error) {
        console.log('Error displaying recent gradients:', error);
    }
}

    // Analytics tracking function
    function trackWidgetEvent(action, label = '') {
        if (!CONFIG.analytics.enabled) return;

        try {
            // Track with Squarespace Analytics if available
            if (window.Analytics) {
                window.Analytics.track('Gradient Button Generator', {
                    action: action,
                    label: label,
                    domain: window.location.hostname,
                    page: window.location.pathname,
                    widgetId: widgetId,
                    version: CONFIG.analytics.version
                });
            }
            
            // Log to console for debugging
            console.log(`Widget Event: ${action}`, {
                domain: window.location.hostname,
                page: window.location.pathname,
                widgetId: widgetId
            });
        } catch (error) {
            // Silently fail if tracking fails
            console.log('Widget event tracking failed:', error);
        }
    }

    // Utility Functions
    const utils = {
        // Color formatting and validation
        formatHexColor(color) {
            if (!color) return '';
            color = color.trim().replace(/[^0-9A-Fa-f#]/g, '');
            if (!color.startsWith('#')) {
                color = '#' + color;
            }
            color = '#' + color.slice(1).replace(/#/g, '');
            // Validate hex color format
            return /^#[0-9A-Fa-f]{6}$/.test(color) ? color : '';
        },

        // Squarespace ID formatting
        formatSquarespaceId(id) {
            if (!id) return '';
            id = id.trim();
            
            // Handle section IDs
            if (id.includes('section-id') || id.startsWith('section[')) {
                if (/^[a-f0-9]{24}$/i.test(id)) {
                    return `section[data-section-id="${id}"]`;
                }
                if (id.startsWith('section[data-section-id="') && id.endsWith('"]')) {
                    return id;
                }
            }
            
            // Handle block IDs
            if (id.includes('block-yui') || id.startsWith('#block-')) {
                id = id.replace('#', '');
                if (!id.startsWith('block-')) {
                    id = 'block-' + id;
                }
                return `#${id}`;
            }
            
            // Handle YUI IDs
            if (/^yui_\d+_\d+_\d+_\d+_\d+$/.test(id)) {
                return `#block-${id}`;
            }
            
            return id ? `#${id}` : '';
        },

        // Input validation
        validateInputs: {
            angle(value) {
                const num = parseInt(value);
                return !isNaN(num) ? Math.min(360, Math.max(0, num)) : CONFIG.defaultAngle;
            },
            
            buttonType(type) {
                const validTypes = ['primary', 'secondary', 'tertiary'];
                return validTypes.includes(type) ? type : CONFIG.defaultButtonType;
            },
            
            expandHover(value) {
                return value === 'yes' ? 'yes' : 'no';
            }
        },

        // Color manipulation
        colorUtils: {
            hexToRGB(hex) {
                const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
                return result ? {
                    r: parseInt(result[1], 16),
                    g: parseInt(result[2], 16),
                    b: parseInt(result[3], 16)
                } : null;
            },

            getRGBA(hex, alpha = 1) {
                const rgb = this.hexToRGB(hex);
                return rgb ? `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${alpha})` : '';
            },

            getLuminance(hex) {
                const rgb = this.hexToRGB(hex);
                if (!rgb) return 0;
                const { r, g, b } = rgb;
                return (0.299 * r + 0.587 * g + 0.114 * b) / 255;
            },

            isLightColor(hex) {
                return this.getLuminance(hex) > 0.5;
            }
        },

        // DOM helpers
        dom: {
            createElement(tag, className = '', attributes = {}) {
                const element = document.createElement(tag);
                if (className) element.className = className;
                Object.entries(attributes).forEach(([key, value]) => {
                    element.setAttribute(key, value);
                });
                return element;
            },

            getInputValue(id, defaultValue = '') {
                const element = document.getElementById(id);
                return element ? element.value.trim() : defaultValue;
            },

            setInputValue(id, value) {
                const element = document.getElementById(id);
                if (element) element.value = value;
            }
        },

        // Debug helpers
        debug: {
            log(...args) {
                if (CONFIG.analytics.enabled) {
                    console.log(...args);
                }
            },
            
            warn(...args) {
                if (CONFIG.analytics.enabled) {
                    console.warn(...args);
                }
            },
            
            error(...args) {
                if (CONFIG.analytics.enabled) {
                    console.error(...args);
                }
            }
        }
    };

    // HTML Template Generators
    const templates = {
        // Generate color swatches section
        colorSwatches() {
            return `
                <div class="gbg-color-swatches">
                <h3 class="gbg-tool-title">Color Swatches</h3>
                <div id="gbg-swatches-container"></div>
            </div>`;
        },

        // Generate button type and block ID section
        buttonControls() {
            return `
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
                        <label class="gbg-input-label" title="Optional: Target specific section or block">Block/Section ID</label>
                        <input type="text" id="gbg-block-id" class="gbg-input-field" 
                               placeholder="e.g., section[data-section-id='...']">
                    </div>
                </div>`;
        },

        // Generate gradient type controls
        gradientTypeControls() {
            return `
                <div class="gbg-gradient-type-control">
                    <label class="gbg-input-label">Gradient Type</label>
                    <div class="gbg-radio-group">
                        <label class="gbg-radio-label">
                            <input type="radio" name="gradientType" value="linear" 
                                   checked class="gbg-radio-input">
                            Linear
                        </label>
                        <label class="gbg-radio-label">
                            <input type="radio" name="gradientType" value="radial" 
                                   class="gbg-radio-input">
                            Radial
                        </label>
                    </div>
                </div>`;
        },

        // Generate angle control section
        angleControls() {
            return `
                <div id="gbg-angle-control" class="gbg-angle-control">
                    <label class="gbg-input-label">Gradient Angle</label>
                    <div class="gbg-angle-input-group">
                        <input type="range" id="gbg-angle-slider" min="0" max="360" 
                               value="${CONFIG.defaultAngle}" class="gbg-angle-slider">
                        <input type="number" id="gbg-angle-number" min="0" max="360" 
                               value="${CONFIG.defaultAngle}" class="gbg-angle-number">
                        <span class="gbg-angle-unit">°</span>
                    </div>
                </div>`;
        },

        // Generate gradient colors section
        gradientColors() {
            return `
                <div id="gbg-gradient-colors">
                    <div class="gbg-gradient-colors-grid">
                        ${Array.from({ length: CONFIG.maxGradientColors }, (_, i) => `
                            <div class="gbg-input-group">
                                <label class="gbg-input-label">
                                    Gradient Color ${i + 1} ${i > 1 ? '(optional)' : ''}
                                </label>
                                <div class="gbg-color-input-wrapper">
                                    <input type="text" 
                                           id="gbg-gradient-color-${i}" 
                                           class="gbg-input-field" 
                                           placeholder="e.g., #00FF87"
                                           value="${i < CONFIG.defaultColors.length ? CONFIG.defaultColors[i] : ''}">
                                    <div class="gbg-color-preview" id="gbg-gradient-color-${i}-preview">
                                        <input type="color" 
                                               id="gbg-gradient-color-${i}-picker" 
                                               class="gbg-color-picker" 
                                               aria-label="Color picker for gradient color ${i + 1}">
                                    </div>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>`;
        },

        // Generate style controls section
        styleControls() {
            return `
                <div class="gbg-unified-grid">
                    <div class="gbg-input-group">
                        <label class="gbg-input-label">Text Color</label>
                        <div class="gbg-color-input-wrapper">
                            <input type="text" 
                                   id="gbg-text-color" 
                                   class="gbg-input-field" 
                                   value="${CONFIG.defaults.textColor}" 
                                   placeholder="e.g., #EBE8E0">
                            <div class="gbg-color-preview" id="gbg-text-color-preview">
                                <input type="color" 
                                       id="gbg-text-color-picker" 
                                       class="gbg-color-picker" 
                                       aria-label="Color picker for text color">
                            </div>
                        </div>
                    </div>
        
                    <div class="gbg-input-group">
                        <label class="gbg-input-label">Border Color</label>
                        <div class="gbg-color-input-wrapper">
                            <input type="text" 
                                   id="gbg-border-color" 
                                   class="gbg-input-field" 
                                   placeholder="e.g., #000000">
                            <div class="gbg-color-preview" id="gbg-border-color-preview">
                                <input type="color" 
                                       id="gbg-border-color-picker" 
                                       class="gbg-color-picker" 
                                       aria-label="Color picker for border color">
                            </div>
                        </div>
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
                        <div class="gbg-color-input-wrapper">
                            <input type="text" 
                                   id="gbg-shadow-color" 
                                   class="gbg-input-field" 
                                   placeholder="e.g., #4ea8de">
                            <div class="gbg-color-preview" id="gbg-shadow-color-preview">
                                <input type="color" 
                                       id="gbg-shadow-color-picker" 
                                       class="gbg-color-picker" 
                                       aria-label="Color picker for shadow color">
                            </div>
                        </div>
                    </div>
                </div>`;
        },

        // Generate action buttons section
        actionButtons() {
            return `
                <div class="gbg-button-row">
                    <button class="gbg-action-button gbg-copy-button">Copy Code</button>
                    <button class="gbg-action-button gbg-clear-button">Clear All</button>
                </div>`;
        },

        // Generate output textarea
        outputArea() {
            return `
                <textarea id="gbg-output" readonly 
                          placeholder="Generated CSS will appear here..."></textarea>`;
        },

        copyButtonStyles() {
            return `
                .gbg-copy-button {
                    position: relative;
                    min-width: 100px;
                    background: linear-gradient(to right, #4361EE, #1F43ED);
                    transition: all 0.2s ease-in-out;
                }

                .gbg-copy-button:disabled {
                    opacity: 0.7;
                    cursor: default;
                }
            `;
        }

    };

    // Main HTML Generator Function
function generateWidgetHTML() {
    return `
        ${templates.colorSwatches()}
        <div class="gbg-main-content">
            <!-- Preview Section at the top -->
            <div class="gbg-preview-section">
                <div id="gbg-preview" class="gbg-preview-container">
                    <button class="sqs-button-element--primary gbg-preview-button">
                        Preview Button
                    </button>
                </div>
            </div>
            
            <!-- Main Controls -->
            ${templates.buttonControls()}
            ${templates.gradientTypeControls()}
            ${templates.angleControls()}
            ${templates.gradientColors()}
            ${templates.styleControls()}
            
            <!-- Output Area and Action Buttons at the bottom -->
            <div class="gbg-output-section">
            ${templates.actionButtons()}    
            ${templates.outputArea()}
            </div>
        </div>`;
}

    // Component Initializers
    const initializers = {
        // Initialize color swatches
        initColorSwatches() {
            const container = document.getElementById('gbg-swatches-container');
            if (!container) {
                utils.debug.error('Color swatches container not found');
                return;
            }

            Object.entries(COLOR_SWATCHES).forEach(([category, colors]) => {
                const categoryDiv = utils.dom.createElement('div', 'gbg-color-category');
                categoryDiv.innerHTML = `
                    <h4 class="gbg-category-title">${category}</h4>
                    <div class="gbg-swatches-grid">
                        ${colors.map(color => {
                            if (category === 'Gradients') {
                                return `
                                    <div class="gbg-color-swatch" 
                                         style="background: linear-gradient(90deg, ${color.values.join(', ')})"
                                         data-colors='${JSON.stringify(color.values)}'>
                                        <span class="gbg-swatch-tooltip">${color.name}</span>
                                    </div>`;
                            } else {
                                return `
                                    <div class="gbg-color-swatch" 
                                         style="background-color: ${color.value}"
                                         data-color="${color.value}">
                                        <span class="gbg-swatch-tooltip">${color.name}</span>
                                    </div>`;
                            }
                        }).join('')}
                    </div>
                `;
                container.appendChild(categoryDiv);
            });
        },

        // Initialize gradient inputs
        initGradientInputs() {
            const container = document.getElementById('gbg-gradient-colors');
            if (!container) {
                utils.debug.error('Gradient colors container not found');
                return;
            }

            // Set up color input validation and formatting
            for (let i = 0; i < CONFIG.maxGradientColors; i++) {
                const input = document.getElementById(`gbg-gradient-color-${i}`);
                if (input) {
                    input.addEventListener('input', (e) => {
                        const color = utils.formatHexColor(e.target.value);
                        if (color) {
                            e.target.style.borderColor = '#444';
                            if (utils.colorUtils.isLightColor(color)) {
                                e.target.style.color = '#000000';
                            }
                        } else {
                            e.target.style.borderColor = '#ff4d4d';
                        }
                        this.updatePreview();
                    });

                    input.addEventListener('blur', (e) => {
                        const color = utils.formatHexColor(e.target.value);
                        if (color) {
                            e.target.value = color;
                            e.target.style.borderColor = '#444';
                        }
                    });
                }
            }
        },

        // Initialize angle controls
        initAngleControls() {
            const slider = document.getElementById('gbg-angle-slider');
            const number = document.getElementById('gbg-angle-number');
            
            if (!slider || !number) {
                utils.debug.error('Angle controls not found');
                return;
            }

            // Sync slider and number input
            slider.addEventListener('input', (e) => {
                number.value = utils.validateInputs.angle(e.target.value);
                this.updatePreview();
            });

            number.addEventListener('input', (e) => {
                const validAngle = utils.validateInputs.angle(e.target.value);
                slider.value = validAngle;
                e.target.value = validAngle;
                this.updatePreview();
            });

            // Handle gradient type changes
            const radios = document.querySelectorAll('input[name="gradientType"]');
            radios.forEach(radio => {
                radio.addEventListener('change', () => {
                    const angleControl = document.getElementById('gbg-angle-control');
                    if (angleControl) {
                        angleControl.style.display = radio.value === 'linear' ? 'block' : 'none';
                    }
                    this.updatePreview();
                });
            });
        },


        initializeColorInputs() {
            const gradientColorIds = Array.from({ length: CONFIG.maxGradientColors }, 
                (_, i) => `gbg-gradient-color-${i}`);
            
            const styleColorIds = [
                'gbg-text-color',
                'gbg-border-color',
                'gbg-shadow-color'
            ];
    
            const allColorInputs = [...gradientColorIds, ...styleColorIds];
    
            // Function to show a temporary tooltip
            const showTooltip = (element, message) => {
                const tooltip = document.createElement('div');
                tooltip.className = 'gbg-tooltip';
                tooltip.textContent = message;
                
                // Position tooltip above the color preview
                element.appendChild(tooltip);
                
                // Remove tooltip after animation
                setTimeout(() => {
                    tooltip.classList.add('gbg-tooltip-fade');
                    setTimeout(() => tooltip.remove(), 300);
                }, 1000);
            };
    
            // Function to copy color to clipboard
            const copyToClipboard = async (color, preview) => {
                try {
                    await navigator.clipboard.writeText(color);
                    showTooltip(preview, 'Color copied!');
                    trackWidgetEvent('Color Copy Success');
                } catch (error) {
                    console.error('Failed to copy color:', error);
                    showTooltip(preview, 'Copy failed');
                    trackWidgetEvent('Color Copy Failed');
                }
            };
    
            allColorInputs.forEach(id => {
                const input = document.getElementById(id);
                const preview = document.getElementById(`${id}-preview`);
                const picker = document.getElementById(`${id}-picker`);
    
                if (input) {
                    // ... existing focus and drag/drop handlers ...
    
                    // Color picker functionality
                    if (preview && picker) {
                        // Update preview when input changes
                        input.addEventListener('input', (e) => {
                            const color = utils.formatHexColor(e.target.value);
                            if (color) {
                                preview.style.backgroundColor = color;
                                picker.value = color;
                                input.style.borderColor = '#444';
                            } else {
                                preview.style.backgroundColor = 'transparent';
                                input.style.borderColor = '#ff4d4d';
                            }
                            generator.generateCSS();
                        });
    
                        // Update input when picker changes and copy to clipboard
                        picker.addEventListener('input', (e) => {
                            const color = e.target.value.toUpperCase();
                            input.value = color;
                            preview.style.backgroundColor = color;
                            input.style.borderColor = '#444';
                            generator.generateCSS();
                        });
    
                        // Add clipboard copy on picker change
                        picker.addEventListener('change', (e) => {
                            const color = e.target.value.toUpperCase();
                            copyToClipboard(color, preview);
                        });
    
                        // Handle initial state
                        const initialColor = utils.formatHexColor(input.value);
                        if (initialColor) {
                            preview.style.backgroundColor = initialColor;
                            picker.value = initialColor;
                        }
                    }
                }
            });
        },
        
    // Initialize button controls
    initButtonControls() {
        // Button type and block ID handlers
        const buttonType = document.getElementById('gbg-button-type');
        if (buttonType) {
            buttonType.addEventListener('change', this.updatePreview);
        }
    
        const blockId = document.getElementById('gbg-block-id');
        if (blockId) {
            blockId.addEventListener('input', (e) => {
                e.target.value = utils.formatSquarespaceId(e.target.value);
                this.updatePreview();
            });
        }
    
        // Color input handlers
        ['gbg-text-color', 'gbg-border-color', 'gbg-shadow-color'].forEach(id => {
            const input = document.getElementById(id);
            if (input) {
                input.addEventListener('input', (e) => {
                    const color = utils.formatHexColor(e.target.value);
                    if (color) {
                        e.target.style.borderColor = '#444';
                    } else {
                        e.target.style.borderColor = '#ff4d4d';
                    }
                    this.updatePreview();
                });
    
                input.addEventListener('blur', (e) => {
                    const color = utils.formatHexColor(e.target.value);
                    if (color) {
                        e.target.value = color;
                        e.target.style.borderColor = '#444';
                    }
                });
            }
        });
    
        // Style option handlers
        const expandHoverSelect = document.getElementById('gbg-expand-hover');
        if (expandHoverSelect) {
            expandHoverSelect.addEventListener('change', (e) => {
                generator.generateCSS();
                trackWidgetEvent('Update Expand Hover', e.target.value);
            });
        }
    
        // Action button handlers
        const copyButton = document.querySelector('.gbg-copy-button');
        const clearButton = document.querySelector('.gbg-clear-button');
    
        if (copyButton) {
            copyButton.addEventListener('click', () => {
                actions.copyToClipboard();
                trackWidgetEvent('Copy Code');
            });
        }
    
        if (clearButton) {
            clearButton.addEventListener('click', () => {
                actions.clearFields();
                trackWidgetEvent('Clear Fields');
            });
        }
    },

    initCopyButton() {
        // Add styles to document
        const styleElement = document.createElement('style');
        styleElement.textContent = templates.copyButtonStyles();
        document.head.appendChild(styleElement);

        // Set up click handler
        const copyButton = document.querySelector('.gbg-copy-button');
        if (copyButton) {
            copyButton.addEventListener('click', handlers.buttonAction.handleCopy);
        }
    },

        // Initialize preview updating
        updatePreview() {
            generator.generateCSS();
        }
    };

    // Event Handlers
    const handlers = {
    colorSwatch: {
        handleClick(event) {
            const swatch = event.target.closest('.gbg-color-swatch');
            if (!swatch) return;

            // Handle gradient swatches
            if (swatch.dataset.colors) {
                const colors = JSON.parse(swatch.dataset.colors);
                colors.forEach((color, index) => {
                    const input = document.getElementById(`gbg-gradient-color-${index}`);
                    if (input) {
                        input.value = color;
                        input.style.borderColor = '#444';
                    }
                });
                trackWidgetEvent('Apply Gradient Preset');
            } 
            // Handle single color swatches
            else if (swatch.dataset.color) {
                const color = swatch.dataset.color;
                
                // If we have a focused input, update it
                if (currentlyFocusedInput && ['gbg-text-color', 'gbg-border-color', 'gbg-shadow-color'].includes(currentlyFocusedInput.id)) {
                    currentlyFocusedInput.value = color;
                    currentlyFocusedInput.style.borderColor = '#444';
                    trackWidgetEvent('Apply Color to Field', currentlyFocusedInput.id);
                } else {
                    // Original behavior for gradient color inputs
                    const inputs = Array.from({ length: CONFIG.maxGradientColors }, (_, i) => 
                        document.getElementById(`gbg-gradient-color-${i}`));
                    
                    const emptyInput = inputs.find(input => !input.value.trim());
                    if (emptyInput) {
                        emptyInput.value = color;
                        emptyInput.style.borderColor = '#444';
                        trackWidgetEvent('Apply Single Color');
                    }
                }
            }

            generator.generateCSS();
            },

            handleDragStart(event) {
                const swatch = event.target.closest('.gbg-color-swatch');
                if (!swatch) return;

                event.dataTransfer.setData('text/plain', 
                    swatch.dataset.color || JSON.stringify(swatch.dataset.colors));
                event.dataTransfer.effectAllowed = 'copy';
            }
        },

        // Input field handlers
        inputField: {
            handleColorInput(event) {
                const input = event.target;
                const color = utils.formatHexColor(input.value);
                
                if (color) {
                    input.style.borderColor = '#444';
                    if (utils.colorUtils.isLightColor(color)) {
                        input.style.color = '#000000';
                    } else {
                        input.style.color = '#ffffff';
                    }
                } else {
                    input.style.borderColor = '#ff4d4d';
                }
                
                generator.generateCSS();
            },

            handleBlockIdInput(event) {
                const input = event.target;
                input.value = utils.formatSquarespaceId(input.value);
                generator.generateCSS();
            },

            handleAngleInput(event, linkedInput) {
                const value = utils.validateInputs.angle(event.target.value);
                event.target.value = value;
                if (linkedInput) {
                    linkedInput.value = value;
                }
                generator.generateCSS();
            }
        },

        // Button action handlers
        buttonAction: {
            async handleCopy() {
                const copyButton = document.querySelector('.gbg-copy-button');
                if (!copyButton) return;
    
                const originalText = copyButton.textContent || 'Copy Code';
                
                try {
                    const output = document.getElementById('gbg-output');
                    await navigator.clipboard.writeText(output.value);
                    
                    // Update button text to show success
                    copyButton.textContent = 'Copied!';
                    
                    // Track successful copy
                    trackWidgetEvent('Copy Success');
                    
                    // Reset button text after delay
                    setTimeout(() => {
                        copyButton.textContent = originalText;
                    }, 2000);
                    
                } catch (error) {
                    console.error('Copy failed:', error);
                    
                    // Fallback to selection method
                    try {
                        const output = document.getElementById('gbg-output');
                        output.select();
                        document.execCommand('copy');
                        
                        // Update button text even in fallback
                        copyButton.textContent = 'Copied!';
                        setTimeout(() => {
                            copyButton.textContent = originalText;
                        }, 2000);
                        
                        trackWidgetEvent('Copy Fallback Success');
                    } catch (fallbackError) {
                        copyButton.textContent = 'Error!';
                        setTimeout(() => {
                            copyButton.textContent = originalText;
                        }, 2000);
                        trackWidgetEvent('Copy Failed');
                    }
                }
            },

            handleClear() {
                const fields = {
                    'gbg-button-type': 'primary',
                    'gbg-block-id': '',
                    'gbg-text-color': '',
                    'gbg-border-color': '',
                    'gbg-expand-hover': 'no',
                    'gbg-shadow-color': ''
                };

                // Clear all gradient color inputs
                for (let i = 0; i < CONFIG.maxGradientColors; i++) {
                    fields[`gbg-gradient-color-${i}`] = i < CONFIG.defaultColors.length 
                        ? CONFIG.defaultColors[i] 
                        : '';
                }

                // Reset all fields
                Object.entries(fields).forEach(([id, value]) => {
                    utils.dom.setInputValue(id, value);
                });

                // Reset gradient type
                const linearRadio = document.querySelector('input[name="gradientType"][value="linear"]');
                if (linearRadio) {
                    linearRadio.checked = true;
                }

                // Reset angle
                utils.dom.setInputValue('gbg-angle-slider', CONFIG.defaultAngle);
                utils.dom.setInputValue('gbg-angle-number', CONFIG.defaultAngle);

                // Clear output
                utils.dom.setInputValue('gbg-output', '');

                trackWidgetEvent('Clear All');
                generator.generateCSS();
            }
        },

        // Drag and drop handlers
        dragDrop: {
            handleDragStart(event) {
                const swatch = event.target.closest('.gbg-color-swatch');
                if (!swatch) return;
                
                // Set drag data based on swatch type
                if (swatch.dataset.colors) {
                    event.dataTransfer.setData('text/plain', JSON.stringify(JSON.parse(swatch.dataset.colors)));
                } else if (swatch.dataset.color) {
                    event.dataTransfer.setData('text/plain', swatch.dataset.color);
                }
                
                event.dataTransfer.effectAllowed = 'copy';
                swatch.classList.add('dragging');
            },
    
            handleDragEnd(event) {
                const swatch = event.target.closest('.gbg-color-swatch');
                if (swatch) {
                    swatch.classList.remove('dragging');
                }
            },
    
            handleDragOver(event) {
                // Only allow dropping on input fields
                if (event.target.classList.contains('gbg-input-field')) {
                    event.preventDefault();
                    event.dataTransfer.dropEffect = 'copy';
                    event.target.classList.add('drag-over');
                }
            },
    
            handleDragLeave(event) {
                if (event.target.classList.contains('gbg-input-field')) {
                    event.target.classList.remove('drag-over');
                }
            },
    
            handleDrop(event) {
                event.preventDefault();
                const input = event.target.closest('.gbg-input-field');
                if (!input) return;
    
                input.classList.remove('drag-over');
    
                try {
                    const data = event.dataTransfer.getData('text/plain');
                    let color;
    
                    // Handle both single colors and gradient arrays
                    try {
                        const parsedData = JSON.parse(data);
                        color = Array.isArray(parsedData) ? parsedData[0] : parsedData;
                    } catch {
                        color = data;
                    }
    
                    // Validate color format
                    color = utils.formatHexColor(color);
                    if (color) {
                        input.value = color;
                        input.style.borderColor = '#444';
                        generator.generateCSS();
                        trackWidgetEvent('Color Drop Success');
                    }
                } catch (error) {
                    utils.debug.error('Drop handling failed:', error);
                    trackWidgetEvent('Color Drop Failed');
                }
            }
        }
    };

    // Code Generation Functions
    const generator = {
        // Get all current gradient colors
        getGradientColors() {
            const colors = [];
            for (let i = 0; i < CONFIG.maxGradientColors; i++) {
                const colorValue = utils.dom.getInputValue(`gbg-gradient-color-${i}`);
                if (colorValue) {
                    const formattedColor = utils.formatHexColor(colorValue);
                    if (formattedColor) colors.push(formattedColor);
                }
            }
            return colors.length > 0 ? colors : CONFIG.defaultColors;
        },

        // Generate gradient style
        createGradientStyle(colors, angle = null) {
            const gradientType = document.querySelector('input[name="gradientType"]:checked').value;
            
            if (gradientType === 'linear') {
                const gradientAngle = angle ?? utils.dom.getInputValue('gbg-angle-slider', CONFIG.defaultAngle);
                return `linear-gradient(${gradientAngle}deg, ${colors.join(', ')})`;
            } else {
                return `radial-gradient(circle at center, ${colors.join(', ')})`;
            }
        },

        // Generate hover effects
        createHoverEffects(colors) {
            const effects = [];
            const gradientType = document.querySelector('input[name="gradientType"]:checked').value;
            
            // Gradient hover effect
            if (gradientType === 'linear') {
                const currentAngle = parseInt(utils.dom.getInputValue('gbg-angle-slider', CONFIG.defaultAngle));
                const hoverAngle = (currentAngle + 180) % 360;
                effects.push(`background: ${this.createGradientStyle(colors, hoverAngle)} !important`);
            } else {
                effects.push(`background: radial-gradient(circle at center, ${[...colors].reverse().join(', ')}) !important`);
            }

            // Expansion effect
            const expandHover = utils.dom.getInputValue('gbg-expand-hover');
            if (expandHover === 'yes') {
                effects.push('transform: scale(1.05)');
                effects.push('transition: transform 0.2s ease-in-out');
            }

            // Shadow effect
            const shadowColor = utils.formatHexColor(utils.dom.getInputValue('gbg-shadow-color'));
            if (shadowColor) {
                effects.push(`box-shadow: 0 4px 8px ${shadowColor}`);
            }

            return effects.join(';\n    ');
        },

        // Generate base button styles
        createBaseStyles() {
            const styles = [];
            
            // Text color
            const textColor = utils.formatHexColor(utils.dom.getInputValue('gbg-text-color'));
            styles.push(`color: ${textColor} !important`);

            // Border
            const borderColor = utils.formatHexColor(utils.dom.getInputValue('gbg-border-color'));
            if (borderColor) {
                styles.push(`border: 2px solid ${borderColor} !important`);
            } else {
                styles.push('border: none !important');
            }

            // Base transitions
            styles.push('transition: all 0.2s ease-in-out');

            return styles.join(';\n    ');
        },

        // Generate the complete CSS code
        generateCSS() {
            // Get basic setup
            const buttonType = utils.dom.getInputValue('gbg-button-type', CONFIG.defaultButtonType);
            const blockId = utils.formatSquarespaceId(utils.dom.getInputValue('gbg-block-id'));
            const colors = this.getGradientColors();

            // Create selector based on block ID
            const selector = blockId
                ? `${blockId} .sqs-button-element--${buttonType}`
                : `.sqs-button-element--${buttonType}`;

            // Generate the CSS code
            const code = `<style>
/* Gradient Button Styles */
${selector} {
    background: ${this.createGradientStyle(colors)} !important;
    ${this.createBaseStyles()}
}

${selector}:hover {
    ${this.createHoverEffects(colors)}
}
</style>`;

            // Update output field
            const output = document.getElementById('gbg-output');
            if (output) {
                output.value = code;
                
                // Generate preview if available
                this.updatePreview(code);
            }
        },

        updatePreview(code) {
        const previewButton = document.querySelector('#gbg-preview .gbg-preview-button');
        if (!previewButton) return;

        // Extract styles from the generated CSS
        const styleMatch = code.match(/<style>([\s\S]*?)<\/style>/);
        if (styleMatch) {
            const styles = styleMatch[1];
            
            // Remove any existing preview styles
            const existingStyle = document.getElementById('gbg-preview-styles');
            if (existingStyle) {
                existingStyle.remove();
            }

            // Create and append new style element
            const styleElement = document.createElement('style');
            styleElement.id = 'gbg-preview-styles';
            styleElement.textContent = styles;
            document.head.appendChild(styleElement);

            // Update button class based on selected type
            const buttonType = document.getElementById('gbg-button-type').value;
            previewButton.className = `sqs-button-element--${buttonType} gbg-preview-button`;
        }
    }
};

    // Clipboard and UI Actions
    const actions = {
        // State management for UI feedback
        state: {
            isCopying: false,
            isGenerating: false,
            lastCopied: null
        },

        // UI feedback handlers
        ui: {
            showToast(message, type = 'success') {
                const toast = utils.dom.createElement('div', `gbg-toast gbg-toast-${type}`);
                toast.textContent = message;
                document.body.appendChild(toast);
                
                // Remove after animation
                setTimeout(() => {
                    toast.classList.add('gbg-toast-fade');
                    setTimeout(() => toast.remove(), 300);
                }, 2000);
            },

            setButtonState(button, isLoading, originalText) {
                if (isLoading) {
                    button.disabled = true;
                    button.innerHTML = '<span class="gbg-spinner"></span>';
                } else {
                    button.disabled = false;
                    button.textContent = originalText;
                }
            },

            updateInputValidation(input, isValid) {
                input.style.borderColor = isValid ? '#444' : '#ff4d4d';
                if (isValid) {
                    input.classList.remove('gbg-input-error');
                    const errorMessage = input.nextElementSibling?.classList.contains('gbg-error-message');
                    if (errorMessage) errorMessage.remove();
                }
            },

            showError(input, message) {
                input.classList.add('gbg-input-error');
                const existing = input.nextElementSibling?.classList.contains('gbg-error-message');
                if (!existing) {
                    const error = utils.dom.createElement('div', 'gbg-error-message');
                    error.textContent = message;
                    input.parentNode.insertBefore(error, input.nextSibling);
                }
            }
        },

        // Clipboard operations
        async copyToClipboard() {
            if (this.state.isCopying) return;
            
            const output = document.getElementById('gbg-output');
            const copyButton = document.querySelector('.gbg-copy-button');
            const originalText = copyButton.textContent;

            this.state.isCopying = true;
            this.ui.setButtonState(copyButton, true, originalText);

            try {
                await navigator.clipboard.writeText(output.value);
                this.state.lastCopied = output.value;
                this.ui.showToast('Code copied to clipboard!');
                trackWidgetEvent('Copy Success');
            } catch (error) {
                // Fallback for clipboard API failure
                try {
                    output.select();
                    document.execCommand('copy');
                    this.state.lastCopied = output.value;
                    this.ui.showToast('Code copied to clipboard!');
                    trackWidgetEvent('Copy Fallback Success');
                } catch (fallbackError) {
                    this.ui.showToast('Failed to copy code', 'error');
                    utils.debug.error('Copy failed:', fallbackError);
                    trackWidgetEvent('Copy Failed');
                }
            } finally {
                this.state.isCopying = false;
                setTimeout(() => {
                    this.ui.setButtonState(copyButton, false, originalText);
                }, 1000);
            }
        },

        // Clear all fields
        clearFields() {
            const confirmClear = window.confirm('Are you sure you want to clear all fields?');
            if (!confirmClear) return;

            // Store current values for undo
            const previousValues = {};
            const inputs = document.querySelectorAll('.gbg-input-field');
            inputs.forEach(input => {
                previousValues[input.id] = input.value;
            });

            // Clear all inputs
            inputs.forEach(input => {
                if (input.type === 'text' || input.type === 'number') {
                    input.value = '';
                } else if (input.type === 'select-one') {
                    input.selectedIndex = 0;
                }
                this.ui.updateInputValidation(input, true);
            });

            // Reset radio buttons
            const linearRadio = document.querySelector('input[name="gradientType"][value="linear"]');
            if (linearRadio) linearRadio.checked = true;

            // Reset angle controls
            utils.dom.setInputValue('gbg-angle-slider', CONFIG.defaultAngle);
            utils.dom.setInputValue('gbg-angle-number', CONFIG.defaultAngle);

            // Clear output
            utils.dom.setInputValue('gbg-output', '');

            // Show toast with undo option
            const undoToast = utils.dom.createElement('div', 'gbg-toast gbg-toast-with-action');
            undoToast.innerHTML = `
                <span>All fields cleared</span>
                <button class="gbg-undo-button">Undo</button>
            `;
            document.body.appendChild(undoToast);

            // Handle undo
            undoToast.querySelector('.gbg-undo-button').onclick = () => {
                Object.entries(previousValues).forEach(([id, value]) => {
                    utils.dom.setInputValue(id, value);
                });
                generator.generateCSS();
                undoToast.remove();
                this.ui.showToast('Changes undone');
                trackWidgetEvent('Clear Undo');
            };

            setTimeout(() => {
                undoToast.classList.add('gbg-toast-fade');
                setTimeout(() => undoToast.remove(), 300);
            }, 5000);

            generator.generateCSS();
            trackWidgetEvent('Clear All');
        },

        // Export current settings
        exportSettings() {
            const settings = {
                buttonType: utils.dom.getInputValue('gbg-button-type'),
                blockId: utils.dom.getInputValue('gbg-block-id'),
                gradientType: document.querySelector('input[name="gradientType"]:checked').value,
                angle: utils.dom.getInputValue('gbg-angle-slider'),
                colors: generator.getGradientColors(),
                textColor: utils.dom.getInputValue('gbg-text-color'),
                borderColor: utils.dom.getInputValue('gbg-border-color'),
                expandHover: utils.dom.getInputValue('gbg-expand-hover'),
                shadowColor: utils.dom.getInputValue('gbg-shadow-color')
            };

            const blob = new Blob([JSON.stringify(settings, null, 2)], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const link = utils.dom.createElement('a');
            link.href = url;
            link.download = 'gradient-button-settings.json';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);

            this.ui.showToast('Settings exported');
            trackWidgetEvent('Export Settings');
        },

        // Import settings
        async importSettings(file) {
            try {
                const text = await file.text();
                const settings = JSON.parse(text);

                // Validate settings
                if (!settings.buttonType || !settings.colors) {
                    throw new Error('Invalid settings file');
                }

                // Apply settings
                Object.entries(settings).forEach(([key, value]) => {
                    if (key === 'colors') {
                        value.forEach((color, index) => {
                            utils.dom.setInputValue(`gbg-gradient-color-${index}`, color);
                        });
                    } else if (key === 'gradientType') {
                        const radio = document.querySelector(`input[name="gradientType"][value="${value}"]`);
                        if (radio) radio.checked = true;
                    } else {
                        const input = document.getElementById(`gbg-${key}`);
                        if (input) input.value = value;
                    }
                });

                generator.generateCSS();
                this.ui.showToast('Settings imported');
                trackWidgetEvent('Import Success');
            } catch (error) {
                this.ui.showToast('Failed to import settings', 'error');
                utils.debug.error('Import failed:', error);
                trackWidgetEvent('Import Failed');
            }
        }
    };

    // Main Widget Initialization
    function initGradientButtonGenerator(targetId) {
        const target = document.getElementById(targetId);
        if (!target) {
            utils.debug.error('Target element not found:', targetId);
            return;
        }

        try {
            // Create widget container
            const widget = utils.dom.createElement('div');
            widget.id = widgetId;
            widget.innerHTML = generateWidgetHTML();
            target.appendChild(widget);

            // Initialize all components
            initializers.initializeColorInputs();
            initializers.initColorSwatches();
            initializers.initGradientInputs();
            initializers.initAngleControls();
            initializers.initButtonControls();
            initializers.initCopyButton(); 
            

            // Set up click and drag handlers for color swatches
        const swatchesContainer = document.getElementById('gbg-swatches-container');
        if (swatchesContainer) {
            // Add click handler to container (event delegation)
            swatchesContainer.addEventListener('click', handlers.colorSwatch.handleClick);
            
            // Add drag handlers to individual swatches
            const swatches = swatchesContainer.getElementsByClassName('gbg-color-swatch');
            Array.from(swatches).forEach(swatch => {
                swatch.setAttribute('draggable', 'true');
                swatch.addEventListener('dragstart', handlers.dragDrop.handleDragStart);
                swatch.addEventListener('dragend', handlers.dragDrop.handleDragEnd);
                
                // Prevent drag from interfering with click
                swatch.addEventListener('mousedown', (e) => {
                    swatch.draggable = e.target === swatch;
                });
            });
        }

        // Set up drop targets (all color input fields)
        const colorInputs = document.querySelectorAll('.gbg-input-field[type="text"]');
        colorInputs.forEach(input => {
            input.addEventListener('dragover', handlers.dragDrop.handleDragOver);
            input.addEventListener('dragleave', handlers.dragDrop.handleDragLeave);
            input.addEventListener('drop', handlers.dragDrop.handleDrop);
        });

        // Add visual feedback styles
        const styleSheet = document.createElement('style');
        styleSheet.textContent = `
            .gbg-color-swatch.dragging {
                opacity: 0.7;
                transform: scale(1.1);
            }
            .gbg-input-field.drag-over {
                border-color: #4361EE !important;
                box-shadow: 0 0 0 2px rgba(67, 97, 238, 0.3);
            }
        `;
        document.head.appendChild(styleSheet);

            // Generate initial CSS
            generator.generateCSS();

            trackWidgetEvent('Widget Initialized');
            utils.debug.log('Widget initialized successfully');
        } catch (error) {
            utils.debug.error('Error initializing widget:', error);
        }
    }

    // Make widget initialization function globally available
    window.initGradientButtonGenerator = initGradientButtonGenerator;
})();


