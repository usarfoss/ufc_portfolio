// UFC Mock Project Data
// Using placeholder images from Unsplash or generic placeholders.
const MOCK_PROJECTS = Array.from({ length: 30 }, (_, i) => {
    const domains = ['FinTech', 'Web3', 'AI/ML', 'E-Commerce', 'SaaS', 'Healthcare'];
    const techs = ['React', 'Node.js', 'Python', 'Solidity', 'Vue', 'Next.js', 'PyTorch', 'AWS'];
    
    // Pick random domain
    const domain = domains[Math.floor(Math.random() * domains.length)];
    
    // Pick 2-3 random techs
    const numTechs = Math.floor(Math.random() * 2) + 2;
    const stack = [];
    for(let j=0; j<numTechs; j++) {
        stack.push(techs[Math.floor(Math.random() * techs.length)]);
    }
    const uniqueStack = [...new Set(stack)];

    const titles = [
        "Nexus Data Pipeline", "Aura DeFi Platform", "Vanguard AI Dashboard", 
        "Echo CRM", "Zenith Health App", "Quantum Trading Bot", 
        "Vertex Analytics", "Orbit Logistics Sys", "Nova E-Commerce", 
        "Pulse Social Graph"
    ];

    const title = titles[i % titles.length] + (i >= titles.length ? ` v${Math.floor(i/titles.length) + 1}` : '');

    return {
        id: i + 1,
        title: title,
        domain: domain,
        techStack: uniqueStack.join(', '),
        image: `https://images.unsplash.com/photo-${1500000000000 + i * 1000000}?auto=format&fit=crop&q=80&w=800&h=600`, // random-ish looking hash for unsplash
        // We will use a reliable placeholder service for production readiness
        realImage: `https://picsum.photos/seed/${i+1}/800/600`,
        shortDescription: `A scalable ${domain} solution utilizing ${uniqueStack[0]} to drive business growth.`
    };
});
