import { Group } from "./core/group.js";
import { ScoreManager } from "./core/scoreManager.js";
import { Timer } from "./core/timer.js";
import { Cookie } from "./gameObjects/cookie.js";
import { Bomb } from "./gameObjects/bomb.js";
import { Explosion } from "./effects/explosion.js";
import { DynamicScoreText } from "./gameObjects/dynamicText.js";
import { Randomizer } from "./helpers/randomizer.js";

const app = new PIXI.Application({
  view: document.querySelector("canvas#main-gbc"),
  background: 0x1099bb,
  resolution: window.devicePixelRatio || 1,
  autoDensity: true,
  resizeTo: window,
});

async function init() {
  const manifest = {
    bundles: [
      {
        name: "game-screen",
        assets: [
          {
            name: "crunchSound",
            srcs: "audio/crunch.wav",
          },
          {
            name: "bombExplosionSound",
            srcs: "audio/bomb_explosion.wav",
          },
          {
            name: "scoreSound",
            srcs: "audio/score_up.mp3",
          },
          {
            name: "cookie1",
            srcs: "assets/gameObjects/cookie/cookie_1.png",
          },
          {
            name: "cookie2",
            srcs: "assets/gameObjects/cookie/cookie_2.png",
          },
          {
            name: "cookie3",
            srcs: "assets/gameObjects/cookie/cookie_3.png",
          },
          {
            name: "cookie4",
            srcs: "assets/gameObjects/cookie/cookie_4.png",
          },
          {
            name: "cookie5",
            srcs: "assets/gameObjects/cookie/cookie_5.png",
          },
          {
            name: "bomb",
            srcs: "assets/gameObjects/bomb/bomb.png",
          },
          {
            name: "explosion1",
            srcs: "assets/effects/explosion/expl_1.png",
          },
          {
            name: "explosion2",
            srcs: "assets/effects/explosion/expl_2.png",
          },
          {
            name: "explosion3",
            srcs: "assets/effects/explosion/expl_3.png",
          },
          {
            name: "explosion4",
            srcs: "assets/effects/explosion/expl_4.png",
          },
          {
            name: "explosion5",
            srcs: "assets/effects/explosion/expl_5.png",
          },
          {
            name: "gameOverTableBg",
            srcs: "assets/controls/gameOver/background.svg",
          },
          {
            name: "gameOverTableReplayBtn",
            srcs: "assets/controls/gameOver/replay_btn.svg",
          },
        ],
      },
    ],
  };

  await PIXI.Assets.init({ manifest: manifest });
  PIXI.Assets.backgroundLoadBundle(["game-screen"]);

  makeGameScreen();
}

async function makeGameScreen() {
  const gameScreenAssets = await PIXI.Assets.loadBundle("game-screen");

  const cookiesLayout = new PIXI.Container();
  const bombsLayout = new PIXI.Container();
  const playerControlsLayout = new PIXI.Container();
  const gameOverLayout = new PIXI.Container();
  const gameControlsLayout = new PIXI.Container();
  app.stage.addChild(cookiesLayout);
  app.stage.addChild(bombsLayout);
  app.stage.addChild(playerControlsLayout);
  app.stage.addChild(gameOverLayout);
  app.stage.addChild(gameControlsLayout);

  gameOverLayout.x = app.screen.width / 2;
  gameOverLayout.y = app.screen.height / 2;
  gameOverLayout.pivot.x = gameOverLayout.width / 2;
  gameOverLayout.pivot.y = gameOverLayout.height / 2;

  // const TABLET_MIN_WIDTH = 768;
  // const TABLET_MAX_WIDTH = 1024;
  const MOBILE_MAX_WIDTH_PORTRAIT = 640;
  // const MOBILE_MAX_WIDTH_LANDSCAPE = 800;
  const stageOptions = { scale: 1.0 };

  const scoreManager = new ScoreManager();
  const cookies = new Group();
  const bombs = new Group();
  const tempTexts = new Group();

  const cookieSpawnTimer = new Timer({
    maxValue: 0.75,
  });

  const scoreTextOptions = new PIXI.TextStyle({
    fontFamily: "Arial",
    fontSize: 36,
    fontWeight: "bold",
    fill: "#fcc183",
    stroke: "#7c411e",
    strokeThickness: 4,
    lineJoin: "round",
    align: "right",
  });
  const scoreText = new PIXI.Text(scoreManager.score, scoreTextOptions);
  scoreText.scale.set(stageOptions.scale);
  scoreText.anchor.set(1, 0);
  scoreText.x = app.screen.width * 0.975;
  scoreText.y = app.screen.height * 0.075;
  gameControlsLayout.addChild(scoreText);

  const updateGameObjectsScale = (objs, scaleValue) => {
    for (const obj of objs) {
      updateGameObjectScale(obj, scaleValue);
    }
  };

  const updateGameObjectScale = (obj, scaleValue) => {
    obj.scale.set(scaleValue);
  };

  const updateStageOptions = (opts) => {
    stageOptions.scale = opts.scale;
  };

  const updateBreakpoints = () => {
    if (app.screen.width < MOBILE_MAX_WIDTH_PORTRAIT) {
      updateStageOptions({ scale: 0.75 });
    } else {
      updateStageOptions({ scale: 1.0 });
    }

    updateGameObjectsScale(
      [gameOverLayout, scoreText],
      stageOptions.scale
    );
  };

  const updateGameObjectPosition = (obj, pos) => {
    obj.position.set(pos.x, pos.y);
  };

  const removeGameOverTable = () => {
    gameOverLayout.removeChildren();
  };

  const createGameOverTable = (opts = {}) => {
    const table = new PIXI.Sprite(gameScreenAssets.gameOverTableBg);
    table.scale.set(stageOptions.scale);
    table.anchor.set(0.5);
    gameOverLayout.addChild(table);

    const tableLabelText = new PIXI.Text("Ваш лучший счёт:".toUpperCase(), {
      fontFamily: "Arial",
      fontSize: 16,
      fontWeight: "bold",
      fill: "#7c411e",
      align: "center",
    });
    tableLabelText.anchor.set(0.5);
    tableLabelText.position.set(0, -table.height / 2 + 24);
    gameOverLayout.addChild(tableLabelText);

    const tableScoreText = new PIXI.Text(opts.score, {
      fontFamily: "Arial",
      fontSize: 36,
      fontWeight: "bold",
      fill: "#7c411e",
      align: "center",
    });
    tableScoreText.anchor.set(0.5);
    tableScoreText.position.set(0, -12);
    gameOverLayout.addChild(tableScoreText);

    const tableReplayButton = new PIXI.Sprite(
      gameScreenAssets.gameOverTableReplayBtn
    );
    tableReplayButton.anchor.set(0.5);
    tableReplayButton.position.set(0, table.height / 2 - 36);
    tableReplayButton.eventMode = "static";

    tableReplayButton.on("pointerdown", () => {
      reloadLevel();
    });

    gameOverLayout.addChild(tableReplayButton);
  };

  const removeTempText = (tempText) => {
    tempTexts.remove(tempText);
    playerControlsLayout.removeChild(tempText);
  };

  const updateTempTexts = () => {
    if (tempTexts.isEmpty()) {
      return;
    }

    for (const tempText of tempTexts.elems) {
      updateTempText(tempText);
    }
  };

  const updateTempText = (tempText) => {
    if (tempText.isTransparent()) {
      removeTempText(tempText);
    }

    tempText.moveUp(1);
    tempText.fadeOut(0.025);
  };

  const createTempText = (opts = {}) => {
    const tempText = new DynamicScoreText(opts.text, {
      fontFamily: "Arial",
      fontSize: 18,
      fill: "#ffffff",
      align: "center",
    });
    tempText.x = opts.x;
    tempText.y = opts.y;

    tempTexts.add(tempText);
    playerControlsLayout.addChild(tempText);
  };

  const explodeAllBombs = () => {
    for (const bomb of bombs.elems) {
      createExplosion({ x: bomb.x, y: bomb.y });

      // PIXI.sound.play("bombExplosionSound");
      removeBomb(bomb);
    }
  };

  const removeExplosion = (explosion) => {
    explosion.destroy();
    playerControlsLayout.removeChild(explosion);
  };

  const createExplosion = (opts = {}) => {
    const explosion = new Explosion([
      gameScreenAssets.explosion1,
      gameScreenAssets.explosion2,
      gameScreenAssets.explosion3,
      gameScreenAssets.explosion4,
      gameScreenAssets.explosion5,
    ]);

    explosion.x = opts.x;
    explosion.y = opts.y;
    explosion.anchor.set(0.5);
    explosion.rotation = Math.random() * Math.PI;
    explosion.scale.set(stageOptions.scale - 0.25);
    explosion.loop = false;
    explosion.animationSpeed = 0.9;
    explosion.gotoAndPlay(0);

    explosion.onComplete = () => {
      removeExplosion(explosion);

      gameOver();
    };

    playerControlsLayout.addChild(explosion);
  };

  const createRandomObject = () => {
    const r = Math.random();

    if (r < 0.25) {
      createBomb();
    } else {
      createCookie(Randomizer.intBetweenIncl(0, 2));
    }
  };

  const removeBomb = (bomb) => {
    bombs.remove(bomb);
    bombsLayout.removeChild(bomb);
  };

  const updateBombs = () => {
    if (bombs.isEmpty()) {
      return;
    }

    for (const bomb of bombs.elems) {
      updateBomb(bomb);
    }
  };

  const updateBomb = (bomb) => {
    if (bomb.y > app.screen.height + bomb.height) {
      removeBomb(bomb);
    }

    bomb.fallDown();
  };

  const createBomb = () => {
    const bomb = new Bomb(gameScreenAssets.bomb);
    bomb.scale.set(stageOptions.scale);
    bomb.x = Randomizer.floatBetween(bomb.width, app.screen.width - bomb.width);
    bomb.y = -bomb.height;
    bomb.fallSpeed = Randomizer.floatBetween(
      app.screen.height * 0.0025,
      app.screen.height * 0.005
    );
    bomb.eventMode = "static";

    bomb.on("pointerdown", onBombTap);

    function onBombTap() {
      createExplosion({ x: bomb.x, y: bomb.y });
      removeAllCookies();

      PIXI.sound.play("bombExplosionSound");
      removeBomb(bomb);
    }

    bombs.add(bomb);
    bombsLayout.addChild(bomb);
  };

  const removeAllCookies = () => {
    cookies.removeAll();
    cookiesLayout.removeChildren();
  };

  const removeCookie = (cookie) => {
    console.log("removed");
    cookies.remove(cookie);
    cookiesLayout.removeChild(cookie);
  };

  const updateCookies = () => {
    if (cookies.isEmpty()) {
      return;
    }

    for (const cookie of cookies.elems) {
      updateCookie(cookie);
    }
  };

  const updateCookie = (cookie) => {
    if (cookie.y > app.screen.height + cookie.size) {
      removeCookie(cookie);
    }
    console.log(cookie.y);

    cookie.fallDown();
  };

  const createCookie = (cookieType) => {
    const cookieOpts = {
      texures: [
        gameScreenAssets.cookie1,
        gameScreenAssets.cookie3,
        gameScreenAssets.cookie5,
      ],
      hp: 3,
      scale: stageOptions.scale - 0.2,
    };

    switch (cookieType) {
      case 0:
        cookieOpts.texures = [
          gameScreenAssets.cookie1,
          gameScreenAssets.cookie4,
        ];
        cookieOpts.scale = stageOptions.scale - 0.3;
        cookieOpts.hp = 2;
        break;
      case 1:
        break;
      default:
        cookieOpts.texures = [
          gameScreenAssets.cookie1,
          gameScreenAssets.cookie2,
          gameScreenAssets.cookie3,
          gameScreenAssets.cookie4,
          gameScreenAssets.cookie5,
        ];
        cookieOpts.hp = 5;
        cookieOpts.scale = stageOptions.scale;
        break;
    }

    const cookie = new Cookie(cookieOpts.texures, cookieOpts.hp);
    cookie.x = Randomizer.floatBetween(
      cookie.width,
      app.screen.width - cookie.width
    );
    cookie.scale.set(cookieOpts.scale);
    console.log(cookie.height * cookie.scale.y);
    cookie.fallSpeed = Randomizer.floatBetween(
      app.screen.height * 0.00875,
      app.screen.height * 0.01
    );
    cookie.eventMode = "static";

    cookie.on("pointerdown", onCookieTap);

    function onCookieTap(e) {
      PIXI.sound.play("crunchSound");

      cookie.hit();
      cookie.swapTexture();

      scoreManager.increaseScore();
      updateScoreText(scoreManager.score);

      if (cookie.hasNotEnoughHitPoints()) {
        removeCookie(cookie);
        PIXI.sound.play("scoreSound");

        scoreManager.increaseScoreBy(cookie.scoreValue());
        updateScoreText(scoreManager.score);

        createTempText({
          text: "+" + cookie.scoreValue(),
          x: e.client.x,
          y: e.client.y,
        });
      }
    }

    cookies.add(cookie);
    cookiesLayout.addChild(cookie);
  };

  const updateScoreText = (value) => {
    scoreText.text = value;
  };

  const gameOver = () => {
    removeAllCookies();
    explodeAllBombs();

    if (scoreManager.score > scoreManager.bestScore) {
      scoreManager.updateBestScore(scoreManager.score);
    }

    createGameOverTable({ score: scoreManager.bestScore });
    app.ticker.remove(animateLevel);
  };

  const reloadLevel = () => {
    removeGameOverTable();

    scoreManager.resetScore();
    updateScoreText(scoreManager.score);

    cookieSpawnTimer.reset();

    app.ticker.add(animateLevel);
  };

  const animateLevel = (delta) => {
    updateCookies();
    updateTempTexts();
    updateBombs();

    cookieSpawnTimer.tickBy((1 / 60) * delta);
    if (cookieSpawnTimer.timeIsOver()) {
      createRandomObject();

      cookieSpawnTimer.reset();
    }
  };
  app.ticker.add(animateLevel);

  const initLevel = () => {
    updateBreakpoints();
  };
  initLevel();

  window.addEventListener("resize", () => {
    updateBreakpoints();

    updateGameObjectPosition(scoreText, {
      x: app.screen.width * 0.975,
      y: app.screen.height * 0.075,
    });

    updateGameObjectPosition(gameOverLayout, {
      x: app.screen.width / 2,
      y: app.screen.height / 2,
    });
  });
}

init();
