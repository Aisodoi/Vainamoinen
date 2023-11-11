export const classnames = (
    ...classnames: (string | null | undefined)[]
  ): string => {
    return classnames.filter(String).join(" ");
  };

export const getGlobalColor = (color: string = "orange") => {
  return `globalColor${color}`;
};
  