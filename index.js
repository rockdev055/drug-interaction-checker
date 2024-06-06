const fs = require('fs');
const readline = require('readline');

// Load interactions from JSON file
function loadInteractions(filePath) {
    const fileData = fs.readFileSync(filePath);
    const interactionsData = JSON.parse(fileData);
    const interactions = new Map();
    
    interactionsData.forEach(interaction => {
        const key = new Set(interaction.drugs.map(drug => drug.toLowerCase()));
        interactions.set(JSON.stringify([...key]), {
            severity: interaction.severity,
            description: interaction.description
        });
    });

    return interactions;
}

// Find the most severe interaction
function findMostSevereInteraction(drugs, interactions) {
    const severityOrder = {
        'contraindication': 4,
        'major': 3,
        'moderate': 2,
        'minor': 1,
        'No Interaction': 0
    };

    let mostSevere = 'No Interaction';
    let mostSevereDescription = '';

    // Generate combinations of two drugs
    for (let i = 0; i < drugs.length; i++) {
        for (let j = i + 1; j < drugs.length; j++) {
            const key = new Set([drugs[i].toLowerCase(), drugs[j].toLowerCase()]);
            const interaction = interactions.get(JSON.stringify([...key]));
            if (interaction && severityOrder[interaction.severity] > severityOrder[mostSevere]) {
                mostSevere = interaction.severity;
                mostSevereDescription = interaction.description;
            }
        }
    }

    return mostSevere === 'No Interaction' ? mostSevere : `${mostSevere}: ${mostSevereDescription}`;
}

// Main function to process inputs
function main() {
    const interactions = loadInteractions('interactions.json');
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    rl.on('line', (input) => {
        const drugs = input.split(' ');
        const result = findMostSevereInteraction(drugs, interactions);
        console.log(result);
    });

    rl.on('close', () => {
        console.log('Interaction checking completed.');
    });
}

main();
