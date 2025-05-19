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
  showStageMessage(`次はステージ${stage}です`, () => {
    const bar = document.createElement("div");
    bar.classList.add("bar");
    game.appendChild(bar);

    const speed = stage + 1500;
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
        localStorage.setItem("lastScore", point);
        const highScore = localStorage.getItem("highScore") || 0;
        if (point > highScore) {
          localStorage.setItem("highScore", point);
        }

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
  console.log("aaa" );

  startCountdown();
});
