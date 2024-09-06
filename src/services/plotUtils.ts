export const calculateFacets = (first: string[], next: string[], ...rest: string[][]): any => {
    if (!first) return [];
    if (!next) return first.map(a => [a]);
    if (rest.length) next = calculateFacets(next, rest.shift()!!, ...rest);
    return first.flatMap(a => next.map(b => [a, b].flat()));
}

export const toFilename = (title: string) => title
    .toLowerCase()
    .trim()
    .replaceAll(/\W+/g, "_");
