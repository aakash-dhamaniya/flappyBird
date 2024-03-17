import Phaser from "phaser";
import backgroundSky from "../../assets/sky.png";
import pipe from "../../assets/pipe.png";
import bird from "../../assets/birdSprite.png";
class GamePlay extends Phaser.Scene {
  //fly bird
  fly(p) {
    this.bird.body.setVelocityY(-300);
    this.bird.play("fly");
  }
  placeVerticalPipe(uPipe, lPipe) {
    const difficulty = this.difficulties[this.currentDifficulty];
    const rightMostX = this.getRightMostPipe();
    const pipeVerticalDistance = Phaser.Math.Between(
      ...difficulty.pipeVerticalDistanceRange
    );
    const pipeVerticalPosition = Phaser.Math.Between(
      0 + 20,
      this.height - 20 - pipeVerticalDistance
    );
    const pipeHorizontalDistance = Phaser.Math.Between(
      ...difficulty.pipeHorizontalDistanceRange
    );

    uPipe.x = rightMostX + pipeHorizontalDistance;
    uPipe.y = pipeVerticalPosition;

    lPipe.x = uPipe.x;
    lPipe.y = uPipe.y + pipeVerticalDistance;
  }
  createPipe() {
    this.pipes = this.physics.add.group();
    for (let i = 0; i < this.PIPE_TO_RENDER; i++) {
      const upperPipe = this.pipes
        .create(0, 0, "pipe")
        .setImmovable(true)
        .setOrigin(0, 1);
      const lowerPipe = this.pipes
        .create(0, 0, "pipe")
        .setImmovable(true)
        .setOrigin(0, 0);
      this.placeVerticalPipe(upperPipe, lowerPipe);
    }
    this.pipes.setVelocityX(-200);
  }
  getRightMostPipe() {
    let rightMostX = 0;
    this.pipes.getChildren().forEach((pipe) => {
      rightMostX = Math.max(pipe.x, rightMostX);
    });
    return rightMostX;
  }
  recyclePipes() {
    const tempPipes = [];
    this.pipes.getChildren().forEach((pipe) => {
      if (pipe.getBounds().right <= 0) {
        tempPipes.push(pipe);
        if (tempPipes.length === 2) {
          this.placeVerticalPipe(...tempPipes);
        }
      }
    });
  }
  gameOver() {
    this.physics.pause();
  }
  createColliders() {
    this.physics.add.collider(this.bird, this.pipes, this.gameOver, null, this);
  }
  createBird() {
    this.bird = this.physics.add
      .sprite(40, 300, "bird")
      .setFlipX(true)
      .setScale(3)
      .setOrigin(0);
    this.bird.setBodySize(this.bird.width, this.bird.height - 6);
    this.bird.body.gravity.y = 600;
    this.bird.setCollideWorldBounds(true);
  }
  constructor() {
    super({ key: "gamePlay" });
    this.bird = null;
    this.totalDelta = 0;
    this.upperPipe = null;
    this.lowerPipe = null;
    this.PIPE_TO_RENDER = 4;
    this.currentDifficulty = "easy";
    this.difficulties = {
      easy: {
        pipeHorizontalDistanceRange: [300, 350],
        pipeVerticalDistanceRange: [150, 200],
      },
      normal: {
        pipeHorizontalDistanceRange: [280, 330],
        pipeVerticalDistanceRange: [140, 190],
      },
      hard: {
        pipeHorizontalDistanceRange: [250, 310],
        pipeVerticalDistanceRange: [50, 100],
      },
    };
  }
  init() {}
  preload() {
    this.load.image("sky", backgroundSky);
    this.load.image("pipe", pipe);
    this.load.spritesheet("bird", bird, {
      frameWidth: 16,
      frameHeight: 16,
    });
  }
  create() {
    this.height = this.game.config.height;
    this.width = this.game.config.width;
    this.background = this.add.image(0, 0, "sky").setOrigin(0, 0);
    this.bird = this.anims.create({
      key: "fly",
      frames: this.anims.generateFrameNumbers("bird", {
        start: 9,
        end: 15,
      }),
      frameRate: 8,
      repeatt: -1,
    });
    //pipe
    this.createPipe();
    this.createColliders();
    this.createBird();
    this.bird.play("fly");
    this.input.on("pointerdown", this.fly, this);
  }
  update(time, delta) {
    this.recyclePipes();
  }
}
export default GamePlay;
