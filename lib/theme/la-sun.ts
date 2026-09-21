const DAY_MS = 86400000;
const J1970 = 2440588;
const J2000 = 2451545;
const J0 = 0.0009;
const RAD = Math.PI / 180;
const E = RAD * 23.4397;
const SUNSET_ANGLE = (-0.833) * RAD;

function toJulian(date: Date) {
  return date.valueOf() / DAY_MS - 0.5 + J1970;
}

function fromJulian(j: number) {
  return new Date((j + 0.5 - J1970) * DAY_MS);
}

function toDays(date: Date) {
  return toJulian(date) - J2000;
}

function solarMeanAnomaly(d: number) {
  return RAD * (357.5291 + 0.98560028 * d);
}

function eclipticLongitude(M: number) {
  const C =
    RAD * (1.9148 * Math.sin(M) + 0.02 * Math.sin(2 * M) + 0.0003 * Math.sin(3 * M));
  return M + C + RAD * 102.9372 + Math.PI;
}

function declination(l: number) {
  return Math.asin(Math.sin(l) * Math.cos(E));
}

function julianCycle(d: number, lw: number) {
  return Math.round(d - J0 - lw / (2 * Math.PI));
}

function approxTransit(Ht: number, lw: number, n: number) {
  return J0 + (Ht + lw) / (2 * Math.PI) + n;
}

function solarTransitJ(ds: number, M: number, L: number) {
  return J2000 + ds + 0.0053 * Math.sin(M) - 0.0069 * Math.sin(2 * L);
}

function hourAngle(h: number, phi: number, dec: number) {
  return Math.acos(
    (Math.sin(h) - Math.sin(phi) * Math.sin(dec)) /
      (Math.cos(phi) * Math.cos(dec)),
  );
}

export type SunTimes = {
  sunrise: Date;
  sunset: Date;
};

/** Official sunrise/sunset (−0.833°) for the solar day of `date`. */
export function getSunTimes(date: Date, lat: number, lng: number): SunTimes {
  const lw = RAD * -lng;
  const phi = RAD * lat;
  const d = toDays(date);
  const n = julianCycle(d, lw);
  const ds = approxTransit(0, lw, n);
  const M = solarMeanAnomaly(ds);
  const L = eclipticLongitude(M);
  const dec = declination(L);
  const Jnoon = solarTransitJ(ds, M, L);
  const w = hourAngle(SUNSET_ANGLE, phi, dec);
  const a = approxTransit(w, lw, n);
  const Jset = solarTransitJ(a, M, L);
  const Jrise = Jnoon - (Jset - Jnoon);
  return { sunrise: fromJulian(Jrise), sunset: fromJulian(Jset) };
}

export function sunTheme(now: Date, times: SunTimes): "light" | "dark" {
  return now >= times.sunrise && now < times.sunset ? "light" : "dark";
}

export function nextSolarBoundary(
  now: Date,
  times: SunTimes,
  lat: number,
  lng: number,
): Date {
  if (now < times.sunrise) return times.sunrise;
  if (now < times.sunset) return times.sunset;
  return getSunTimes(new Date(now.getTime() + DAY_MS), lat, lng).sunrise;
}
