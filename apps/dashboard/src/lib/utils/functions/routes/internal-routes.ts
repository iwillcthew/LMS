const retiredPages = [
  /^\/org\/[^/]+\/(landingpage|widgets)(\/|$)/,
  /^\/org\/[^/]+\/settings\/(billing|domains)(\/|$)/,
  /^\/(widgets|widget-preview|pages|join-academy)(\/|$)/
];

export function isRetiredPage(pathname: string): boolean {
  return retiredPages.some((pattern) => pattern.test(pathname));
}

export function isEmployeeContentPage(pathname: string): boolean {
  return /^\/(courses|course|lms|home)(\/|$)/.test(pathname);
}
