// Initialize game when page loads
document.addEventListener('DOMContentLoaded', function() {
    // Create Phaser game config
    const gameConfig = {
        type: Phaser.AUTO,
        width: 1024,
        height: 768,
        parent: 'harvest-hope-container',
        backgroundColor: '#1a1a2e',
        scene: [StartScene, GameScene, VictoryScene, GameOverScene],
        physics: {
            default: 'arcade',
            arcade: {
                debug: false
            }
        }
    };
    
    const game = new Phaser.Game(gameConfig);
    
    // Store game reference for global access
    window.harvestHopeGame = game;
    
    // Load leaderboard
    loadLeaderboard();
});

// Leaderboard functions
function loadLeaderboard() {
    // Try to load from localStorage first
    const savedScores = localStorage.getItem('harvestHopeScores');
    
    if (savedScores) {
        const scores = JSON.parse(savedScores);
        displayLeaderboard(scores.sort((a, b) => b.peopleFed - a.peopleFed));
    } else {
        // Show default message
        const tbody = document.getElementById('leaderboard-body');
        tbody.innerHTML = `<tr><td colspan="6" class="loading">No scores yet. Be the first to play!</td></tr>`;
    }
}

function submitScore(scoreData) {
    // Get existing scores
    const savedScores = localStorage.getItem('harvestHopeScores');
    let scores = savedScores ? JSON.parse(savedScores) : [];
    
    // Add new score with timestamp
    const newScore = {
        ...scoreData,
        date: new Date().toISOString()
    };
    
    scores.push(newScore);
    
    // Save to localStorage
    localStorage.setItem('harvestHopeScores', JSON.stringify(scores));
    
    // Update display
    loadLeaderboard();
    
    // Show confirmation
    alert(`✅ Score submitted! You ranked #${scores.length}`);
}

function displayLeaderboard(scores) {
    const tbody = document.getElementById('leaderboard-body');
    
    if (!scores || scores.length === 0) {
        tbody.innerHTML = `<tr><td colspan="6" class="loading">No scores yet. Be the first to play!</td></tr>`;
        return;
    }
    
    tbody.innerHTML = scores.slice(0, 50).map((score, index) => `
        <tr>
            <td>${index + 1}</td>
            <td>${escapeHtml(score.player)}</td>
            <td>${formatNumber(score.peopleFed)}</td>
            <td>${score.yearsElapsed.toFixed(1)} years</td>
            <td>${score.finalHungerLevel.toFixed(1)}%</td>
            <td>${formatDate(score.date)}</td>
        </tr>
    `).join('');
}

function formatNumber(num) {
    return (num / 1000000).toFixed(1) + 'M';
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString();
}

function escapeHtml(text) {
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };
    return text.replace(/[&<>"']/g, m => map[m]);
}

// Smooth scroll for navigation
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth' });
        }
    });
});
