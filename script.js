const form = document.getElementById("checkInForm");
const nameInput = document.getElementById("attendeeName");
const teamSelect = document.getElementById("teamSelect");

const attendeeCount = document.getElementById("attendeeCount");
const progressBar = document.getElementById("progressBar");
const greeting = document.getElementById("greeting");

let count = 0;
const maxCount = 50;

form.addEventListener("submit", function (event) {
  event.preventDefault();

  const name = nameInput.value.trim();
  const team = teamSelect.value;
  const teamName =
    teamSelect.options[teamSelect.selectedIndex].text;

  // Total attendance
  count++;
  attendeeCount.textContent = count;

  // Progress bar
  const percentage = Math.min(
    Math.round((count / maxCount) * 100),
    100
  );

  progressBar.style.width = percentage + "%";

  // Team count
  const teamCounter =
    document.getElementById(team + "Count");

  const currentTeamCount =
    parseInt(teamCounter.textContent, 10);

  teamCounter.textContent =
    currentTeamCount + 1;

  // Welcome message
  greeting.textContent =
    `🎉 Welcome, ${name}, from ${teamName}!`;

  // Clear form
  form.reset();
});
