let pathname = "/en";

export function setMockPathname(nextPathname: string) {
  pathname = nextPathname;
}

export function getMockPathname() {
  return pathname;
}

export function resetMockPathname() {
  pathname = "/en";
}
