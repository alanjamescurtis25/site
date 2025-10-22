// Site Configuration
// Update these values with your actual information

const SITE_CONFIG = {
    // Google Analytics tracking ID
    // Get your tracking ID from https://analytics.google.com/
    // Format: G-XXXXXXXXXX
    googleAnalyticsId: 'G-XXXXXXXXXX',

    // Your domain (used for Open Graph tags)
    // Example: 'https://alanjamescurtis.com'
    domain: 'https://yourdomain.com',

    // Default Open Graph image
    // This image appears when your site is shared on social media
    ogImage: '/og-image.jpg'
};

// Initialize Google Analytics if ID is configured
if (SITE_CONFIG.googleAnalyticsId && SITE_CONFIG.googleAnalyticsId !== 'G-XXXXXXXXXX') {
    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${SITE_CONFIG.googleAnalyticsId}`;
    document.head.appendChild(script);

    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', SITE_CONFIG.googleAnalyticsId);
}
