// import 'pixi';
// import 'p2';
import Phaser from 'phaser';
import vader from './assets/darth_vader.png';
import empire from './assets/empire.png';
import blue from './assets/blueline.png';
import darkblue from './assets/darkblueline.png';

let cursor, right, player, lane1;

function preload() {
    this.load.image('vader', empire);
    this.load.image('blue', blue);
    this.load.image('darkblue', darkblue);
}

function create() {
    var lanes = this.physics.add.staticGroup();

    // lanes.create(400, 568, 'darkblue').setScale(2).refreshBody();
    lane1 = lanes.create(500, 580, 'blue');
    var lane2 = lanes.create(500, 600, 'blue');
    // lanes.create(50, 250, 'darkblue');

    this.physics.world.gravity.y = 250;
    player = this.physics.add.sprite(100, 350, 'vader');
    cursor = this.input.keyboard.createCursorKeys();

    player.setBounce(0.2);
    player.setCollideWorldBounds(true);

    this.physics.add.collider(player, lanes);
}

function update() {
  move();
}

function move() {
  if (cursor.right.isDown) {
    player.x += 2;
  } else if (cursor.left.isDown) {
    player.x -= 2;
  } else if (cursor.down.isDown && player.body.touching.down) {
    player.y += 2;
    lane1.body.checkCollision.up = false;
    player.setVelocityX(+50);
    player.setVelocityY(-100);
  } else if (cursor.up.isDown && player.body.touching.down) {
    lane1.body.checkCollision.up = true;
    player.setVelocityX(-50);
    player.setVelocityY(-100);
  }

  if (!player.body.touching.down) {
    player.setVelocityX(0);
  }
}

const config = {
    type: Phaser.AUTO,
    parent: 'phaser-example',
    physics: {
      default: 'arcade',
      arcade: {
        debug: true,
        gravity: { y: 60 }
      }
    },
    width: 800,
    height: 600,
    scene: {
        preload: preload,
        create: create,
        update: update,
    }
};

const game = new Phaser.Game(config);
