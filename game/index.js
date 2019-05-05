// import 'pixi';
// import 'p2';
import Phaser     from 'phaser';
import empire     from './assets/empire.png';
import tileimages from './assets/tileimages.png';
import tilemap    from './tilemap.json';

let controls, topCollision, bottomCollision, collisionTop, collisionBottom, ocean, cursor, right, player, lanes = [], i = 0;

let loggedUpdate = false, loggedMove = false;

function preload() {
  this.load.image('vader', empire);
  this.load.image('tileimages', tileimages);
  this.load.tilemapTiledJSON('map', tilemap);
}

function create() {
  const map = this.make.tilemap({ key: 'map' });
  const tileset = map.addTilesetImage('tileimages', 'tileimages');

  // Parameters: layer name (or index) from Tiled, tileset, x, y
  collisionTop = map.createStaticLayer('collisionTop', tileset, 0, 0);
  collisionBottom = map.createStaticLayer('collisionBottom', tileset, 0, 0);
  ocean = map.createStaticLayer('ocean', tileset, 0, 0);

  collisionTop.setCollisionByProperty({ collides: true });
  collisionBottom.setCollisionByProperty({ collides: true });
  // ocean.setCollisionByProperty({ collides: true });

  // console.log(collisionBottom);

  // console.log('ocean: ', ocean);
  // console.log('collisionTop: ', collisionTop);
  // console.log('collisionBottom: ', collisionBottom);

  // Phaser supports multiple cameras, but you can access the default camera like this:
  const camera = this.cameras.main;

  // Set up the arrows to control the camera
  cursor = this.input.keyboard.createCursorKeys();
  controls = new Phaser.Cameras.Controls.FixedKeyControl({
    camera: camera,
    left: cursor.left,
    right: cursor.right,
    up: cursor.up,
    down: cursor.down,
    speed: 0.5
  });

  // Constrain the camera so that it isn't allowed to move outside the width/height of tilemap
  camera.setBounds(0, 0, map.widthInPixels, map.heightInPixels);

  // this.physics.world.gravity.y = 200;
  player = this.physics.add.sprite(100, 0, 'vader').setSize(30, 40);
  // cursor = this.input.keyboard.createCursorKeys();
  //
  // player.setBounce(0.2);
  player.setCollideWorldBounds(true);
  // this.physics.add.collider(player, collisionTop);
  topCollision = this.physics.add.collider(player, collisionTop);
  bottomCollision = this.physics.add.collider(player, collisionBottom);
  //
  // this.physics.add.collider(player, lanes);

  this.input.keyboard.once("keydown_M", () => {
    this.physics.world.removeCollider(topCollision);
  });
}

function update() {
  move(this);
}

function move(parent) {
  if (
    cursor.up._justUp
    && player.body.wasTouching.none
    && player.body.blocked.down
  ) {
    player.setVelocityX(+1);
  }

  if (
    cursor.down._justUp
    && player.body.wasTouching.none
    && player.body.blocked.down
  ) {
    player.setVelocityX(-1);
  }


  if (cursor.right.isDown) {
    player.x += 2;
  } else if (cursor.left.isDown) {
    player.x -= 2;
  } else if (cursor.down.isDown && player.body.blocked.down) {
    player.setVelocityX(+20);
    player.setVelocityY(-120);
    parent.physics.world.removeCollider(topCollision);
    // if (i >= 0 && i < 3) {
    //   lanes[i].body.checkCollision.up = false;
    //   i++;
    // }
  } else if (cursor.up.isDown && player.body.blocked.down) {
    player.setVelocityX(-20);
    player.setVelocityY(-120);
    topCollision = parent.physics.add.collider(player, collisionTop);
    // lanes[i - 1].body.checkCollision.up = true;
    // if (i > 0 && i < 4) {
    //   lanes[i].body.checkCollision.up = true;
    //   i--;
    // }
  }
}

const config = {
    type: Phaser.WEBGL,
    parent: 'phaser-example',
    backgroundColor: '#fff',
    pixelArt: true,
    physics: {
      default: 'arcade',
      arcade: {
        // debug: true,
        gravity: { y: 100 }
      }
    },
    width: 720,
    height: 360,
    pixelArt: true,
    scene: {
        preload: preload,
        create: create,
        update: update,
    }
};

const game = new Phaser.Game(config);
