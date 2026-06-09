# 🌾 Harvest Hope

**End Global Hunger Before 2030**

A strategic simulation game where you tackle global food insecurity by deploying interventions, managing limited resources, and responding to crises.

## 🎮 Play Now

**[Play Harvest Hope](https://yourusername.github.io/harvest-hope/)**

## ✨ Features

- 🌍 **8 Global Regions** - Each with unique challenges and opportunities
- 💵 **5 Intervention Types** - Cash transfers, drought-resistant crops, irrigation, AI technology, school feeding
- 📊 **Resource Management** - Balance funding, community trust, political capital, and evidence points
- 🎲 **Dynamic Events** - Respond to droughts, floods, policy opportunities, and research breakthroughs
- 🏆 **Global Leaderboard** - Compete with players worldwide
- ⏱️ **Race Against Time** - Achieve food security before 2030
- 🔬 **Evidence-Based** - All interventions based on real research and proven solutions

## 🎯 How to Play

1. **Choose Your Starting Region** - Each has different difficulty levels
2. **Deploy Interventions** - Use your $2.5B budget strategically
3. **Manage Resources** - Balance funding, trust, politics, and evidence
4. **Respond to Events** - Make critical decisions during crises
5. **Watch Programs Spread** - Successful interventions spread organically to neighbors
6. **Win Condition** - Reduce hunger below 5% in all regions before 2030

## 📚 Based on Real Solutions

Every intervention in Harvest Hope is based on evidence-based development solutions:

- **Cash Transfers** - Kenya's HSNP reaches 1.6M households
- **Drought-Resistant Crops** - Pearl millet yields +55% in dry conditions
- **AI Crop Detection** - Nuru app increased yields 30% in Kenya
- **School Feeding** - Improves enrollment and nutrition outcomes
- **Irrigation Systems** - Reduces stunting by 20% in Sub-Saharan Africa

## 🚀 Quick Start

### Local Play
1. Clone this repository
```bash
git clone https://github.com/yourusername/harvest-hope.git
cd harvest-hope
```

2. Open `index.html` in your browser
```bash
# On Mac/Linux
open index.html

# On Windows
start index.html

# Or use a simple server
python3 -m http.server 8000
# Then visit http://localhost:8000
```

### Deploy to GitHub Pages
1. Fork this repository
2. In your fork, go to **Settings → Pages**
3. Under "Source", select `main` branch
4. Your site will be live at `https://yourusername.github.io/harvest-hope/`

## 📊 Game Mechanics

### Resource Types
- **Funding ($2.5B)** - Spend on interventions
- **Community Trust (0-100%)** - Required for public support
- **Political Capital (0-100)** - Needed for policy changes
- **Evidence Points** - Unlock better interventions

### Regions
- East Africa (Hardest)
- West Africa
- Central Africa
- Southern Africa
- South Asia
- Southeast Asia
- Latin America
- Caribbean (Easiest)

### Interventions
| Intervention | Cost | Impact | Unlock |
|---|---|---|---|
| Cash Transfers | $50M | Immediate | Start |
| Drought Seeds | $30M | Long-term | Start |
| Irrigation | $200M | High | 100 Evidence |
| AI Detection | $40M | Moderate | 150 Evidence |
| School Feeding | $80M | Mixed | 50 Evidence |

## 🎓 Educational Use

This game is designed for:
- **Students** - Learn about global development and food security
- **Educators** - Teach systems thinking and evidence-based policymaking
- **Policymakers** - Understand intervention tradeoffs and cascading effects
- **NGOs** - Visualize impact of different funding strategies

## 🔬 Research References

This game is based on evidence from:
- World Food Programme
- FAO (Food and Agriculture Organization)
- IFAD (International Fund for Agricultural Development)
- World Bank Development Economics
- CGIAR Research Programs
- Penn State PlantVillage
- Kenya's Ministry of Agriculture

## 🎨 Customization

Want to modify the game? All game logic is in `js/game.js`:

```javascript
// Change starting funding
const GAME_CONFIG.startingFunding = 5000000000; // $5B

// Adjust intervention costs
INTERVENTIONS.cashTransfers.cost = 100000000; // $100M

// Add new regions in REGIONS object
// Add new events in RANDOM_EVENTS
```

## 💾 Data Storage

- **Scores** - Saved to browser's localStorage
- **Leaderboard** - Auto-updates when you refresh
- **No Account Needed** - All data stays on your device

To reset your scores:
```javascript
localStorage.removeItem('harvestHopeScores');
```

## 📱 Browser Support

- ✅ Chrome/Edge (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest)
- ✅ Mobile browsers (optimized for desktop)

## 🤝 Contributing

Found a bug? Have a suggestion?

1. [Open an Issue](https://github.com/yourusername/harvest-hope/issues)
2. [Submit a Pull Request](https://github.com/yourusername/harvest-hope/pulls)

## 📝 License

MIT License - See LICENSE file for details

## 🙏 Acknowledgments

This game was created to promote understanding of global food security challenges and evidence-based solutions.

Built with:
- [Phaser 3](https://phaser.io/) - Game framework
- [JavaScript ES6+](https://javascript.info/) - Programming
- Evidence from World Food Programme, FAO, IFAD, and World Bank

## 📖 Learn More

- [UN SDG 2: Zero Hunger](https://sdgs.un.org/goals/goal2)
- [World Food Programme](https://www.wfp.org)
- [FAO Food Security](https://www.fao.org/food-security)
- [IFAD Rural Poverty](https://www.ifad.org)

---

**Help end global hunger.** Start with this game, then take action in the real world.

🌾 **Play Now** → [Harvest Hope](https://yourusername.github.io/harvest-hope/)
