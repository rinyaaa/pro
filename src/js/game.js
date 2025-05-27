document.addEventListener("DOMContentLoaded", () => {
  const fuseBar = document.getElementById("fuseBar");
  const toggleButton = document.getElementById("toggleButton");
  const scoreDisplay = document.getElementById("score");
  const timeLimitDisplay = document.getElementById("timeLimitDisplay");
  const bombImage = document.getElementById("bombImage");
  const ruleButton = document.getElementById("ruleButton");
  const ruleBox = document.getElementById("ruleBox");

  //サウンド読み込み（スタート音）
  const startSound = new Audio("sounds/start.mp3");
  const explosionSound = new Audio("sounds/explosion.mp3");
  const tenpointsSound = new Audio("sounds/tenpoints.mp3");
  const eightpointsSound = new Audio("sounds/eightpoints.mp3");
  const onepointSound = new Audio("sounds/onepoint.mp3");
  const fivepointsSound = new Audio("sounds/fivepoints.mp3");

  let startTime, timerId;
  let timeLimit;
  let shrinking = false;

  document.body.style.backgroundColor = "rgb(160, 160, 160)";

  ruleButton.addEventListener("click", () => {
    // show クラスを切り替える
    ruleBox.classList.toggle("show");

    // ボタンの文字も切り替える
    if (ruleBox.classList.contains("show")) {
      ruleButton.textContent = "ルールを隠す";
    } else {
      ruleButton.textContent = "ルール説明";
    }
  });

  toggleButton.addEventListener("click", () => {
    if (!shrinking) {
      // === スタート処理 ===

      // スタート音を再生、火花を再表示する
      document.getElementById("spark").style.display = "block";
      startSound.currentTime = 0;
      startSound.play();

      // 制限時間（3,5,7秒のいずれか）をランダムに決定
      const timeOptions = [3, 5, 7];
      timeLimit = timeOptions[Math.floor(Math.random() * timeOptions.length)];
      timeLimitDisplay.textContent = `制限時間： ${timeLimit} 秒`;

      // 導火線の見た目とアニメーションを初期化して開始
      fuseBar.style.transition = "none";
      fuseBar.style.width = "100%";
      void fuseBar.offsetWidth; // 強制再描画
      fuseBar.style.transition = `width ${timeLimit}s linear`;
      fuseBar.style.width = "0%";

      fuseBar.style.backgroundColor = "#ff4444";
      scoreDisplay.textContent = "";
      shrinking = true;
      toggleButton.textContent = "ストップ";

      // 爆弾を表示（位置も初期化）
      bombImage.style.display = "block";
      bombImage.style.left = "-730px";

      // スコア表示スタイル初期化
      scoreDisplay.style.fontSize = "24px";
      scoreDisplay.style.fontWeight = "bold";

      // 開始時間を記録
      startTime = Date.now();

      // 時間切れによる爆発処理を予約
      timerId = setTimeout(() => {
        if (shrinking) {
          rawScore = 0;
          explosionSound.play();
          fuseBar.style.backgroundColor = "gray";
          scoreDisplay.textContent = "💥 爆発！0点！💥";
          scoreDisplay.style.fontSize = "28px";
          scoreDisplay.style.fontWeight = "bold";

          // 火花を非表示にする
          document.getElementById("spark").style.display = "none";

          // ここで爆弾も非表示にする
          bombImage.style.display = "none";

          shrinking = false;
          toggleButton.textContent = "スタート";
          //押し間違えないように少しボタンを押せなくする
          toggleButton.disabled = true;
          setTimeout(() => {
            toggleButton.disabled = false;
          }, 500);
        }
      }, timeLimit * 1000);
    } else {
      // === ストップ処理 ===
      const currentTime = Date.now();
      const elapsed = (currentTime - startTime) / 1000;
      const diff = timeLimit - elapsed;

      // 導火線のアニメーションを止める
      const computedWidth = window
        .getComputedStyle(fuseBar)
        .getPropertyValue("width");
      fuseBar.style.transition = "none";

      fuseBar.style.width = computedWidth;

      let rawScore; //スコアの変数❗️

      if (diff <= 0) {
        explosionSound.play(); // ← 爆発音
        rawScore = 0; //０点のスコアを代入
        score = "💥 爆発！0点！💥";
        bombImage.style.display = "none";
      } else if (diff <= 0.1) {
        tenpointsSound.play();
        rawScore = 10; //１０点のスコアを代入
        score = "🥇パーフェクト！10点！🥇";
      } else if (diff <= 0.3) {
        eightpointsSound.play();
        rawScore = 8;
        score = "👍ナイス！8点！👍 ";
      } else if (diff <= 0.7) {
        fivepointsSound.play();
        rawScore = 5;
        score = "🙂まあまあ！5点！🙂";
      } else {
        onepointSound.play();
        rawScore = 1;
        score = "😅早過ぎます！1点！😅";
      }

      // localStorageに保存されているこれまでの合計スコアを取得し、数値に変換
      const currentTotalScore =
        parseInt(localStorage.getItem("game3"), 10) || 0;

      // 今回獲得したポイントをこれまでの合計スコアに加算
      const newTotalScore = currentTotalScore + rawScore;

      // 新しい合計スコアをlocalStorageに保存（
      localStorage.setItem("game3", newTotalScore.toString());

      scoreDisplay.textContent = score;
      scoreDisplay.style.fontSize = "28px"; //フォントサイズ
      scoreDisplay.style.fontWeight = "bold";

      clearTimeout(timerId);
      shrinking = false;
      toggleButton.textContent = "スタート";

      // 火花を非表示にする
      document.getElementById("spark").style.display = "none";
    }
  });
});
