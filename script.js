document.addEventListener("DOMContentLoaded", () => {
  const historyDiv = document.getElementById("history");
  const leaderboardDiv = document.getElementById("leaderboard");
  const historyBtn = document.getElementById("historyBtn");
  const leaderboardBtn = document.getElementById("leaderboardBtn");

  // Show/hide sections
  historyBtn.addEventListener("click", () => {
    document.getElementById("game-history").style.display = "block";
    document.getElementById("leaderboard-section").style.display = "none";
  });

  leaderboardBtn.addEventListener("click", () => {
    document.getElementById("game-history").style.display = "none";
    document.getElementById("leaderboard-section").style.display = "block";
  });

  // Fetch and render game history
  fetch("GameJSON/GameHistory.json")
    .then((res) => res.json())
    .then((data) => {
      historyDiv.textContent = JSON.stringify(data, null, 2);
    })
    .catch((err) => {
      historyDiv.textContent = "Error loading game history: " + err;
    });

  // Fetch and render leaderboard
  fetch("GameJSON/Leaderboard.json")
    .then((res) => res.json())
    .then((data) => {
      leaderboardDiv.textContent = JSON.stringify(data, null, 2);
    })
    .catch((err) => {
      leaderboardDiv.textContent = "Error loading leaderboard: " + err;
    });

  // Init: show history by default
  historyBtn.click();
});
