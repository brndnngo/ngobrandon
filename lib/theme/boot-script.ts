import { THEME_COLOR } from "@/lib/theme/resolve";

const IS_DEV = process.env.NODE_ENV !== "production";

/**
 * Blocking IIFE for <head>. Kept as a static string so production minify
 * cannot rename the helpers the script calls. Logic matches la-sun + resolve.
 */
export const THEME_BOOT_SCRIPT = `(function(){
  try {
    if (location.pathname.indexOf("/studio") === 0) return;
    var LAT = 34.05;
    var LNG = -118.24;
    var TZ = "America/Los_Angeles";
    var KEY = "bn-theme-override";
    var COLORS = { light: "${THEME_COLOR.light}", dark: "${THEME_COLOR.dark}" };
    var DAY_MS = 86400000;
    var J1970 = 2440588;
    var J2000 = 2451545;
    var J0 = 0.0009;
    var RAD = Math.PI / 180;
    var E = RAD * 23.4397;
    var SUNSET_ANGLE = -0.833 * RAD;

    function toJulian(date) { return date.valueOf() / DAY_MS - 0.5 + J1970; }
    function fromJulian(j) { return new Date((j + 0.5 - J1970) * DAY_MS); }
    function toDays(date) { return toJulian(date) - J2000; }
    function solarMeanAnomaly(d) { return RAD * (357.5291 + 0.98560028 * d); }
    function eclipticLongitude(M) {
      var C = RAD * (1.9148 * Math.sin(M) + 0.02 * Math.sin(2 * M) + 0.0003 * Math.sin(3 * M));
      return M + C + RAD * 102.9372 + Math.PI;
    }
    function declination(l) { return Math.asin(Math.sin(l) * Math.cos(E)); }
    function julianCycle(d, lw) { return Math.round(d - J0 - lw / (2 * Math.PI)); }
    function approxTransit(Ht, lw, n) { return J0 + (Ht + lw) / (2 * Math.PI) + n; }
    function solarTransitJ(ds, M, L) { return J2000 + ds + 0.0053 * Math.sin(M) - 0.0069 * Math.sin(2 * L); }
    function hourAngle(h, phi, dec) {
      return Math.acos((Math.sin(h) - Math.sin(phi) * Math.sin(dec)) / (Math.cos(phi) * Math.cos(dec)));
    }
    function getSunTimes(date) {
      var lw = RAD * -LNG;
      var phi = RAD * LAT;
      var d = toDays(date);
      var n = julianCycle(d, lw);
      var ds = approxTransit(0, lw, n);
      var M = solarMeanAnomaly(ds);
      var L = eclipticLongitude(M);
      var dec = declination(L);
      var Jnoon = solarTransitJ(ds, M, L);
      var w = hourAngle(SUNSET_ANGLE, phi, dec);
      var a = approxTransit(w, lw, n);
      var Jset = solarTransitJ(a, M, L);
      var Jrise = Jnoon - (Jset - Jnoon);
      return { sunrise: fromJulian(Jrise), sunset: fromJulian(Jset) };
    }
    function partsOf(date) {
      var parts = new Intl.DateTimeFormat("en-US", {
        timeZone: TZ,
        year: "numeric", month: "2-digit", day: "2-digit",
        hour: "2-digit", minute: "2-digit", second: "2-digit",
        hourCycle: "h23"
      }).formatToParts(date);
      var map = {};
      for (var i = 0; i < parts.length; i++) {
        if (parts[i].type !== "literal") map[parts[i].type] = parts[i].value;
      }
      return map;
    }
    function tzOffsetMs(date) {
      var map = partsOf(date);
      var asUtc = Date.UTC(+map.year, +map.month - 1, +map.day, +map.hour, +map.minute, +map.second);
      return asUtc - date.getTime();
    }
    function zonedLocalToDate(year, month, day, hour, minute, second) {
      var wallAsUtc = Date.UTC(year, month - 1, day, hour, minute, second);
      var instant = wallAsUtc;
      for (var i = 0; i < 3; i++) instant = wallAsUtc - tzOffsetMs(new Date(instant));
      return new Date(instant);
    }
    function getNow() {
      var real = new Date();
      ${
        IS_DEV
          ? `var params = new URLSearchParams(location.search);
      var laTime = params.get("laTime");
      if (laTime) {
        var match = /^(\\d{1,2}):(\\d{2})(?::\\d{2})?$/.exec(laTime);
        if (match) {
          var h = +match[1], m = +match[2];
          if (h >= 0 && h <= 23 && m >= 0 && m <= 59) {
            var map = partsOf(real);
            return zonedLocalToDate(+map.year, +map.month, +map.day, h, m, +map.second);
          }
        }
      }`
          : ""
      }
      return real;
    }
    function apply(theme) {
      document.documentElement.setAttribute("data-theme", theme);
      var meta = document.querySelector('meta[name="theme-color"]');
      if (meta) meta.setAttribute("content", COLORS[theme]);
    }
    var now = getNow();
    ${
      IS_DEV
        ? `var forced = new URLSearchParams(location.search).get("theme");
    if (forced === "light" || forced === "dark") { apply(forced); return; }`
        : ""
    }
    var times = getSunTimes(now);
    var natural = (now >= times.sunrise && now < times.sunset) ? "light" : "dark";
    var theme = natural;
    try {
      var raw = localStorage.getItem(KEY);
      if (raw) {
        var parsed = JSON.parse(raw);
        if ((parsed.theme === "light" || parsed.theme === "dark") && typeof parsed.expiresAt === "number") {
          if (now.getTime() < parsed.expiresAt) theme = parsed.theme;
          else localStorage.removeItem(KEY);
        } else localStorage.removeItem(KEY);
      }
    } catch (e) {}
    apply(theme);
  } catch (e) {}
})();`;
