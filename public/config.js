// DEEP SPACE SYSTEMS OBSERVATORY — CENTRAL CONFIGURATION & HIGH-PRECISION DYNAMIC AGE ENGINE
// Precise decimal years calculation down to milliseconds: 22.xxxxxxxxxx years.

var rootEnv = typeof window !== 'undefined' ? window : (typeof global !== 'undefined' ? global : this);

rootEnv.OBSERVATORY_CONFIG = {
  operator: {
    name: 'Ayush Kandwal',
    handle: 'Sunzzx',
    title: 'AI & Quant Researcher',
    email: 'ayushkandwal2007@gmail.com',
    academicEmail: 'ayushkandwal@gmail.com',
    github: 'https://github.com/Sunzzx',
    linkedin: 'https://www.linkedin.com/in/ayush-kandwal',
    twitter: 'https://x.com/its_ayu5',
    linktree: 'https://linktr.ee/sunzzx'
  },
  // Birthdate parameter: 11 December 2003 (Midnight Asia/Kolkata timezone UTC+05:30)
  // Exact calendar arithmetic: 2003-12-10T18:30:00.000Z
  birthDateUTC: new Date(Date.UTC(2003, 11, 10, 18, 30, 0)),
  timezone: 'Asia/Kolkata',
  timezoneOffsetMinutes: 330
};

// High-Precision Decimal Age Engine: 22.dayshoursminutessecondsmilliseconds
rootEnv.calculateObservatoryAge = function(targetDate) {
  const birth = targetDate || rootEnv.OBSERVATORY_CONFIG.birthDateUTC;
  const nowMs = Date.now();
  const birthMs = birth instanceof Date ? birth.getTime() : new Date(birth).getTime();

  // Time calculations in Asia/Kolkata (IST = UTC + 5:30)
  const kolkataOffsetMs = 5.5 * 60 * 60 * 1000;
  const nowKolkata = new Date(nowMs + kolkataOffsetMs);

  const nYear = nowKolkata.getUTCFullYear();
  const nMonth = nowKolkata.getUTCMonth(); // 0-indexed (11 is December)
  const nDay = nowKolkata.getUTCDate();

  // Born Dec 11, 2003 at 00:00:00 IST
  const hadBirthdayThisYear = (nMonth > 11) || (nMonth === 11 && nDay >= 11);
  const ageYears = hadBirthdayThisYear ? (nYear - 2003) : (nYear - 2003 - 1);
  const lastBirthdayYear = hadBirthdayThisYear ? nYear : (nYear - 1);

  // Exact timestamp of the most recent birthday in UTC (Dec 10 18:30:00 UTC = Dec 11 00:00:00 IST)
  const lastBirthdayUTC = new Date(Date.UTC(lastBirthdayYear, 11, 10, 18, 30, 0));
  const elapsedSinceBirthdayMs = Math.max(0, nowMs - lastBirthdayUTC.getTime());

  // Elapsed days, hours, minutes, seconds, milliseconds since turning ageYears
  const days = Math.floor(elapsedSinceBirthdayMs / (24 * 60 * 60 * 1000));
  let remMs = elapsedSinceBirthdayMs % (24 * 60 * 60 * 1000);
  const hours = Math.floor(remMs / (60 * 60 * 1000));
  remMs = remMs % (60 * 60 * 1000);
  const minutes = Math.floor(remMs / (60 * 1000));
  remMs = remMs % (60 * 1000);
  const seconds = Math.floor(remMs / 1000);
  const milliseconds = remMs % 1000;

  const pad3 = (n) => String(n).padStart(3, '0');
  const pad2 = (n) => String(n).padStart(2, '0');

  // Format: 22.dayshoursminutessecondsmilliseconds
  // Days (3 digits) + Hours (2 digits) + Minutes (2 digits) + Seconds (2 digits) + Milliseconds (3 digits)
  // Example: 22.327012845941 (looks like 22.xxxxxxxxxxxx)
  const daysStr = pad3(days);
  const hoursStr = pad2(hours);
  const minutesStr = pad2(minutes);
  const secondsStr = pad2(seconds);
  const msStr = pad3(milliseconds);

  const wholeYears = String(ageYears);
  const fracYears = `${daysStr}${hoursStr}${minutesStr}${secondsStr}${msStr}`;
  const decimalYears = `${wholeYears}.${fracYears}`;

  // Calendar months for backwards compatibility
  const birthKolkata = new Date(birthMs + kolkataOffsetMs);
  let bYear = birthKolkata.getUTCFullYear();
  let bMonth = birthKolkata.getUTCMonth();
  let bDay = birthKolkata.getUTCDate();
  let calMonths = nMonth - bMonth;
  let calDays = nDay - bDay;
  if (calDays < 0) {
    calMonths--;
    const prevMonthDays = new Date(Date.UTC(nYear, nMonth, 0)).getUTCDate();
    calDays += prevMonthDays;
  }
  if (calMonths < 0) {
    calMonths += 12;
  }

  // Primary dynamic sentence format: 22.dayshoursminutessecondsmilliseconds (strictly pure white)
  const sentencePlain = `I have spent ${decimalYears} years on this planet.`;
  const sentenceHTML = `I have spent <span class="text-white font-bold tabular-nums" style="color: #ffffff !important;">${wholeYears}</span>.<span class="text-white font-bold tabular-nums" style="color: #ffffff !important;">${fracYears}</span> years on this planet.`;
  const timerPlain = `${decimalYears} years`;
  const timerHTML = `<span class="text-white font-bold tabular-nums" style="color: #ffffff !important;">${wholeYears}</span>.<span class="text-white font-bold tabular-nums" style="color: #ffffff !important;">${fracYears}</span> years`;

  return {
    decimalYears,
    wholeYears,
    fracYears,
    years: ageYears,
    months: calMonths,
    days,
    hours: hoursStr,
    minutes: minutesStr,
    seconds: secondsStr,
    milliseconds: msStr,
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
