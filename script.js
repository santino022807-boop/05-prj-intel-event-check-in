// Intel Sustainability Summit Check-In
// Includes all required features + all LevelUps

const MAX_COUNT = 50;
const STORAGE_KEY = "intel-summit-checkins";

function startApp() {
  const form = document.getElementById("check-in-form");
  const nameInput = document.getElementById("attendee-name");
  const teamSelect = document.getElementById("teamSelect");

  if (!form || !nameInput || !teamSelect) {
    console.error("Could not find the starter form elements.");
    return;
  }

  const teamNames = {
    water: "Team WaterWise",
    zero: "Team Net Zero",
    power: "Team Renewables"
  };

  // Find existing starter elements
  let totalDisplay = document.querySelector(
    "#attendee-count, #attendance-count, #total-count, .attendee-count, .attendance-count, .total-count"
  );

  let progressBar = document.querySelector(
    "#progress-bar, .progress-bar, .progress-fill, [data-progress-bar]"
  );

  let greeting = document.querySelector(
    "#greeting, #welcome-message, #message, .greeting, .welcome-message"
  );

  const waterCount = document.getElementById("water-count");
  const zeroCount = document.getElementById("zero-count");
  const powerCount = document.getElementById("power-count");

  // Add a greeting box if the starter does not already have one
  if (!greeting) {
    greeting = document.createElement("div");
    greeting.id = "greeting";
    greeting.textContent = "Welcome! Enter your name and select your team.";
    greeting.style.padding = "12px";
    greeting.style.margin = "15px 0";
    greeting.style.borderRadius = "8px";
    greeting.style.background = "#eaf5ff";
    greeting.style.fontWeight = "bold";
    form.parentNode.insertBefore(greeting, form);
  }

  // Add a total display if needed
  if (!totalDisplay) {
    totalDisplay = document.createElement("p");
    totalDisplay.id = "attendee-count";
    totalDisplay.style.fontWeight = "bold";
    totalDisplay.style.fontSize = "1.2rem";
    greeting.parentNode.insertBefore(totalDisplay, greeting);
  }

  // Create LevelUp attendee list
  const attendeeSection = document.createElement("section");
  attendeeSection.id = "attendee-list-section";
  attendeeSection.style.marginTop = "30px";
  attendeeSection.innerHTML = `
    <h2>Attendee List</h2>
    <div id="attendee-list"></div>
  `;

  const teamArea =
    (waterCount && waterCount.closest("section")) ||
    form.closest("section") ||
    form.parentElement;

  teamArea.insertAdjacentElement("afterend", attendeeSection);

  // Create celebration area
  const celebration = document.createElement("div");
  celebration.id = "celebration-message";
  celebration.style.display = "none";
  celebration.style.padding = "18px";
  celebration.style.margin = "20px 0";
  celebration.style.borderRadius = "10px";
  celebration.style.background = "#fff3b0";
  celebration.style.fontWeight = "bold";
  celebration.style.textAlign = "center";

  attendeeSection.parentNode.insertBefore(celebration, attendeeSection);

  // Load saved progress
  let savedData;

  try {
    savedData = JSON.parse(localStorage.getItem(STORAGE_KEY));
  } catch {
    savedData = null;
  }

  let attendees =
    savedData && Array.isArray(savedData.attendees)
      ? savedData.attendees
      : [];

  function getTeamCounts() {
    const counts = {
      water: 0,
      zero: 0,
      power: 0
    };

    attendees.forEach((person) => {
      if (counts[person.team] !== undefined) {
        counts[person.team]++;
      }
    });

    return counts;
  }

  function saveProgress() {
    const counts = getTeamCounts();

    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        total: attendees.length,
        teamCounts: counts,
        attendees: attendees
      })
    );
  }

  function updatePage() {
    const count = attendees.length;
    const counts = getTeamCounts();

    // Total attendance
    totalDisplay.textContent = `${count} / ${MAX_COUNT} attendees checked in`;

    // Team attendance
    if (waterCount) {
      waterCount.textContent = counts.water;
    }

    if (zeroCount) {
      zeroCount.textContent = counts.zero;
    }

    if (powerCount) {
      powerCount.textContent = counts.power;
    }

    // Progress bar
    const percentage = Math.min(
      Math.round((count / MAX_COUNT) * 100),
      100
    );

    if (progressBar) {
      progressBar.style.width = percentage + "%";
    }

    // Attendee list
    const attendeeList = document.getElementById("attendee-list");
    attendeeList.innerHTML = "";

    if (attendees.length === 0) {
      attendeeList.innerHTML = "<p>No attendees checked in yet.</p>";
    } else {
      attendees.forEach((person, index) => {
        const row = document.createElement("p");
        row.style.padding = "8px 0";
        row.style.margin = "0";
        row.style.borderBottom = "1px solid #ddd";
        row.textContent =
          `${index + 1}. ${person.name} — ${teamNames[person.team]}`;
        attendeeList.appendChild(row);
      });
    }

    // Celebration LevelUp
    if (count >= MAX_COUNT) {
      const highest = Math.max(
        counts.water,
        counts.zero,
        counts.power
      );

      const winners = Object.keys(counts).filter(
        (team) => counts[team] === highest
      );

      if (winners.length === 1) {
        celebration.textContent =
          `🎉 Attendance goal reached! ${teamNames[winners[0]]} wins with ${highest} check-ins!`;
      } else {
        celebration.textContent =
          `🎉 Attendance goal reached! We have a tie between ${winners
            .map((team) => teamNames[team])
            .join(" and ")}!`;
      }

      celebration.style.display = "block";
    } else {
      celebration.style.display = "none";
    }
  }

  form.addEventListener("submit", function (event) {
    event.preventDefault();

    const name = nameInput.value.trim();
    const team = teamSelect.value;

    if (!name || !team) {
      greeting.textContent =
        "Please enter your name and select a team.";
      return;
    }

    attendees.push({
      name: name,
      team: team
    });

    greeting.textContent =
      `🎉 Welcome, ${name}, from ${teamNames[team]}!`;

    saveProgress();
    updatePage();

    form.reset();
    nameInput.focus();
  });

  updatePage();
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", startApp);
} else {
  startApp();
}
