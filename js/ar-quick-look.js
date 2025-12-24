// AR Quick Look implementation for iOS devices
function loadARQuickLook(foodData) {
    // Create a link element for AR Quick Look
    const link = document.createElement('a');
    link.setAttribute('rel', 'ar');
    
    // Check if we can use the USDZ format (preferred for AR Quick Look)
    // Since we only have GLB and WEBP, we'll use the GLB file
    link.setAttribute('href', foodData.model);
    
    // Add the image as a fallback for non-AR viewing
    const img = document.createElement('img');
    img.setAttribute('src', foodData.fallback);
    img.setAttribute('alt', foodData.name);
    link.appendChild(img);
    
    // Add AR Quick Look specific attributes
    link.setAttribute('title', foodData.name);
    
    // iOS specific attributes for AR Quick Look
    link.setAttribute('ios', '');
    
    // Set the scale of the model (12 inches)
    const scale = 0.3048; // 12 inches in meters
    link.setAttribute('scale', `${scale} ${scale} ${scale}`);
    
    // Append the link to the body (it needs to be in the DOM to work)
    document.body.appendChild(link);
    
    // Programmatically click the link to trigger AR Quick Look
    link.click();
    
    // Remove the link after a short delay
    setTimeout(() => {
        if (link.parentNode) {
            link.parentNode.removeChild(link);
        }
    }, 1000);
    
    // Note: AR Quick Look doesn't provide a way to detect when the AR session ends
    // The user will need to use the device's back button to return to the web page
}