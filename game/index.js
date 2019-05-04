// import 'pixi';
// import 'p2';
import Phaser     from 'phaser';
// import vader      from './assets/darth_vader.png';
import empire     from './assets/empire.png';
// import blue       from './assets/blueline.png';
// import darkblue   from './assets/darkblueline.png';
import tileimages from './assets/tileimages.png';
import tilemap    from './tilemap.json';

let controls, cursor, right, player, lanes = [], i = 0;

function preload() {
    this.load.image('vader', empire);
    // this.load.image('blue', blue);
    // this.load.image('darkblue', darkblue);
    this.load.image('tileimages', tileimages);
    this.load.tilemapTiledJSON('map', tilemap);
    // this.load.image("tiles", "https://www.mikewesthad.com/phaser-3-tilemap-blog-posts/post-1/assets/tilesets/tuxmon-sample-32px-extruded.png");
    // this.load.tilemapTiledJSON("map", "https://www.mikewesthad.com/phaser-3-tilemap-blog-posts/post-1/assets/tilemaps/tuxemon-town.json");
}

function create() {
    const map = this.make.tilemap({ key: 'map' });
    const tileset = map.addTilesetImage('tileimages', 'tileimages');
    // debugger;

    // console.log('tileset: ', tileset);
    // const belowLayer = map.createStaticLayer("Below Player", tileset, 0, 0);
    // const worldLayer = map.createStaticLayer("World", tileset, 0, 0);
    // const aboveLayer = map.createStaticLayer("Above Player", tileset, 0, 0);

    // Parameters: layer name (or index) from Tiled, tileset, x, y
    const collisionTop = map.createStaticLayer('collisionTop', tileset, 0, 0);
    const collisionBottom = map.createStaticLayer('collisionBottom', tileset, 0, 0);
    const ocean = map.createStaticLayer('ocean', tileset, 0, 0);

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

    // var lanesGroup = this.physics.add.staticGroup();
    //
    // lanes[0] = lanesGroup.create(500, 557, 'blue');
    // lanes[1] = lanesGroup.create(500, 569, 'darkblue');
    // lanes[2] = lanesGroup.create(500, 581, 'blue');
    // lanes[3] = lanesGroup.create(500, 593, 'darkblue');

    // this.physics.world.gravity.y = 200;
    player = this.physics.add.sprite(100, 0, 'vader').setSize(30, 40);
    // cursor = this.input.keyboard.createCursorKeys();
    //
    // player.setBounce(0.2);
    // player.setCollideWorldBounds(true);
    // this.physics.add.collider(player, collisionTop);
    var topCollision = this.physics.add.collider(player, collisionTop);
    this.physics.add.collider(player, collisionBottom);
    //
    // this.physics.add.collider(player, lanes);

    this.input.keyboard.once("keydown_M", event => {
      // this.physics.world.colliders.getActive().find((i) => { console.log(i); });
      this.physics.world.removeCollider(topCollision);
    })

    this.input.keyboard.once("keydown_D", event => {
    // Turn on physics debugging to show player's hitbox
    this.physics.world.createDebugGraphic();

    // Create worldLayer collision graphic above the player, but below the help text
    const graphics = this.add
      .graphics()
      .setAlpha(0.75)
      .setDepth(20);
    ocean.renderDebug(graphics, {
      tileColor: null, // Color of non-colliding tiles
      collidingTileColor: new Phaser.Display.Color(243, 134, 48, 255), // Color of colliding tiles
      faceColor: new Phaser.Display.Color(40, 39, 37, 255) // Color of colliding face edges
    });
  });
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
    parent: 'phaser-example',
    backgroundColor: '#fff',
    pixelArt: true,
    physics: {
      default: 'arcade',
      arcade: {
        // debug: true,
        gravity: { y: 60 }
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
