const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 500 },
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
    this.add.image(400, 300, 'background');

    player = this.physics.add.sprite(100, 300, 'bird');
    player.setCollideWorldBounds(true);

    pipes = this.physics.add.group();

    cursors = this.input.keyboard.createCursorKeys();

    this.time.addEvent({
        delay: 1500,
        callback: addPipeRow,
        callbackScope: this,
        loop: true
    });

    scoreText = this.add.text(20, 20, 'Score: 0', { fontSize: '20px', fill: '#fff' });

    this.physics.add.collider(player, pipes, gameOver, null, this);
}

function update() {
    if (cursors.space.isDown) {
        player.setVelocityY(-200);
    }
}

function addPipeRow() {
    let pipeTop = pipes.create(800, Phaser.Math.Between(50, 250), 'pipe').setOrigin(0, 1);
    let pipeBottom = pipes.create(800, pipeTop.y + 150, 'pipe').setOrigin(0, 0);

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
    this.physics.pause();
    player.setTint(0xff0000);
    this.add.text(300, 250, 'Game Over', { fontSize: '40px', fill: '#fff' });
}
