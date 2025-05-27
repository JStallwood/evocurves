function fitnessCalculator() {
    const GOODIES = [
        [200, 500],
        [600, 300]
    ];

    const BADDIES = [
        [600, 500],
        [200, 300]
    ];

    const CONTROLPOINTS = [];
    CONTROLPOINTS.push([0, 400]);
    for(var i = 1; i <= 7; i++) {
        const xval = document.getElementById("inpx" + i.toString()).value;
        const yval = document.getElementById("inpy" + i.toString()).value;
        if(xval !== "" && yval !== "") {
            CONTROLPOINTS.push([parseInt(xval), parseInt(yval)]);
        }
    }
    CONTROLPOINTS.push([800, 400]);

    const BEZIER = getBezierCurve(CONTROLPOINTS, 200);
    const fitness = calculateFitness(GOODIES, BADDIES, BEZIER, CONTROLPOINTS);

    const FITNESS_H = document.getElementById("fit-h");
    FITNESS_H.innerHTML = `\\(\\phi(h) = ${fitness.toFixed(4)}\\)`;
    MathJax.typeset();

    const CHECKER_S = document.getElementById("sk-chk");
    CHECKER_S.innerHTML = "";
    new p5(CHECKERSKETCH(CHECKER_S, CONTROLPOINTS, BEZIER, GOODIES, BADDIES), "sk-chk");
    
}

function calculateFitness(GOODIES, BADDIES, BEZIER, CONTROLPOINTS) {
    const r = 20;
    var goodScore = 0;
    for(var i = 0; i < GOODIES.length; i++) {
        const g = GOODIES[i];
        for(var j = 0; j < BEZIER.length; j++) {
            const b = BEZIER[j];
            const diffX = g[0] - b[0];
            const diffY = g[1] - b[1];
            const dist = Math.sqrt(diffX * diffX + diffY * diffY);
            if(dist <= r) {
                goodScore += 1;
                break;
            }
        }
    }
    var badScore = 0;
    for(var i = 0; i < BADDIES.length; i++) {
        const g = BADDIES[i];
        for(var j = 0; j < BEZIER.length; j++) {
            const b = BEZIER[j];
            const diffX = g[0] - b[0];
            const diffY = g[1] - b[1];
            const dist = Math.sqrt(diffX * diffX + diffY * diffY);
            if(dist <= r) {
                badScore += 1;
                break;
            }
        }
    }
    return (goodScore - badScore) / CONTROLPOINTS.length;
}

document.fitnessCalculator = fitnessCalculator;
