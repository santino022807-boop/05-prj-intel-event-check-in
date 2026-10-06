const form = document.getElementById("checkInForm");
const nameInput = document.getElementById("attendeeName");
const teamSelect = document.getElementById("teamSelect");
const attendeeCount = document.getElementById("attendeeCount");
const progressBar = document.getElementById("progressBar");
const greeting = document.getElementById("greeting");

const waterCount = document.getElementById("waterCount");
const zeroCount = document.getElementById("zeroCount");
const powerCount = document.getElementById("powerCount");

const MAX_COUNT = 50;
const STORAGE_KEY = "intelSummitCheckIn";

const teamNames = {
  water: "Team Water Wise",
  zero: "Team Net Zero",
  power: "Team Renewables"
};

let savedData = JSON.parse(localStorage.getItem(STORAGE_KEY)) || {};
let attendees = Array.isArray(savedData.attendees)
  ? savedData.attendees
  : [];

// LevelUp: Attendee List
const teamStats = document.querySelector(".team-stats");

const attendeeSection = document.createElement("div");
attendeeSection.style.marginTop = "28px";

attendeeSection.innerHTML = `
  <h3>Attendee List</h3>
  <div id="attendeeList"></div>
`;

teamStats.insertAdjacentElement("afterend", attendeeSection);

const attendeeList = document.getElementById("attendeeList");

function getTeamCounts() {
  const counts = {
    water: 0,
    zero: 0,
    power: 0
  };

  attendees.forEach(function (attendee) {
    if (counts[attendee.team] !== undefined) {
      counts[attendee.team]++;
    }
  });

  return counts;
}

function saveProgress() {
  const teamCounts = getTeamCounts();

  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify({
      count: attendees.length,
      teamCounts: teamCounts,
      attendees: attendees
    })
  );
}

function renderAttendeeList() {
  attendeeList.innerHTML = "";

  if (attendees.length === 0) {
    attendeeList.textContent = "No attendees checked in yet.";
    return;
  }

  attendees.forEach(function (attendee, index) {
    const row = document.createElement("div");

    row.style.padding = "10px 0";
    row.style.borderBottom = "1px solid #ddd";

    row.textContent =
      `${index + 1}. ${attendee.name} — ${teamNames[attendee.team]}`;

    attendeeList.appendChild(row);
  });
}

function render() {
  const count = attendees.length;
  const counts = getTeamCounts();

  const percentage = Math.min(
    Math.round((count / MAX_COUNT) * 100),
    100
  );

  attendeeCount.textContent = count;

  progressBar.style.width = `${percentage}%`;

  waterCount.textContent = counts.water;
  zeroCount.textContent = counts.zero;
  powerCount.textContent = counts.power;

  renderAttendeeList();
}

function getWinningTeam() {
  const counts = getTeamCounts();

  const highest = Math.max(
    counts.water,
    counts.zero,
    counts.power
  );

  const winners = Object.keys(counts).filter(function (team) {
    return counts[team] === highest;
  });

  if (winners.length === 1) {
    return `${teamNames[winners[0]]} is winning with ${highest} check-ins!`;
  }

  return `It's a tie between ${winners
    .map(function (team) {
      return teamNames[team];
    })
    .join(" and ")}!`;
}

form.addEventListener("submit", function (event) {
  event.preventDefault();

  const name = nameInput.value.trim();
  const team = teamSelect.value;

  if (!name || !team) {
    greeting.textContent =
      "Please enter a name and select a team.";
    return;
  }

  attendees.push({
    name: name,
    team: team
  });

  saveProgress();
  render();

  if (attendees.length >= MAX_COUNT) {
    greeting.textContent =
      `🎉 Goal reached! ${getWinningTeam()}`;
  } else {
    greeting.textContent =
      `🎉 Welcome, ${name}, from ${teamNames[team]}!`;
  }

  form.reset();
  nameInput.focus();
});

render();
