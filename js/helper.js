function mapRange(value, minimum, maximum, from, to) {
    const scalar = (maximum - minimum === 0) ? 0 : (value - minimum)/(maximum - minimum);
    return from + scalar * (to - from);
}

function randomRange(a, b) {
    return a + Math.random() * (b - a);
}

function randomInt(a, b) {
    return Math.round(randomRange(a, b));
}