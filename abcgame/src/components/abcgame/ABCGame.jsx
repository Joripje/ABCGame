import ABCam from "./ABCam";
import Phaser from "phaser";
import { Scenes } from "./Scenes";
import { useEffect, useRef } from "react";
import styled from "styled-components";

const ABCGame = (props) => {
  const game = useRef(null);

  const AB = () => {
    if (game.current) game.current.events.emit("ABC");
    // console.log(game.current.scene.keys.Scenes.enterCount);
    if (game.current.scene.keys.Scenes.enterCount === 19) {
      setTimeout(() => {
        props.setGameClear(game.current.scene.keys.Scenes.timeLimit);
      }, 1000);
    }
  };

  useEffect(() => {
    let intervalId = null;

    const checkTimeLimit = () => {
      if (game.current.scene.keys.Scenes.timeLimit === 0) {
        props.setGameover();
        clearInterval(intervalId);
      }
    };

    const config = {
      type: Phaser.AUTO,
      parent: "phaser-container",
      scale: {
        mode: Phaser.Scale.HEIGHT_CONTROLS_HEIGHT,
        width: 600,
        height: 600,
      },
      backgroundColor: "#ffffff",
      scene: [Scenes],
    };

    game.current = new Phaser.Game(config);

    intervalId = setInterval(checkTimeLimit, 300);

    return () => {
      clearInterval(intervalId);
    };
  }, []);

  return (
    <Container>
      <WebCamContainer>
        <ABCam AB={AB} />
      </WebCamContainer>
      <PhaserContainer ref={game} id="phaser-container" />
    </Container>
  );
};

const Container = styled.div`
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 100%;
  height: 100%;
`;

const WebCamContainer = styled.div`
  height: 50%;
  width: 100%;
`;

const PhaserContainer = styled.div`
  height: 50%;
`;

export default ABCGame;
