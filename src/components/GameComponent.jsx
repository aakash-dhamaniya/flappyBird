import React, { useEffect } from "react";
import Phaser from "phaser";
import GamePlay from "./scene/gamplay";
function GameComponent() {
  useEffect(() => {

    const config = {
      type: Phaser.AUTO,
      width: 800,
      height: 600,
      physics: {
        default: "arcade",
        arcade: {
          gravity: { y: 0 },
          debug:true,
        },
      },
      parent: "root",
    };
    const game = new Phaser.Game(config);
    const gameplay =new GamePlay()
    game.scene.add("gamePlay",gameplay)
    game.scene.start("gamePlay")
    return () => {
      game.destroy(true);
    };
  }, []);
  return (
    <div className="root" style={{ width: "800", height: "600" }}/>
      
    
  );
}

export default GameComponent;
