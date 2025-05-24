function factorial(n) {
    var res = 1;
    for(var i = 2; i < n + 1; i++) {
        res *= i;
    }
    return res;
}

function nCr(n, r) {
    return factorial(n)/(factorial(n - r) * factorial(r));
}

function getBezierCurve(controlPoints, samples) {
    const bezierCurve = [];
    const n = controlPoints.length - 1;
    for(var i = 0; i < samples; i++) {
        const t = mapRange(i, 0, samples - 1, 0, 1);
        const curvePoint = [0, 0];
        for(var j = 0; j <= n; j++) {
            const scalar = nCr(n, j) * Math.pow(1 - t, n - j) * Math.pow(t, j);
            curvePoint[0] += scalar * controlPoints[j][0];
            curvePoint[1] += scalar * controlPoints[j][1];
        }
        bezierCurve.push(curvePoint);
    }
    return bezierCurve;
}