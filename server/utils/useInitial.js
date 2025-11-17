// server/utils/useInitial.js

export default async function useInitial(name) {
  const nameParts = name.trim().split(' ');

  let initials = nameParts[0].charAt(0).toUpperCase();

  if (nameParts.length > 1) {
    initials += nameParts[1].charAt(0).toUpperCase();
  }
  else if (nameParts[0].length > 1) {
    initials += nameParts[0].charAt(1).toLowerCase();
  }

  return initials;
}
