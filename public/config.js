// DEEP SPACE SYSTEMS OBSERVATORY — CENTRAL CONFIGURATION & DYNAMIC AGE ENGINE
// Single dynamic sentence arithmetic without telemetry dashboard noise.

window.OBSERVATORY_CONFIG = {
  operator: {
    name: 'Ayush Kandwal',
    preferredName: 'Ayu',
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
  // Exact calendar arithmetic. The birthdate itself is never printed; only the live elapsed sentence.
  birthDateUTC: new Date(Date.UTC(2003, 11, 10, 18, 30, 0)),
  timezone: 'Asia/Kolkata',
  timezoneOffsetMinutes: 330
};

// Exact Calendar Arithmetic Engine
window.calculateObservatoryAge = function(targetDate) {
  const birth = targetDate || window.OBSERVATORY_CONFIG.birthDateUTC;
  const now = new Date();

  // Convert to Kolkata local time components (+05:30)
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
    const prevMonthDays = new Date(Date.UTC(nYear, nMonth, 0)).getUTCDate();
    days += prevMonthDays;
  }

  if (months < 0) {
    years--;
    months += 12;
  }

  const pad = (n) => String(n).padStart(2, '0');

  const sentencePlain = `I have spent ${years} years, ${months} months, ${days} days, ${nHour} hours, ${nMinute} minutes and ${nSecond} seconds on this planet.`;
  const sentenceHTML = `I have spent <span class="text-white font-bold tabular-nums">${years}</span> years, <span class="text-white font-bold tabular-nums">${months}</span> months, <span class="text-white font-bold tabular-nums">${days}</span> days, <span class="text-white font-bold tabular-nums">${pad(nHour)}</span> hours, <span class="text-white font-bold tabular-nums">${pad(nMinute)}</span> minutes and <span class="text-white font-bold tabular-nums">${pad(nSecond)}</span> seconds on this planet.`;

  return {
    years,
    months,
    days,
    hours: pad(nHour),
    minutes: pad(nMinute),
    seconds: pad(nSecond),
    sentencePlain,
    sentenceHTML,
    formattedAge: `${years} years, ${months} months, ${days} days`
  };
};

// Auto-bind dynamic sentence and age across DOM elements
(function initObservatoryAgeTelemetry() {
  if (typeof document === 'undefined') return;

  function updateDynamicSentences() {
    const data = window.calculateObservatoryAge();

    document.querySelectorAll('.observatory-live-sentence').forEach(el => {
      el.innerHTML = data.sentenceHTML;
    });

    document.querySelectorAll('.observatory-plain-sentence').forEach(el => {
      el.textContent = data.sentencePlain;
    });

    document.querySelectorAll('.observatory-live-age').forEach(el => {
      el.textContent = `${data.years}Y ${data.months}M ${data.days}D`;
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      updateDynamicSentences();
      setInterval(updateDynamicSentences, 1000);
    });
  } else {
    updateDynamicSentences();
    setInterval(updateDynamicSentences, 1000);
  }
})();
