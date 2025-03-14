const config = {
    type: Phaser.AUTO,
    width: 320,
    height: 480,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 600 }, // ✅ تقليل الجاذبية
            debug: true          // ✅ تفعيل الـ Debug Mode
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

function preload() {
    this.load.image('background', 'assets/background.png');
    this.load.image('bird', 'assets/bird.png');
    this.load.image('pipe', 'assets/pipe.png');
}

function create() {
    this.add.image(160, 240, 'background');

    player = this.physics.add.sprite(100, 200, 'bird'); // ✅ مكان بداية مناسب
    player.setCollideWorldBounds(true);

    pipes = this.physics.add.group();

    cursors = this.input.keyboard.createCursorKeys();

    // ✅ تأخير تفعيل التصادم حتى لا يخسر فوراً
    this.time.delayedCall(2000, () => {
        this.physics.add.collider(player, pipes, gameOver, null, this);
    });

    // ✅ تأخير ظهور الأنابيب
    this.time.addEvent({
        delay: 2000,
        callback: addPipeRow,
        callbackScope: this,
        loop: true
    });

    scoreText = this.add.text(20, 20, 'Score: 0', { fontSize: '20px', fill: '#fff' });
}

function update() {
    if (cursors.space.isDown || this.input.activePointer.isDown) {
        player.setVelocityY(-250); // ✅ ضبط قوة القفز
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

    pipeTop.setVelocityX(-150);     // ✅ تقليل السرعة
    pipeBottom.setVelocityX(-150);

    pipeTop.body.immovable = true;
    pipeBottom.body.immovable = true;

    score += 1;
    scoreText.setText('Score: ' + score);
}

function gameOver() {
    if (!player.active) return; // ✅ منع التكرار

    this.physics.pause();
    player.setTint(0xff0000);

    this.add.text(100, 200, 'Game Over', { fontSize: '20px', fill: '#fff' });

    this.time.delayedCall(2000, () => {
        this.scene.restart();
    });

    player.active = false;
}
