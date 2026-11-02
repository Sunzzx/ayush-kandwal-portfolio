// DEEP SPACE SYSTEMS OBSERVATORY — CENTRAL CONFIGURATION & HIGH-PRECISION DYNAMIC AGE ENGINE
// Precise decimal years calculation down to milliseconds: 22.xxxxxxxxxx years.

var rootEnv = typeof window !== 'undefined' ? window : (typeof global !== 'undefined' ? global : this);

rootEnv.OBSERVATORY_CONFIG = {
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
  // Exact calendar arithmetic: 2003-12-10T18:30:00.000Z
  birthDateUTC: new Date(Date.UTC(2003, 11, 10, 18, 30, 0)),
  timezone: 'Asia/Kolkata',
  timezoneOffsetMinutes: 330
};

// High-Precision Decimal & Calendar Age Engine
rootEnv.calculateObservatoryAge = function(targetDate) {
  const birth = targetDate || rootEnv.OBSERVATORY_CONFIG.birthDateUTC;
  const nowMs = Date.now();
  const birthMs = birth instanceof Date ? birth.getTime() : new Date(birth).getTime();
  const diffMs = Math.max(0, nowMs - birthMs);

  // Exact average Gregorian calendar year accounting for 400-year leap cycle (365.2425 days)
  const msPerYear = 365.2425 * 24 * 60 * 60 * 1000;
  const decimalYearsVal = diffMs / msPerYear;
  
  // 10 decimal places captures millisecond-level precision (1 ms ≈ 3.17e-11 years)
  const decimalYears = decimalYearsVal.toFixed(10);
  const [wholeYears, fracYears] = decimalYears.split('.');

  // Traditional calendar breakdown (kept as secondary utility)
  const kolkataOffsetMs = 5.5 * 60 * 60 * 1000;
  const birthKolkata = new Date(birthMs + kolkataOffsetMs);
  const nowKolkata = new Date(nowMs + kolkataOffsetMs);

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

  // Primary dynamic sentence format: 22.xxxxxxxxxx years till milliseconds
  const sentencePlain = `I have spent ${decimalYears} years on this planet.`;
  const sentenceHTML = `I have spent <span class="text-white font-bold tabular-nums">${wholeYears}</span>.<span class="text-emerald-400 font-bold tabular-nums">${fracYears}</span> years on this planet.`;
  const timerPlain = `${decimalYears} years`;
  const timerHTML = `<span class="text-white font-bold tabular-nums">${wholeYears}</span>.<span class="text-emerald-400 font-bold tabular-nums">${fracYears}</span> years`;

  return {
    decimalYears,
    wholeYears,
    fracYears,
    years,
    months,
    days,
    hours: pad(nHour),
    minutes: pad(nMinute),
    seconds: pad(nSecond),
    sentencePlain,
    sentenceHTML,
    timerPlain,
    timerHTML,
    rawTimerHTML: timerHTML,
    rawTimerPlain: timerPlain,
    formattedAge: `${decimalYears} years`
  };
};

// Auto-bind dynamic high-precision millisecond odometer across DOM elements
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

    document.querySelectorAll('.observatory-live-timer, .observatory-raw-timer').forEach(el => {
      el.innerHTML = data.timerHTML;
    });

    document.querySelectorAll('.observatory-live-age').forEach(el => {
      el.textContent = `${data.decimalYears} years`;
    });
  }

  // Use requestAnimationFrame throttled to ~30-33ms for smooth millisecond ticking with 0 CPU overhead
  let lastFrameTime = 0;
  function loop(timestamp) {
    if (!lastFrameTime || timestamp - lastFrameTime >= 30) {
      updateDynamicSentences();
      lastFrameTime = timestamp;
    }
    if (typeof requestAnimationFrame !== 'undefined') {
      requestAnimationFrame(loop);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      updateDynamicSentences();
      if (typeof requestAnimationFrame !== 'undefined') {
        requestAnimationFrame(loop);
      } else {
        setInterval(updateDynamicSentences, 33);
      }
    });
  } else {
    updateDynamicSentences();
    if (typeof requestAnimationFrame !== 'undefined') {
      requestAnimationFrame(loop);
    } else {
      setInterval(updateDynamicSentences, 33);
    }
  }
})();
