const config = {
    type: Phaser.AUTO,
    width: 320,
    height: 480,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 800 }, // ✅ تعديل الجاذبية لتقليل السقوط السريع
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

function preload() {
    this.load.image('background', 'assets/background.png');
    this.load.image('bird', 'assets/bird.png');
    this.load.image('pipe', 'assets/pipe.png');
}

function create() {
    this.add.image(160, 240, 'background'); // ✅ تصحيح موضع الخلفية

    player = this.physics.add.sprite(100, 200, 'bird'); // ✅ وضع البداية الصحيح
    player.setCollideWorldBounds(true);

    pipes = this.physics.add.group();

    cursors = this.input.keyboard.createCursorKeys();

    // ✅ تأخير التصادم حتى لا تنتهي اللعبة فورًا
    this.time.delayedCall(1000, () => {
        this.physics.add.collider(player, pipes, gameOver, null, this);
    });

    // ✅ تعديل تأخير ظهور الأنابيب
    this.time.addEvent({
        delay: 2000, // ⏳ زيادة الوقت بين كل أنبوب
        callback: addPipeRow,
        callbackScope: this,
        loop: true
    });

    scoreText = this.add.text(20, 20, 'Score: 0', { fontSize: '20px', fill: '#fff' });
}

function update() {
    if (cursors.space.isDown || this.input.activePointer.isDown) {
        player.setVelocityY(-250); // ✅ ضبط القفزة
    }
}

function addPipeRow() {
    let pipeTop = pipes.create(320, Phaser.Math.Between(50, 250), 'pipe').setOrigin(0, 1);
    let pipeBottom = pipes.create(320, pipeTop.y + 150, 'pipe').setOrigin(0, 0);

    pipes.setVelocityX(-200);

    pipeTop.body.immovable = true;
    pipeBottom.body.immovable = true;
    pipeTop.body.allowGravity = false;
    pipeBottom.body.allowGravity = false;

    pipeTop.checkWorldBounds = true;
    pipeBottom.checkWorldBounds = true;
    pipeTop.outOfBoundsKill = true;
    pipeBottom.outOfBoundsKill = true;

    score += 1;
    scoreText.setText('Score: ' + score);
}

function gameOver() {
    if (player.active) { // ✅ منع تكرار إنهاء اللعبة
        this.physics.pause();
        player.setTint(0xff0000);
        this.add.text(100, 200, 'Game Over', { fontSize: '20px', fill: '#fff' });

        // ✅ إعادة تشغيل اللعبة بعد ثانيتين
        this.time.delayedCall(2000, () => {
            this.scene.restart();
        });

        player.active = false;
    }
}
