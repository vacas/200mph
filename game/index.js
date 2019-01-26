// import 'pixi';
// import 'p2';
import Phaser from 'phaser';
import vader from './assets/darth_vader.png';
import empire from './assets/empire.png';

function preload() {
    this.load.image('vader', empire);
}

function create() {
    const vader = this.add.image(400, 150, 'vader');

    this.tweens.add({
        targets: vader,
        y: 450,
        duration: 2000,
        ease: 'Power2',
        yoyo: true,
        loop: -1
    });

}

const config = {
    type: Phaser.AUTO,
    parent: 'phaser-example',
    width: 800,
    height: 600,
    scene: {
        preload: preload,
        create: create
    }
};

const game = new Phaser.Game(config);
