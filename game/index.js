// import 'pixi';
// import 'p2';
import Phaser from 'phaser';
import vader from './assets/darth_vader.png';
import empire from './assets/empire.png';
import blue from './assets/blueline.png';
import darkblue from './assets/darkblueline.png';

let cursor, right, player, lanes = [], i = 0;

function preload() {
    this.load.image('vader', empire);
    this.load.image('blue', blue);
    this.load.image('darkblue', darkblue);
}

function create() {
    var map = this.make.tilemap({ key: 'map' });
    console.log(this);
    debugger;
    var lanesGroup = map.add.staticGroup('media/lane.png', 'blue');

    lanes[0] = lanesGroup.create(500, 557, 'blue');
    lanes[1] = lanesGroup.create(500, 569, 'darkblue');
    lanes[2] = lanesGroup.create(500, 581, 'blue');
    lanes[3] = lanesGroup.create(500, 593, 'darkblue');

    this.physics.world.gravity.y = 200;
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
  if(cursor.up._justUp && player.body.wasTouching.none && player.body.touching.down) {
    player.setVelocityX(+1);
  }

  if(cursor.down._justUp && player.body.wasTouching.none && player.body.touching.down) {
    player.setVelocityX(-1);
  }


  if (cursor.right.isDown) {
    player.x += 2;
  } else if (cursor.left.isDown) {
    player.x -= 2;
  } else if (cursor.down.isDown && player.body.touching.down && i < 4) {
    player.setVelocityX(+20);
    player.setVelocityY(-120);
    if (i >= 0 && i < 3) {
      lanes[i].body.checkCollision.up = false;
      i++;
    }
  } else if (cursor.up.isDown && player.body.touching.down && i >= 0) {
    player.setVelocityX(-20);
    player.setVelocityY(-120);
    lanes[i - 1].body.checkCollision.up = true;
    if (i > 0 && i < 4) {
      lanes[i].body.checkCollision.up = true;
      i--;
    }
  }
}

const config = {
    type: Phaser.WEBGL,
    width: 800,
    height: 600,
    parent: 'phaser-example',
    backgroundColor: '#fff',
    pixelArt: true,
    physics: {
      default: 'impact',
      arcade: {
        // debug: true,
        gravity: { y: 60 }
      }
    },
    scene: {
        preload: preload,
        create: create,
        update: update,
    }
};

const game = new Phaser.Game(config);
