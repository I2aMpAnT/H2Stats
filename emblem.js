// Emblem Generator JavaScript - Individual Image Version
// Uses individual PNG files instead of sprite sheets
// Supports 4-color system: Emblem Primary/Secondary, Background Primary/Secondary

(function() {
    // Halo 2 emblem color palette (accurate colors from in-game color blocks)
    // Index matches the color block BMP file codes
    const colorPalette = [
        { r: 255, g: 255, b: 255, code: '10E0', name: 'White' },
        { r: 110, g: 110, b: 110, code: '11E0', name: 'Steel' },
        { r: 189, g: 43,  b: 44,  code: '12E0', name: 'Red' },
        { r: 244, g: 123, b: 32,  code: '13E0', name: 'Orange' },
        { r: 244, g: 209, b: 45,  code: '14E0', name: 'Gold' },
        { r: 158, g: 169, b: 90,  code: '15E0', name: 'Olive' },
        { r: 35,  g: 145, b: 46,  code: '16E0', name: 'Green' },
        { r: 36,  g: 87,  b: 70,  code: '17E0', name: 'Sage' },
        { r: 22,  g: 160, b: 160, code: '18E0', name: 'Cyan' },
        { r: 55,  g: 115, b: 123, code: '27E0', name: 'Teal' },
        { r: 32,  g: 113, b: 178, code: '19E0', name: 'Cobalt' },
        { r: 45,  g: 60,  b: 180, code: '1FE0', name: 'Blue' },
        { r: 108, g: 80,  b: 182, code: '20E0', name: 'Violet' },
        { r: 148, g: 39,  b: 132, code: '22E0', name: 'Purple' },
        { r: 248, g: 155, b: 200, code: '23E0', name: 'Pink' },
        { r: 156, g: 15,  b: 68,  code: '24E0', name: 'Crimson' },
        { r: 120, g: 73,  b: 43,  code: '25E0', name: 'Brown' },
        { r: 175, g: 144, b: 87,  code: '26E0', name: 'Tan' }
    ];

    // Foreground emblem filenames (index matches game's EF parameter from halo2pc.com)
    // Order matches halo2pc.com emblem.php EF parameter values
    const foregroundFiles = [
        'Seventh Column.png',   // 0 - EF=0
        'Bullseye.png',         // 1 - EF=1
        'Vortex.png',           // 2 - EF=2
        'Halt.png',             // 3 - EF=3
        'Spartan.png',          // 4 - EF=4
        'Da Bomb.png',          // 5 - EF=5
        'Sol.png',              // 6
        'Double Crescent.png',  // 7
        'Sergeant.png',         // 8
        'Drone.png',            // 9
        'Phoenix.png',          // 10 - EF=10
        'Champion.png',         // 11 - EF=11
        'Jolly Roger.png',      // 12 - EF=12
        'Delta.png',            // 13
        'Helmet.png',           // 14
        'Cube.png',             // 15
        'Cleave.png',           // 16
        'Grunt.png',            // 17
        'Radioactive.png',      // 18
        'Smiley.png',           // 19
        'Frowney.png',          // 20
        'Triad.png',            // 21
        'Waypoint.png',         // 22
        'Trinity.png',          // 23
        'Ying Yang.png',        // 24
        'Brute Head.png',       // 25
        'Spearhead.png',        // 26
        'Trident.png',          // 27
        'Skull King.png',       // 28
        'Triplicate.png',       // 29
        'Subnova.png',          // 30
        'Marathon.png',         // 31
        'Valkyrie.png',         // 32
        'Spades.png',           // 33
        'Clubs.png',            // 34
        'Diamonds.png',         // 35
        'Hearts.png',           // 36
        'Snake.png',            // 37
        'Flaming Ninja.png',    // 38
        'Rampancy.png',         // 39
        'Hawk.png',             // 40
        'Lips.png',             // 41
        'Capsule.png',          // 42
        'Race.png',             // 43
        'Gas Mask.png',         // 44
        'Grenade.png',          // 45
        'Thor.png',             // 46
        'Mark of Shame.png',    // 47
        'Wasp.png',             // 48
        'Runes.png',            // 49
        'Grunt Head.png',       // 50
        'Tsantsa.png',          // 51
        'Cancel.png',           // 52
        'Number 0.png',         // 53
        'Number 1.png',         // 54
        'Number 2.png',         // 55
        'Number 3.png',         // 56
        'Number 4.png',         // 57
        'Number 5.png',         // 58
        'Number 6.png',         // 59
        'Number 7.png',         // 60
        'Number 8.png',         // 61
        'Number 9.png'          // 62
    ];

    // Background filenames (index matches halo2pc.com EB parameter values)
    const backgroundFiles = [
        'Solid.png',            // 0 - EB=0
        'Vertical Split.png',   // 1 - EB=1
        'Horizontal Split 1.png', // 2 - EB=2
        'Horizontal Split 2.png', // 3 - EB=3
        'Horizontal Gradient.png', // 4 - EB=4 (doesn't load in halo2pc)
        'Vertical Gradient.png',  // 5 - EB=5 (doesn't load in halo2pc)
        'Triple Column.png',    // 6 - EB=6
        'Quadrants 1.png',      // 7
        'DIagonal Slice.png',   // 8
        'Cleft.png',            // 9
        'X1.png',               // 10
        'X2.png',               // 11
        'Diamond.png',          // 12
        'Cross.png',            // 13
        'Square.png',           // 14
        'Dual Half-Circle.png', // 15
        'Diagonal Quadrant.png', // 16
        'Three Quarters.png',   // 17
        'Quarter.png',          // 18
        'Four Rows 1.png',      // 19
        'Split Circle.png',     // 20
        'One Third.png',        // 21
        'Two Thirds.png',       // 22
        'Upper Field.png',      // 23
        'Top and Bottom.png',   // 24
        'Center Stripe.png',    // 25
        'Left and Right.png',   // 26
        'Circle.png',           // 27
        'Triangle.png',         // 28
        'Four Rows 2.png',      // 29
        'Quadrants 2.png',      // 30
        'Triple Row.png'        // 31
    ];

    // Image cache for loaded images
    const imageCache = {};

    // Load a single image and cache it
    function loadImage(path) {
        return new Promise((resolve, reject) => {
            if (imageCache[path]) {
                resolve(imageCache[path]);
                return;
            }
            const img = new Image();
            img.onload = () => {
                imageCache[path] = img;
                resolve(img);
            };
            img.onerror = () => {
                console.error('Failed to load:', path);
                reject(new Error('Failed to load: ' + path));
            };
            img.src = path;
        });
    }

    // Initialize color picker grids with BMP images
    function initColorPickers() {
        const pickers = document.querySelectorAll('.color-picker');
        pickers.forEach(picker => {
            const targetId = picker.dataset.target;
            const input = document.getElementById(targetId);
            if (!input) return;

            picker.innerHTML = '';
            colorPalette.forEach((color, index) => {
                const swatch = document.createElement('div');
                swatch.className = 'color-swatch';
                swatch.dataset.value = index;
                swatch.title = color.name;
                // Use BMP as background image
                swatch.style.backgroundImage = `url('emblems/color%20blocks/${color.code}.bmp')`;
                // Fallback to solid color if BMP fails
                swatch.style.backgroundColor = `rgb(${color.r}, ${color.g}, ${color.b})`;

                if (parseInt(input.value) === index) {
                    swatch.classList.add('selected');
                }

                swatch.addEventListener('click', () => {
                    // Remove selection from siblings
                    picker.querySelectorAll('.color-swatch').forEach(s => s.classList.remove('selected'));
                    swatch.classList.add('selected');
                    input.value = index;
                    updateEmblem();
                });

                picker.appendChild(swatch);
            });
        });
    }

    // Preload essential images for faster initial render
    async function preloadImages() {
        try {
            const defaultFg = 'emblems/embems/' + encodeURIComponent(foregroundFiles[37]); // Rampancy
            const defaultBg = 'emblems/backgrounds/' + encodeURIComponent(backgroundFiles[5]);
            await Promise.all([loadImage(defaultFg), loadImage(defaultBg)]);
            updateEmblem();
        } catch (e) {
            console.error('Error preloading images:', e);
            updateEmblem();
        }
    }

    // Smooth interpolation helper
    function smoothstep(edge0, edge1, x) {
        const t = Math.max(0, Math.min(1, (x - edge0) / (edge1 - edge0)));
        return t * t * (3 - 2 * t);
    }

    // Linear interpolation
    function lerp(a, b, t) {
        return a + (b - a) * t;
    }

    window.updateEmblem = async function() {
        const canvas = document.getElementById('emblemCanvas');
        if (!canvas) return;

        const ctx = canvas.getContext('2d');

        // Get all 4 colors
        const emblemPrimary = parseInt(document.getElementById('emblemPrimary')?.value || 1);
        const emblemSecondary = parseInt(document.getElementById('emblemSecondary')?.value || 0);
        const bgPrimary = parseInt(document.getElementById('bgPrimary')?.value || 11);
        const bgSecondary = parseInt(document.getElementById('bgSecondary')?.value || 0);
        const emblemForeground = parseInt(document.getElementById('emblemForeground')?.value || 0);
        const emblemBackground = parseInt(document.getElementById('emblemBackground')?.value || 0);
        const emblemToggle = document.getElementById('emblemToggle')?.checked ? 1 : 0;

        // Clear canvas with black background
        ctx.fillStyle = '#000000';
        ctx.fillRect(0, 0, 256, 256);

        // Get file paths
        const fgFile = foregroundFiles[emblemForeground] || foregroundFiles[0];
        const bgFile = backgroundFiles[emblemBackground] || backgroundFiles[0];
        const fgPath = 'emblems/embems/' + encodeURIComponent(fgFile);
        const bgPath = 'emblems/backgrounds/' + encodeURIComponent(bgFile);

        try {
            const [fgImg, bgImg] = await Promise.all([
                loadImage(fgPath),
                loadImage(bgPath)
            ]);

            // Draw background with background colors
            drawBackground(ctx, bgImg, colorPalette[bgPrimary], colorPalette[bgSecondary]);

            // Draw foreground with emblem colors
            drawForeground(ctx, fgImg, colorPalette[emblemPrimary], colorPalette[emblemSecondary], emblemToggle);
        } catch (e) {
            console.error('Error rendering emblem:', e);
        }
    }

    // Draw background - transparent/black areas get primary color, blue channel gets secondary color
    function drawBackground(ctx, img, primaryColor, secondaryColor) {
        const tempCanvas = document.createElement('canvas');
        const size = 256;
        tempCanvas.width = size;
        tempCanvas.height = size;
        const tempCtx = tempCanvas.getContext('2d');

        // Enable image smoothing for better quality
        tempCtx.imageSmoothingEnabled = true;
        tempCtx.imageSmoothingQuality = 'high';
        tempCtx.drawImage(img, 0, 0, size, size);

        const imageData = tempCtx.getImageData(0, 0, size, size);
        const data = imageData.data;

        for (let i = 0; i < data.length; i += 4) {
            const r = data[i];
            const g = data[i + 1];
            const b = data[i + 2];
            const a = data[i + 3];

            // Background PNGs use:
            // - Black/transparent areas → Primary color
            // - Blue channel → Secondary color
            // Blend ratio based on blue channel intensity

            const blueRatio = b / 255;

            // Lerp between primary (where black/no blue) and secondary (where blue)
            data[i] = Math.round(lerp(primaryColor.r, secondaryColor.r, blueRatio));
            data[i + 1] = Math.round(lerp(primaryColor.g, secondaryColor.g, blueRatio));
            data[i + 2] = Math.round(lerp(primaryColor.b, secondaryColor.b, blueRatio));
            data[i + 3] = 255;
        }

        tempCtx.putImageData(imageData, 0, 0);
        ctx.drawImage(tempCanvas, 0, 0);
    }

    // Draw foreground - yellow pixels get primary color, blue pixels get secondary color
    // Smooth edge handling with proper antialiasing
    function drawForeground(ctx, img, primaryColor, secondaryColor, toggle) {
        const tempCanvas = document.createElement('canvas');
        const size = 256;
        tempCanvas.width = size;
        tempCanvas.height = size;
        const tempCtx = tempCanvas.getContext('2d');

        // Enable image smoothing
        tempCtx.imageSmoothingEnabled = true;
        tempCtx.imageSmoothingQuality = 'high';
        tempCtx.drawImage(img, 0, 0, size, size);

        const imageData = tempCtx.getImageData(0, 0, size, size);
        const data = imageData.data;

        for (let i = 0; i < data.length; i += 4) {
            const r = data[i];
            const g = data[i + 1];
            const b = data[i + 2];
            const a = data[i + 3];

            // Skip fully transparent pixels
            if (a === 0) continue;

            // Black/near-black pixels are transparent background
            const brightness = (r + g + b) / 3;
            if (brightness < 20) {
                data[i + 3] = 0;
                continue;
            }

            // Foreground images use yellow (255,255,0) for primary and blue (0,0,255) for secondary
            // Calculate how "yellow" vs "blue" this pixel is

            // Yellow has high R and G, low B
            // Blue has low R and G, high B
            const yellowStrength = Math.min(r, g) / 255;
            const blueStrength = b / 255;
            const totalStrength = yellowStrength + blueStrength;

            if (totalStrength < 0.05) {
                // Very dark pixel - make transparent
                data[i + 3] = 0;
                continue;
            }

            // Normalize to get blend ratio
            let primaryRatio = yellowStrength / Math.max(totalStrength, 0.001);
            let secondaryRatio = blueStrength / Math.max(totalStrength, 0.001);

            // Apply toggle (hide primary color layer)
            if (toggle === 1) {
                if (primaryRatio > 0.9) {
                    data[i + 3] = 0;
                    continue;
                }
                primaryRatio = 0;
                secondaryRatio = 1;
            }

            // Calculate alpha based on total color strength for smooth edges
            const alpha = Math.round(255 * smoothstep(0.1, 0.5, totalStrength));

            // Blend primary and secondary colors
            const finalR = primaryColor.r * primaryRatio + secondaryColor.r * secondaryRatio;
            const finalG = primaryColor.g * primaryRatio + secondaryColor.g * secondaryRatio;
            const finalB = primaryColor.b * primaryRatio + secondaryColor.b * secondaryRatio;

            data[i] = Math.round(Math.min(255, finalR));
            data[i + 1] = Math.round(Math.min(255, finalG));
            data[i + 2] = Math.round(Math.min(255, finalB));
            data[i + 3] = alpha;
        }

        tempCtx.putImageData(imageData, 0, 0);
        ctx.drawImage(tempCanvas, 0, 0);
    }

    window.downloadEmblem = function() {
        const canvas = document.getElementById('emblemCanvas');
        const link = document.createElement('a');
        link.download = 'halo2-emblem.png';
        link.href = canvas.toDataURL('image/png');
        link.click();
    }

    // Parse URL parameters and set emblem values
    // Parameters match halo2pc.com format:
    // P=primary color, S=secondary color, EP=emblem primary, ES=emblem secondary
    // EF=emblem foreground, EB=emblem background, ET=emblem toggle
    function applyUrlParameters() {
        const urlParams = new URLSearchParams(window.location.search);

        const params = {
            'EF': 'emblemForeground',
            'EB': 'emblemBackground',
            'EP': 'emblemPrimary',
            'ES': 'emblemSecondary',
            'P': 'bgPrimary',
            'S': 'bgSecondary'
        };

        Object.entries(params).forEach(([param, elementId]) => {
            const value = urlParams.get(param);
            if (value !== null) {
                const el = document.getElementById(elementId);
                if (el) el.value = value;
            }
        });

        const emblemToggle = urlParams.get('ET');
        if (emblemToggle !== null) {
            const toggleCheckbox = document.getElementById('emblemToggle');
            if (toggleCheckbox) toggleCheckbox.checked = (emblemToggle === '1');
        }

        // Switch to emblem tab if parameters provided
        if (urlParams.has('EF') || urlParams.has('EB') || urlParams.has('EP')) {
            setTimeout(() => {
                if (typeof switchMainTab === 'function') {
                    switchMainTab('emblem');
                }
            }, 100);
        }
    }

    // Generate emblem URL with current settings
    window.getEmblemUrl = function() {
        const emblemForeground = document.getElementById('emblemForeground')?.value || 0;
        const emblemBackground = document.getElementById('emblemBackground')?.value || 0;
        const emblemPrimary = document.getElementById('emblemPrimary')?.value || 1;
        const emblemSecondary = document.getElementById('emblemSecondary')?.value || 0;
        const bgPrimary = document.getElementById('bgPrimary')?.value || 11;
        const bgSecondary = document.getElementById('bgSecondary')?.value || 0;
        const emblemToggle = document.getElementById('emblemToggle')?.checked ? 1 : 0;

        const params = new URLSearchParams({
            P: bgPrimary,
            S: bgSecondary,
            EP: emblemPrimary,
            ES: emblemSecondary,
            EF: emblemForeground,
            EB: emblemBackground,
            ET: emblemToggle
        });

        return window.location.origin + window.location.pathname + '?' + params.toString();
    }

    // Copy emblem URL to clipboard
    window.copyEmblemUrl = function() {
        const url = getEmblemUrl();
        navigator.clipboard.writeText(url).then(() => {
            // Show brief feedback
            const canvas = document.getElementById('emblemCanvas');
            if (canvas) {
                canvas.style.outline = '3px solid #00ff00';
                setTimeout(() => {
                    canvas.style.outline = '';
                }, 500);
            }
        }).catch(err => {
            console.error('Failed to copy URL:', err);
            // Fallback: select text in a temporary input
            const input = document.createElement('input');
            input.value = url;
            document.body.appendChild(input);
            input.select();
            document.execCommand('copy');
            document.body.removeChild(input);
        });
    }

    // Initialize everything when DOM is ready
    function init() {
        applyUrlParameters();
        initColorPickers();
        preloadImages();

        // Add click-to-copy handler to emblem canvas
        const canvas = document.getElementById('emblemCanvas');
        if (canvas) {
            canvas.style.cursor = 'pointer';
            canvas.title = 'Click to copy emblem URL';
            canvas.addEventListener('click', copyEmblemUrl);
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    // Re-render when emblem tab becomes visible
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.type === 'attributes' && mutation.attributeName === 'style') {
                const emblemTab = document.getElementById('main-tab-emblem');
                if (emblemTab && emblemTab.style.display !== 'none') {
                    // Re-init color pickers in case they weren't visible before
                    initColorPickers();
                    updateEmblem();
                }
            }
        });
    });

    setTimeout(() => {
        const emblemTab = document.getElementById('main-tab-emblem');
        if (emblemTab) {
            observer.observe(emblemTab, { attributes: true, attributeFilter: ['style'] });
        }
    }, 100);
})();
