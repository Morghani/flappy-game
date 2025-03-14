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
        preload,
        create,
        update
    }
};

const game = new Phaser.Game(config);

let bird;
let pipes;
let cursors;
let score = 0;
let scoreText;
let isGameOver = false;

function preload() {
    this.load.image('background', 'assets/background.png');
    this.load.image('bird', 'assets/bird.png');
    this.load.image('pipe', 'assets/pipe.png');
}

function create() {
    this.add.image(160, 240, 'background');
    bird = this.physics.add.sprite(50, 240, 'bird');
    bird.setCollideWorldBounds(true);

    pipes = this.physics.add.group();
    this.time.addEvent({
        delay: 1500,
        callback: addPipes,
        callbackScope: this,
        loop: true
    });

    this.physics.add.collider(bird, pipes, hitPipe, null, this);

    cursors = this.input.keyboard.createCursorKeys();
    this.input.on('pointerdown', flap, this);

    scoreText = this.add.text(10, 10, 'Score: 0', { fontSize: '20px', fill: '#fff' });
}

function update() {
    if (isGameOver) return;
    if (cursors.space.isDown) flap();
}

function flap() {
    bird.setVelocityY(-250);
}

function addPipes() {
    const gap = 120;
    const top = Phaser.Math.Between(50, 250);
    const bottom = top + gap;

    const pipeTop = pipes.create(320, top, 'pipe').setOrigin(0, 1);
    const pipeBottom = pipes.create(320, bottom, 'pipe').setOrigin(0, 0);

    pipeTop.body.allowGravity = false;
    pipeBottom.body.allowGravity = false;

    pipeTop.setVelocityX(-200);
    pipeBottom.setVelocityX(-200);

    pipeTop.body.immovable = true;
    pipeBottom.body.immovable = true;

    score += 1;
    scoreText.setText('Score: ' + score);
}

function hitPipe() {
    if (isGameOver) return;
    isGameOver = true;
    this.physics.pause();
    bird.setTint(0xff0000);
    this.add.text(80, 220, 'Game Over', { fontSize: '24px', fill: '#fff' });
}
