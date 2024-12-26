;(function() {
    'use strict';
    
    // Generate unique widget ID
    const widgetId = 'gradient-button-' + Math.random().toString(36).substr(2, 9);

    // Widget Configuration
    const CONFIG = {
        defaultColors: ['#00FF87', '#60EFFF'],
        defaultAngle: 90,
        defaultButtonType: 'primary',
        maxGradientColors: 6,
        defaults: {
            textColor: '#EBE8E0',
            expandOnHover: 'no',
            gradientType: 'linear'
        },
        analytics: {
            enabled: true,
            creator: 'luxwebsitetemplates.com',
            version: '1.0.0'
        }
    };

    // Color swatches data
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
            { name: 'Midnight', values: ['#232526', '#414345'] }
        ]
    };

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

    // Continue with rest of the implementation...
})();
