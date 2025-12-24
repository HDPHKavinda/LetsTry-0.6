document.addEventListener('DOMContentLoaded', () => {
    // Get DOM elements
    const viewInArButton = document.getElementById('view-in-ar');
    const arContainer = document.getElementById('ar-container');
    const fallbackContainer = document.getElementById('fallback-container');
    
    // Load food data
    let foodData;
    fetch('assets/pizza/data.json')
        .then(response => response.json())
        .then(data => {
            foodData = data;
        })
        .catch(error => {
            console.error('Error loading food data:', error);
        });
    
    // Detect device capabilities
    function detectDeviceCapabilities() {
        const userAgent = navigator.userAgent.toLowerCase();
        const isIOS = /iphone|ipad|ipod/.test(userAgent);
        const isAndroid = /android/.test(userAgent);
        const isWebXRSupported = 'xr' in navigator && 'isSessionSupported' in navigator.xr;
        
        return {
            isIOS,
            isAndroid,
            isWebXRSupported
        };
    }
    
    // Handle AR button click
    viewInArButton.addEventListener('click', async () => {
        const { isIOS, isAndroid, isWebXRSupported } = detectDeviceCapabilities();
        
        // Hide the main content
        document.querySelector('.food-card').style.display = 'none';
        
        if (isIOS) {
            // Use AR Quick Look for iOS
            loadARQuickLook(foodData);
        } else if (isAndroid && isWebXRSupported) {
            // Use WebXR for Android
            arContainer.classList.remove('hidden');
            await loadWebXRAr(arContainer, foodData);
        } else {
            // Use 3D fallback for unsupported devices
            fallbackContainer.classList.remove('hidden');
            loadFallbackViewer(fallbackContainer, foodData);
        }
    });
    
    // Function to exit AR view
    function exitARView() {
        arContainer.classList.add('hidden');
        fallbackContainer.classList.add('hidden');
        document.querySelector('.food-card').style.display = 'block';
    }
    
    // Add event listener for exiting AR view (e.g., back button)
    window.addEventListener('popstate', (event) => {
        if (!arContainer.classList.contains('hidden') || !fallbackContainer.classList.contains('hidden')) {
            exitARView();
        }
    });
    
    // Add exit button to AR containers
    function addExitButton(container) {
        const exitButton = document.createElement('button');
        exitButton.textContent = 'Exit AR';
        exitButton.className = 'exit-button';
        exitButton.style.position = 'absolute';
        exitButton.style.top = '20px';
        exitButton.style.right = '20px';
        exitButton.style.zIndex = '1000';
        exitButton.style.padding = '8px 16px';
        exitButton.style.backgroundColor = 'rgba(255, 255, 255, 0.8)';
        exitButton.style.border = 'none';
        exitButton.style.borderRadius = '4px';
        exitButton.style.cursor = 'pointer';
        
        exitButton.addEventListener('click', exitARView);
        
        container.appendChild(exitButton);
    }
    
    // Add exit buttons to containers
    addExitButton(arContainer);
    addExitButton(fallbackContainer);
});