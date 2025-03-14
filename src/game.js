const config = {
    type: Phaser.AUTO,
    width: 320,
    height: 480,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 600 },
            debug: false
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

const game = new Phaser.Game(config);

let player;
let cursors;
let pipes;
let score = 0;
let scoreText;
let hasCollided = false;

function preload() {
    this.load.image('background', 'assets/background.png');
    this.load.image('bird', 'assets/bird.png');
    this.load.image('pipe', 'assets/pipe.png');
}

function create() {
    this.add.image(160, 240, 'background');

    player = this.physics.add.sprite(100, 200, 'bird');
    player.setCollideWorldBounds(true);

    pipes = this.physics.add.group();

    cursors = this.input.keyboard.createCursorKeys();

    // ✅ نؤخر التصادم مع الأنابيب بعد 2 ثانية
    this.time.delayedCall(2000, () => {
        this.physics.add.collider(player, pipes, gameOver, null, this);
    });

    // ✅ نبدأ بإضافة الأنابيب بعد 2 ثانية برضه
    this.time.addEvent({
        delay: 2000,
        callback: addPipeRow,
        callbackScope: this,
        loop: true
    });

    scoreText = this.add.text(20, 20, 'Score: 0', { fontSize: '20px', fill: '#fff' });
}

function update() {
    if (!hasCollided && (cursors.space.isDown || this.input.activePointer.isDown)) {
        player.setVelocityY(-250);
    }
}

function addPipeRow() {
    const gap = 120;
    const pipeTopY = Phaser.Math.Between(50, 250);
    const pipeBottomY = pipeTopY + gap;

    let pipeTop = pipes.create(320, pipeTopY, 'pipe').setOrigin(0, 1);
    let pipeBottom = pipes.create(320, pipeBottomY, 'pipe').setOrigin(0, 0);

    pipeTop.body.allowGravity = false;
    pipeBottom.body.allowGravity = false;

    pipeTop.setVelocityX(-150);
    pipeBottom.setVelocityX(-150);

    pipeTop.body.immovable = true;
    pipeBottom.body.immovable = true;

    score += 1;
    scoreText.setText('Score: ' + score);
}

function gameOver() {
    if (hasCollided) return;
    hasCollided = true;

    this.physics.pause();
    player.setTint(0xff0000);
    this.add.text(100, 200, 'Game Over', { fontSize: '20px', fill: '#fff' });

    this.time.delayedCall(2000, () => {
        this.scene.restart();
        hasCollided = false;
    });
}

