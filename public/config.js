// DEEP SPACE SYSTEMS OBSERVATORY — CENTRAL CONFIGURATION & TELEMETRY ENGINE
// Configurable telemetry, calendar arithmetic, and operator metadata.

window.OBSERVATORY_CONFIG = {
  operator: {
    name: 'Ayush Kandwal',
    callsign: 'Ayu',
    handle: 'Sunzzx',
    title: 'Systems Architect, AI Researcher & Quant',
    email: 'ayushkandwal2007@gmail.com',
    academicEmail: 'ayushkandwal@gmail.com',
    github: 'https://github.com/Sunzzx',
    linkedin: 'https://www.linkedin.com/in/ayush-kandwal',
    twitter: 'https://x.com/its_ayu5',
    linktree: 'https://linktr.ee/sunzzx',
    worldquantId: 'AK45063'
  },
  // Birthdate parameter: 11 December 2003 (Midnight Asia/Kolkata timezone UTC+05:30)
  // Note: Full birthdate is NEVER rendered in the UI; only dynamically calculated age elapsed.
  birthDateUTC: new Date(Date.UTC(2003, 11, 10, 18, 30, 0)), // 2003-12-11 00:00:00 IST = 2003-12-10 18:30:00 UTC
  timezone: 'Asia/Kolkata',
  timezoneOffsetMinutes: 330 // +05:30
};

// Exact Calendar Arithmetic Age Engine
// Accurately calculates elapsed calendar Years, Months, Days (accounting for variable month lengths & leap years)
// Plus exact elapsed Hours, Minutes, Seconds.
window.calculateObservatoryAge = function(targetDate) {
  const birth = targetDate || window.OBSERVATORY_CONFIG.birthDateUTC;
  const now = new Date();

  // Convert both to Kolkata local time components
  const kolkataOffsetMs = 5.5 * 60 * 60 * 1000;
  const birthKolkata = new Date(birth.getTime() + kolkataOffsetMs);
  const nowKolkata = new Date(now.getTime() + kolkataOffsetMs);

  let bYear = birthKolkata.getUTCFullYear();
  let bMonth = birthKolkata.getUTCMonth();
  let bDay = birthKolkata.getUTCDate();

  let nYear = nowKolkata.getUTCFullYear();
  let nMonth = nowKolkata.getUTCMonth();
  let nDay = nowKolkata.getUTCDate();
  let nHour = nowKolkata.getUTCHours();
  let nMinute = nowKolkata.getUTCMinutes();
  let nSecond = nowKolkata.getUTCSeconds();

  let years = nYear - bYear;
  let months = nMonth - bMonth;
  let days = nDay - bDay;

  if (days < 0) {
    months--;
    // Days in previous month
    const prevMonthDays = new Date(Date.UTC(nYear, nMonth, 0)).getUTCDate();
    days += prevMonthDays;
  }

  if (months < 0) {
    years--;
    months += 12;
  }

  const pad = (n) => String(n).padStart(2, '0');

  return {
    years,
    months,
    days,
    hours: pad(nHour),
    minutes: pad(nMinute),
    seconds: pad(nSecond),
    formattedAge: `${years}Y ${months}M ${days}D`,
    formattedTime: `${pad(nHour)}:${pad(nMinute)}:${pad(nSecond)} IST`,
    telemetryString: `AGE: ${years}Y ${months}M ${days}D // LIVE CLOCK: ${pad(nHour)}:${pad(nMinute)}:${pad(nSecond)}`
  };
};

// Auto-bind Age Telemetry readouts across DOM elements with class 'observatory-live-age'
(function initObservatoryAgeTelemetry() {
  if (typeof document === 'undefined') return;

  function updateTelemetryDisplays() {
    const data = window.calculateObservatoryAge();
    
    document.querySelectorAll('.observatory-live-age').forEach(el => {
      el.textContent = data.formattedAge;
    });

    document.querySelectorAll('.observatory-live-clock').forEach(el => {
      el.textContent = data.formattedTime;
    });

    document.querySelectorAll('.observatory-live-telemetry').forEach(el => {
      el.textContent = data.telemetryString;
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      updateTelemetryDisplays();
      setInterval(updateTelemetryDisplays, 1000);
    });
  } else {
    updateTelemetryDisplays();
    setInterval(updateTelemetryDisplays, 1000);
  }
})();
