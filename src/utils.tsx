export const classnames = (
  ...classnames: (string | null | undefined)[]
): string => {
  return classnames.filter(String).join(" ");
};
