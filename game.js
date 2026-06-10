class StartScene extends Phaser.Scene {
    constructor() {
        super({ key: 'StartScene' });
    }

    create() {
        const centerX = this.cameras.main.centerX;

        this.add.text(centerX, 100, '🌾 HARVEST HOPE 🌾', {
            fontSize: '64px', fontFamily: 'Arial, sans-serif',
            color: '#ffffff', fontStyle: 'bold'
        }).setOrigin(0.5);

        this.add.text(centerX, 180, 'End Global Hunger Before 2030', {
            fontSize: '28px', fontFamily: 'Arial, sans-serif', color: '#ecf0f1'
        }).setOrigin(0.5);

        const instructions = [
            'Deploy interventions across the globe',
            'Manage limited resources wisely',
            'Respond to crises and opportunities',
            'Reduce hunger below 5% in all regions'
        ];

        instructions.forEach((text, index) => {
            this.add.text(centerX, 280 + (index * 40), '• ' + text, {
                fontSize: '20px', fontFamily: 'Arial, sans-serif', color: '#bdc3c7'
            }).setOrigin(0.5);
        });

        this.add.text(centerX, 480, 'Enter Your Name:', {
            fontSize: '24px', fontFamily: 'Arial, sans-serif', color: '#ffffff'
        }).setOrigin(0.5);

        this.createNameInput();

        const playButton = this.add.rectangle(centerX, 600, 300, 80, 0x27ae60);
        playButton.setInteractive({ useHandCursor: true });

        this.add.text(centerX, 600, 'START GAME', {
            fontSize: '32px', fontFamily: 'Arial, sans-serif',
            color: '#ffffff', fontStyle: 'bold'
        }).setOrigin(0.5);

        playButton.on('pointerover', () => playButton.setFillStyle(0x2ecc71));
        playButton.on('pointerout', () => playButton.setFillStyle(0x27ae60));
        playButton.on('pointerdown', () => {
            const playerName = document.getElementById('player-name-input')?.value || 'Anonymous Player';
            this.registry.set('playerName', playerName);
            this.scene.start('GameScene');
        });

        this.add.text(centerX, 700, 'Normal Difficulty | Target: 2030 | Starting Fund: $2.5B', {
            fontSize: '16px', fontFamily: 'Arial, sans-serif', color: '#95a5a6'
        }).setOrigin(0.5);
    }

    createNameInput() {
        const gameContainer = document.getElementById('harvest-hope-container');
        const existing = document.getElementById('player-name-input');
        if (existing) existing.remove();

        const input = document.createElement('input');
        input.id = 'player-name-input';
        input.type = 'text';
        input.placeholder = 'Your name...';
        input.maxLength = 20;
        input.style.cssText = `
            position: absolute;
            top: 52%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 300px;
            height: 40px;
            font-size: 20px;
            text-align: center;
            border: 2px solid #3498db;
            border-radius: 5px;
            padding: 5px;
            z-index: 100;
        `;

        gameContainer.style.position = 'relative';
        gameContainer.appendChild(input);
        input.focus();
    }
}

class GameScene extends Phaser.Scene {
    constructor() {
        super({ key: 'GameScene' });
    }

    init() {
        this.gameState = {
            playerName: this.registry.get('playerName') || 'Player',
            funding: GAME_CONFIG.startingFunding,
            communityTrust: GAME_CONFIG.startingTrust,
            politicalCapital: GAME_CONFIG.startingPolitics,
            evidencePoints: 0,
            peopleFed: 0,
            currentYear: GAME_CONFIG.startingYear,
            monthsElapsed: 0,
            interventionsUnlocked: {
                cashTransfers: true,
                droughtSeeds: true,
                irrigation: false,
                aiCropDetection: false,
                schoolFeeding: false
            },
            regions: {}
        };

        Object.keys(REGIONS).forEach(regionId => {
            this.gameState.regions[regionId] = {
                ...REGIONS[regionId],
                hungerLevel: REGIONS[regionId].initialHunger,
                interventionsActive: [],
                highlighted: false
            };
        });

        this.selectedRegion = null;
        this.isPaused = false;
        this.regionPanel = null;
    }

    create() {
        const input = document.getElementById('player-name-input');
        if (input) input.remove();

        this.add.rectangle(512, 384, 1024, 768, 0x1a1a2e);
        this.createStatsBar();
        this.createWorldMap();
        this.createInterventionPanel();
        this.createTimerDisplay();
        this.startGameClock();
        this.showTutorial();
    }

    createStatsBar() {
        this.add.rectangle(512, 40, 1000, 70, 0x2c3e50);

        this.fundingText = this.add.text(50, 18, '', {
            fontSize: '18px', fontFamily: 'Arial', color: '#f39c12'
        });
        this.trustText = this.add.text(280, 18, '', {
            fontSize: '18px', fontFamily: 'Arial', color: '#3498db'
        });
        this.politicsText = this.add.text(500, 18, '', {
            fontSize: '18px', fontFamily: 'Arial', color: '#9b59b6'
        });
        this.evidenceText = this.add.text(50, 45, '', {
            fontSize: '18px', fontFamily: 'Arial', color: '#2ecc71'
        });
        this.peopleFedText = this.add.text(280, 45, '', {
            fontSize: '18px', fontFamily: 'Arial', color: '#e74c3c'
        });

        this.updateStatsBar();
    }

    updateStatsBar() {
        this.fundingText.setText(`💰 $${(this.gameState.funding / 1000000).toFixed(0)}M`);
        this.trustText.setText(`👥 Trust: ${this.gameState.communityTrust.toFixed(0)}%`);
        this.politicsText.setText(`🏛️ Politics: ${this.gameState.politicalCapital.toFixed(0)}`);
        this.evidenceText.setText(`📊 Evidence: ${this.gameState.evidencePoints.toFixed(0)}`);
        this.peopleFedText.setText(`🌾 Fed: ${(this.gameState.peopleFed / 1000000).toFixed(1)}M`);
    }

    createWorldMap() {
        this.add.rectangle(512, 420, 860, 620, 0x2d4a6e, 0.4);
        this.regionSprites = {};

        Object.keys(this.gameState.regions).forEach(regionId => {
            const region = this.gameState.regions[regionId];

            const circle = this.add.circle(region.x, region.y, 40, this.getHungerColor(region.hungerLevel));
            circle.setInteractive({ useHandCursor: true });
            circle.setStrokeStyle(3, 0xffffff);

            this.add.text(region.x, region.y + 58, region.name, {
                fontSize: '13px', fontFamily: 'Arial', color: '#ffffff', align: 'center'
            }).setOrigin(0.5);

            const hungerText = this.add.text(region.x, region.y, `${region.hungerLevel.toFixed(0)}%`, {
                fontSize: '16px', fontFamily: 'Arial', color: '#ffffff', fontStyle: 'bold'
            }).setOrigin(0.5);

            this.regionSprites[regionId] = { circle, hungerText };

            circle.on('pointerdown', () => this.selectRegion(regionId));
            circle.on('pointerover', () => circle.setStrokeStyle(5, 0xf39c12));
            circle.on('pointerout', () => {
                if (this.selectedRegion !== regionId) circle.setStrokeStyle(3, 0xffffff);
            });
        });
    }

    getHungerColor(hungerLevel) {
        if (hungerLevel > 35) return 0xe74c3c;
        if (hungerLevel > 20) return 0xe67e22;
        if (hungerLevel > 10) return 0xf39c12;
        if (hungerLevel > 5)  return 0x2ecc71;
        return 0x27ae60;
    }

    selectRegion(regionId) {
        this.selectedRegion = regionId;
        Object.keys(this.regionSprites).forEach(id => {
            const stroke = id === regionId ? [5, 0xf39c12] : [3, 0xffffff];
            this.regionSprites[id].circle.setStrokeStyle(...stroke);
        });
        this.showRegionPanel(regionId);
    }

    showRegionPanel(regionId) {
        if (this.regionPanel) this.regionPanel.destroy();

        const region = this.gameState.regions[regionId];
        this.regionPanel = this.add.container(870, 420);

        const bg = this.add.rectangle(0, 0, 260, 560, 0x2c3e50);
        bg.setStrokeStyle(2, 0x3498db);
        this.regionPanel.add(bg);

        const title = this.add.text(0, -255, region.name, {
            fontSize: '20px', fontFamily: 'Arial', color: '#ffffff', fontStyle: 'bold',
            wordWrap: { width: 240 }, align: 'center'
        }).setOrigin(0.5);
        this.regionPanel.add(title);

        const stats = [
            `Pop: ${(region.population / 1000000).toFixed(0)}M`,
            `Hunger: ${region.hungerLevel.toFixed(1)}%`,
            `Climate: ${region.climate}`,
            `Active programs: ${region.interventionsActive.length}`
        ];

        stats.forEach((stat, i) => {
            const t = this.add.text(0, -205 + i * 28, stat, {
                fontSize: '15px', fontFamily: 'Arial', color: '#ecf0f1'
            }).setOrigin(0.5);
            this.regionPanel.add(t);
        });

        const deployTitle = this.add.text(0, -85, '— Deploy —', {
            fontSize: '16px', fontFamily: 'Arial', color: '#f39c12'
        }).setOrigin(0.5);
        this.regionPanel.add(deployTitle);

        let btnY = -55;
        Object.keys(GAME_CONFIG.interventions).forEach(key => {
            const cfg = GAME_CONFIG.interventions[key];
            const locked = !this.gameState.interventionsUnlocked[key];
            const active = region.interventionsActive.includes(key);
            const color = active ? 0x27ae60 : locked ? 0x555555 : 0x2980b9;

            const btn = this.add.rectangle(0, btnY, 240, 38, color);
            btn.setInteractive({ useHandCursor: !locked && !active });
            this.regionPanel.add(btn);

            const label = active ? `✓ ${cfg.name}` : locked ? `🔒 ${cfg.name}` : cfg.name;
            const cost = `$${(cfg.cost / 1000000).toFixed(0)}M`;
            const t = this.add.text(0, btnY, `${label}\n${cost}`, {
                fontSize: '13px', fontFamily: 'Arial', color: '#ffffff', align: 'center'
            }).setOrigin(0.5);
            this.regionPanel.add(t);

            if (!locked && !active) {
                btn.on('pointerover', () => btn.setFillStyle(0x3498db));
                btn.on('pointerout', () => btn.setFillStyle(0x2980b9));
                btn.on('pointerdown', () => this.deployIntervention(regionId, key));
            }

            btnY += 48;
        });
    }

    deployIntervention(regionId, interventionKey) {
        const cfg = GAME_CONFIG.interventions[interventionKey];
        const region = this.gameState.regions[regionId];

        if (this.gameState.funding < cfg.cost) {
            this.showMessage('Not enough funding!', 0xe74c3c);
            return;
        }

        this.gameState.funding -= cfg.cost;
        this.gameState.communityTrust += cfg.trustCost;
        this.gameState.politicalCapital += cfg.politicsCost;
        this.gameState.evidencePoints += cfg.evidenceCost;
        region.interventionsActive.push(interventionKey);

        this.checkUnlocks();
        this.showMessage(`${cfg.name} deployed in ${region.name}!`, 0x27ae60);
        this.showRegionPanel(regionId);
        this.updateStatsBar();
    }

    checkUnlocks() {
        const ep = this.gameState.evidencePoints;
        if (ep >= 30) this.gameState.interventionsUnlocked.irrigation = true;
        if (ep >= 50) this.gameState.interventionsUnlocked.aiCropDetection = true;
        if (ep >= 20) this.gameState.interventionsUnlocked.schoolFeeding = true;
    }

    showMessage(text, color) {
        const msg = this.add.text(512, 110, text, {
            fontSize: '22px', fontFamily: 'Arial', color: '#ffffff',
            backgroundColor: `#${color.toString(16).padStart(6, '0')}`,
            padding: { x: 16, y: 8 }
        }).setOrigin(0.5).setDepth(500);

        this.time.delayedCall(2500, () => msg.destroy());
    }

    createInterventionPanel() {
        const legend = [
            { label: '>35%', color: 0xe74c3c },
            { label: '20-35%', color: 0xe67e22 },
            { label: '10-20%', color: 0xf39c12 },
            { label: '5-10%', color: 0x2ecc71 },
            { label: '<5%', color: 0x27ae60 }
        ];

        const cx = 80, startY = 300;
        this.add.text(cx, startY - 30, 'Hunger\nLegend', {
            fontSize: '14px', fontFamily: 'Arial', color: '#ffffff', align: 'center'
        }).setOrigin(0.5);

        legend.forEach((entry, i) => {
            this.add.circle(cx - 30, startY + i * 28, 10, entry.color);
            this.add.text(cx - 15, startY + i * 28, entry.label, {
                fontSize: '13px', fontFamily: 'Arial', color: '#ffffff'
            }).setOrigin(0, 0.5);
        });
    }

    createTimerDisplay() {
        this.timerText = this.add.text(170, 730, '', {
            fontSize: '20px', fontFamily: 'Arial', color: '#ffffff', fontStyle: 'bold'
        }).setOrigin(0.5);
        this.updateTimerDisplay();
    }

    updateTimerDisplay() {
        const monthNames = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
        const month = monthNames[this.gameState.monthsElapsed % 12];
        this.timerText.setText(`📅 ${month} ${this.gameState.currentYear}`);
    }

    startGameClock() {
        this.gameTimer = this.time.addEvent({
            delay: GAME_CONFIG.monthDuration,
            callback: this.monthTick,
            callbackScope: this,
            loop: true
        });
    }

    monthTick() {
        if (this.isPaused) return;

        this.gameState.monthsElapsed++;
        if (this.gameState.monthsElapsed % 12 === 0) {
            this.gameState.currentYear++;
        }

        this.applyInterventionEffects();
        this.updateRegionVisuals();
        this.updateAllDisplays();
        this.checkGameState();
    }

    applyInterventionEffects() {
        Object.keys(this.gameState.regions).forEach(regionId => {
            const region = this.gameState.regions[regionId];
            region.interventionsActive.forEach(key => {
                const cfg = GAME_CONFIG.interventions[key];
                region.hungerLevel = Math.max(0, region.hungerLevel - cfg.hungerReduction * 0.1);
                this.gameState.peopleFed += cfg.peopleFedPerMonth;
                this.gameState.evidencePoints += 0.5;
            });
        });
    }

    updateRegionVisuals() {
        Object.keys(this.gameState.regions).forEach(regionId => {
            const region = this.gameState.regions[regionId];
            const sprite = this.regionSprites[regionId];
            sprite.circle.setFillStyle(this.getHungerColor(region.hungerLevel));
            sprite.hungerText.setText(`${region.hungerLevel.toFixed(0)}%`);
        });

        if (this.selectedRegion) this.showRegionPanel(this.selectedRegion);
    }

    updateAllDisplays() {
        this.updateStatsBar();
        this.updateTimerDisplay();
        this.checkUnlocks();
    }

    checkGameState() {
        const avgHunger = this.calculateAvgHunger();

        if (avgHunger < GAME_CONFIG.winHungerThreshold) {
            this.gameWin('complete');
        } else if (this.gameState.currentYear >= GAME_CONFIG.targetYear) {
            avgHunger < GAME_CONFIG.partialWinHungerThreshold
                ? this.gameWin('partial')
                : this.gameLose('timeout');
        }
    }

    gameWin(type) {
        this.isPaused = true;
        this.gameTimer.remove();
        this.submitScore();
        this.scene.start('VictoryScene', { gameState: this.gameState, type });
    }

    gameLose(reason) {
        this.isPaused = true;
        this.gameTimer.remove();
        this.scene.start('GameOverScene', { gameState: this.gameState, reason });
    }

    submitScore() {
        const scoreData = {
            player: this.gameState.playerName,
            peopleFed: Math.floor(this.gameState.peopleFed),
            yearsElapsed: this.gameState.currentYear - GAME_CONFIG.startingYear,
            finalHungerLevel: this.calculateAvgHunger(),
            interventionsDeployed: this.countTotalInterventions()
        };
        window.submitScore(scoreData);
    }

    calculateAvgHunger() {
        const regions = Object.values(this.gameState.regions);
        return regions.reduce((sum, r) => sum + r.hungerLevel, 0) / regions.length;
    }

    countTotalInterventions() {
        return Object.values(this.gameState.regions)
            .reduce((sum, r) => sum + r.interventionsActive.length, 0);
    }

    showTutorial() {
        this.isPaused = true;
        const tutorial = this.add.container(512, 384);
        tutorial.setDepth(1000);

        tutorial.add(this.add.rectangle(0, 0, 1024, 768, 0x000000, 0.85));

        const panel = this.add.rectangle(0, 0, 800, 580, 0x2c3e50);
        panel.setStrokeStyle(3, 0x3498db);
        tutorial.add(panel);

        tutorial.add(this.add.text(0, -260, 'How to Play', {
            fontSize: '40px', fontFamily: 'Arial', color: '#ffffff', fontStyle: 'bold'
        }).setOrigin(0.5));

        const instructions = [
            '1. Click on regions (colored circles) to view details',
            '2. Deploy interventions from the region panel',
            '3. Manage resources: funding, trust, politics, evidence',
            '4. Unlock better interventions by gaining evidence points',
            '5. Successful programs reduce hunger each month',
            '6. Goal: Reduce hunger below 5% in all regions by 2030'
        ];

        instructions.forEach((text, i) => {
            tutorial.add(this.add.text(0, -175 + i * 48, text, {
                fontSize: '18px', fontFamily: 'Arial', color: '#ecf0f1',
                align: 'center', wordWrap: { width: 700 }
            }).setOrigin(0.5));
        });

        const startBtn = this.add.rectangle(0, 220, 200, 60, 0x27ae60);
        startBtn.setInteractive({ useHandCursor: true });
        tutorial.add(startBtn);
        tutorial.add(this.add.text(0, 220, 'GOT IT!', {
            fontSize: '24px', fontFamily: 'Arial', color: '#ffffff', fontStyle: 'bold'
        }).setOrigin(0.5));

        startBtn.on('pointerdown', () => {
            tutorial.destroy();
            this.isPaused = false;
        });
    }
}

class VictoryScene extends Phaser.Scene {
    constructor() {
        super({ key: 'VictoryScene' });
    }

    init(data) {
        this.gameState = data.gameState;
        this.victoryType = data.type;
    }

    create() {
        const cx = this.cameras.main.centerX;

        this.add.rectangle(cx, 384, 1024, 768, 0x27ae60);

        this.add.text(cx, 100, '🎉 VICTORY! 🎉', {
            fontSize: '72px', fontFamily: 'Arial', color: '#ffffff', fontStyle: 'bold'
        }).setOrigin(0.5);

        const message = this.victoryType === 'complete'
            ? 'You ended global hunger before 2030!'
            : 'You made significant progress on global hunger!';

        this.add.text(cx, 200, message, {
            fontSize: '30px', fontFamily: 'Arial', color: '#ffffff'
        }).setOrigin(0.5);

        const avgHunger = Object.values(this.gameState.regions)
            .reduce((s, r) => s + r.hungerLevel, 0) / Object.keys(this.gameState.regions).length;

        const totalInterventions = Object.values(this.gameState.regions)
            .reduce((s, r) => s + r.interventionsActive.length, 0);

        const stats = [
            `Player: ${this.gameState.playerName}`,
            `People Fed: ${(this.gameState.peopleFed / 1000000).toFixed(1)} million`,
            `Years Taken: ${this.gameState.currentYear - GAME_CONFIG.startingYear}`,
            `Final Average Hunger: ${avgHunger.toFixed(1)}%`,
            `Interventions Deployed: ${totalInterventions}`
        ];

        stats.forEach((stat, i) => {
            this.add.text(cx, 300 + i * 45, stat, {
                fontSize: '24px', fontFamily: 'Arial', color: '#ffffff'
            }).setOrigin(0.5);
        });

        const btn = this.add.rectangle(cx, 660, 250, 70, 0x2c3e50);
        btn.setInteractive({ useHandCursor: true });
        btn.on('pointerdown', () => this.scene.start('StartScene'));

        this.add.text(cx, 660, 'PLAY AGAIN', {
            fontSize: '28px', fontFamily: 'Arial', color: '#ffffff', fontStyle: 'bold'
        }).setOrigin(0.5);
    }
}

class GameOverScene extends Phaser.Scene {
    constructor() {
        super({ key: 'GameOverScene' });
    }

    init(data) {
        this.gameState = data.gameState;
        this.reason = data.reason;
    }

    create() {
        const cx = this.cameras.main.centerX;

        this.add.rectangle(cx, 384, 1024, 768, 0xe74c3c);

        this.add.text(cx, 150, 'GAME OVER', {
            fontSize: '72px', fontFamily: 'Arial', color: '#ffffff', fontStyle: 'bold'
        }).setOrigin(0.5);

        const reasons = {
            bankrupt: 'You ran out of funding!',
            trust: 'You lost community trust!',
            timeout: 'Time ran out — hunger remains too high'
        };

        this.add.text(cx, 260, reasons[this.reason] || 'The mission failed.', {
            fontSize: '30px', fontFamily: 'Arial', color: '#ffffff'
        }).setOrigin(0.5);

        this.add.text(cx, 340, `People Fed: ${(this.gameState.peopleFed / 1000000).toFixed(1)}M`, {
            fontSize: '24px', fontFamily: 'Arial', color: '#ffffff'
        }).setOrigin(0.5);

        const btn = this.add.rectangle(cx, 600, 250, 70, 0x2c3e50);
        btn.setInteractive({ useHandCursor: true });
        btn.on('pointerdown', () => this.scene.start('StartScene'));

        this.add.text(cx, 600, 'TRY AGAIN', {
            fontSize: '28px', fontFamily: 'Arial', color: '#ffffff', fontStyle: 'bold'
        }).setOrigin(0.5);
    }
}
