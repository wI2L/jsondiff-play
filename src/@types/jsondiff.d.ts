declare function jsondiffCompare(
    source: string,
    target: string,
    invertible: boolean,
    factorize: boolean,
    rationalize: boolean,
    equivalent: boolean,
    lcs: boolean
): {
    error: string
    patch: string
}
