const puppeteer = require('puppeteer');

(async () => {
    const adDomains = new Set();

    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();

    // Monitor all network requests
    page.on('request', request => {
        const url = request.url();
        const hostname = new URL(url).hostname;

        // Match typical ad/tracker domains
        const adIndicators = ['ads', 'doubleclick', 'track', 'analytics', 'sponsor'];
        if (adIndicators.some(indicator => hostname.includes(indicator)) && request.resourceType() === 'script' || request.resourceType() === 'xhr') {
            adDomains.add(hostname);
        }

        
    });

    // Go to target website (change this!)
    const targetUrl = 'http://nhentai.net/language/english/popular?page=95';
    await page.goto(targetUrl, { waitUntil: 'networkidle2' });

    // Wait a bit longer for lazy-loaded ads
    await new Promise(resolve => setTimeout(resolve, 5000));

    console.log(`\n🔍 Ad-related domains found on ${targetUrl}:\n`);
    for (const domain of adDomains) {
        console.log(`- ${domain}`);
    }

    await browser.close();
})();