export const imageFieldOptions = {
  hotspot: true,
  accept: "image/*,image/svg+xml",
} as const;

export const HEX_COLOR = /^#([0-9A-Fa-f]{6})$/;

export const MONTHS = [
  { title: "January", value: "Jan" },
  { title: "February", value: "Feb" },
  { title: "March", value: "Mar" },
  { title: "April", value: "Apr" },
  { title: "May", value: "May" },
  { title: "June", value: "Jun" },
  { title: "July", value: "Jul" },
  { title: "August", value: "Aug" },
  { title: "September", value: "Sep" },
  { title: "October", value: "Oct" },
  { title: "November", value: "Nov" },
  { title: "December", value: "Dec" },
] as const;
