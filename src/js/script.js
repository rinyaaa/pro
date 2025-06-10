let stage = 1;
let point = 0;
const game = document.getElementById("game");
const stageDisplay = document.getElementById("stage");
const countdown = document.getElementById("countdown");
const stageMessage = document.getElementById("stageMessage");
const startButton = document.getElementById("startButton");
const ruleButton = document.getElementById("ruleButton");

function showStageMessage(text, callback) {
  stageMessage.textContent = text;
  stageMessage.style.display = "block";
  setTimeout(() => {
    stageMessage.style.display = "none";
    callback();
  }, 1000);
}

function createBar() {
  const messageText = stage === 1 ? "" : `次はステージ${stage}です`;
  showStageMessage(messageText, () => {
    function clearGame(reason) {
      alert(
        `ゲームクリア！全てのステージをクリアしました！\n最終ポイント: ${point}`
      );
      if ((reason = "clear")) {
        stageMessage.textContent = `ゲームクリア！全てのステージをクリアしました！\n最終ポイント: ${point}`;
      } else if (reason === "timeout") {
        stageMessage.textContent = `タイムアップしましt！\n最終ポイント: ${point}`;
      }

      const game1Score = parseInt(localStorage.getItem("game1"), 10) || 0;
      const newTotalScore = game1Score + point;
      localStorage.setItem("game1", newTotalScore.toString());
      location.href = "kou.html";
    }

    const randomTimeout =
      Math.floor(Math.random() * (20000 - 10000 + 1)) + 10000;

    if (!window.clearGameTimeout) {
      window.clearGameTimeout = setTimeout(() => {
        clearGame("timeout");
      }, randomTimeout);
    }

    // ステージが10を超えているかチェックする
    if (stage > 10) {
      clearGame("clear");
      return;
    }

    const bar = document.createElement("div");
    bar.classList.add("bar");
    game.appendChild(bar);

    const gameWidth = game.clientWidth;
    const barWidth = 80; // CSSで設定している棒のwidth
    const randomLeft = Math.floor(Math.random() * (gameWidth - barWidth));
    bar.style.left = `${randomLeft}px`;

    const speed = 1500 - stage * 100;
    bar.style.transitionDuration = `${speed}ms`;

    setTimeout(() => {
      bar.style.top = `${game.clientHeight}px`;
    }, 50);

    bar.addEventListener("click", () => {
      if (game.contains(bar)) {
        game.removeChild(bar);
        stage++;
        point++;
        stageDisplay.textContent = `ステージ: ${stage}`;
        createBar();
      }
    });

    setTimeout(() => {
      if (game.contains(bar)) {
        alert(`ゲームオーバー！到達ステージ: ${stage}\nポイントは: ${point}`);

        // スコア保存

        const game1Score = parseInt(localStorage.getItem("game1"), 10) || 0;

        const newTotalScore = game1Score + point;
        localStorage.setItem("game1", newTotalScore.toString());

        //広告に行く
        location.href = "kou.html";
      }
    }, speed + 200);
  });
}

function startCountdown() {
  let count = 3;
  countdown.textContent = count;
  countdown.style.display = "block";

  const countdownInterval = setInterval(() => {
    count--;
    if (count > 0) {
      countdown.textContent = count;
    } else {
      clearInterval(countdownInterval);
      countdown.textContent = "スタート";
      setTimeout(() => {
        countdown.style.display = "none";
        createBar();
      }, 1000);
    }
  }, 1000);
}

startButton.addEventListener("click", () => {
  startButton.style.display = "none";
  ruleButton.style.display = "none";
  game.style.backgroundImage = "url('../img/backNew.png')";

  stageDisplay.textContent = `ステージ: ${stage}`;
  stageDisplay.style.display = "block"; // 必要に応じて、ステージ表示を常に表示する

  startCountdown();
});
