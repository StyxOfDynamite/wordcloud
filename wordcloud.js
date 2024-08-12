function generateWordCloud() {
    const text = document.getElementById("textInput").value;
    const canvas = document.getElementById("wordCloudCanvas");
    const ctx = canvas.getContext("2d");
    const bgColor = document.getElementById("bgColorInput").value || "#ffffff"; // Default to white if no color selected

    // List of common stopwords to filter out
    const stopwords = [
        "the", "and", "is", "in", "on", "at", "of", "a", "an", "to", "for", 
        "with", "by", "about", "as", "from", "that", "this", "which", "or", 
        "but", "be", "are", "was", "were", "it", "its", "can", "could", 
        "would", "should", "have", "has", "had", "will", "shall", "not"
    ];

    // Set background color
    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    if (text.trim() === "") {
        alert("Please enter some text.");
        return;
    }

    const wordsArray = text.toLowerCase().replace(/[^\w\s]/g, '').split(/\s+/);
    const wordCount = {};

    // Count the frequency of each word, excluding stopwords
    wordsArray.forEach(word => {
        if (!stopwords.includes(word)) {
            wordCount[word] = (wordCount[word] || 0) + 1;
        }
    });

    // Sort words by frequency
    const sortedWords = Object.entries(wordCount).sort((a, b) => b[1] - a[1]);

    // Find the maximum frequency
    const maxCount = sortedWords[0][1];

    // Calculate canvas center
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;

    const placedWords = [];

    sortedWords.forEach(([word, count], index) => {
        const fontSize = (count / maxCount) * 50 + 10; // Scale font size
        const opacity = (count / maxCount) * 0.7 + 0.3; // Scale opacity from 0.3 to 1.0

        ctx.font = `${fontSize}px Arial`;
        ctx.globalAlpha = opacity;

        // Apply shadow to reduce harsh edges
        ctx.shadowColor = 'rgba(0, 0, 0, 0.1)';
        ctx.shadowBlur = 3;

        let placed = false;
        let attempts = 0;

        while (!placed && attempts < 300) { // Limit the number of attempts
            let angle, radius, x, y;

            if (index === 0) {
                // Place the first word at the center
                x = centerX - ctx.measureText(word).width / 2;
                y = centerY + fontSize / 2;
            } else {
                // Randomly position other words around the center
                angle = Math.random() * 2 * Math.PI; // Random angle
                radius = Math.random() * Math.min(centerX, centerY) * 0.8; // Random radius
                x = centerX + radius * Math.cos(angle) - ctx.measureText(word).width / 2;
                y = centerY + radius * Math.sin(angle) + fontSize / 2;
            }

            const wordBounds = {
                left: x,
                right: x + ctx.measureText(word).width,
                top: y - fontSize,
                bottom: y
            };

            if (!isCollision(wordBounds, placedWords)) {
                ctx.fillStyle = "#000000"; // Set text color to black or another color
                ctx.fillText(word, x, y);
                placed = true;
                placedWords.push(wordBounds);
            } else {
                attempts++;
            }
        }
    });
}

function isCollision(wordBounds, placedWords) {
    for (let i = 0; i < placedWords.length; i++) {
        const placedWord = placedWords[i];

        if (!(wordBounds.right < placedWord.left || 
              wordBounds.left > placedWord.right || 
              wordBounds.bottom < placedWord.top || 
              wordBounds.top > placedWord.bottom)) {
            return true; // Collision detected
        }
    }

    return false;
}

function downloadCanvas() {
    const canvas = document.getElementById("wordCloudCanvas");
    const link = document.createElement("a");
    link.href = canvas.toDataURL("image/png");
    link.download = "wordcloud.png";
    link.click();
}