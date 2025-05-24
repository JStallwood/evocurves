

const HYPOTHESIS_GEN = (CONTAINER, TABLE, FITNESS_P) => {
    return (p) => {
        const W = CONTAINER.offsetWidth;
        const H = CONTAINER.offsetHeight;

        const MINW = W * 0.1;
        const MAXW = W * 0.9;
        const MINH = H * 0.9;
        const MAXH = H * 0.1;

        const RESOLUTION_W = [0, 800];
        const RESOLUTION_H = [0, 800];

        const CONTROLPOINTS = [];

        const GOODIES = [
            [200, 500],
            [600, 300]
        ];

        const BADDIES = [
            [600, 500],
            [200, 300]
        ];

        const MAPPED_G = GOODIES.map(v => [
            mapRange(v[0], RESOLUTION_W[0], RESOLUTION_W[1], MINW, MAXW),
            mapRange(v[1], RESOLUTION_H[0], RESOLUTION_H[1], MINH, MAXH)
        ]);

        const MAPPED_B = BADDIES.map(v => [
            mapRange(v[0], RESOLUTION_W[0], RESOLUTION_W[1], MINW, MAXW),
            mapRange(v[1], RESOLUTION_H[0], RESOLUTION_H[1], MINH, MAXH)
        ]);

        p.setup = function() {

            CONTROLPOINTS.push([RESOLUTION_W[0], RESOLUTION_H[1] * 0.5]);
            const N = randomInt(3, 5);
            const BLOCK_WIDTH = RESOLUTION_W[1]/(N + 1);
            for(var i = 0; i < N; i++) {
                CONTROLPOINTS.push([
                    (BLOCK_WIDTH * i) + randomInt(0, BLOCK_WIDTH),
                    randomInt(0, 800)
                ]);
            }
            CONTROLPOINTS.push([RESOLUTION_W[1], RESOLUTION_H[1] * 0.5]);

            const MAPPED_CP = CONTROLPOINTS.map(v => [
                mapRange(v[0], RESOLUTION_W[0], RESOLUTION_W[1], MINW, MAXW),
                mapRange(v[1], RESOLUTION_H[0], RESOLUTION_H[1], MINH, MAXH)
            ]);

            const BEZIER = getBezierCurve(CONTROLPOINTS, 200);
            const MAPPED_BC = BEZIER.map(v => [
                mapRange(v[0], RESOLUTION_W[0], RESOLUTION_W[1], MINW, MAXW),
                mapRange(v[1], RESOLUTION_H[0], RESOLUTION_H[1], MINH, MAXH)
            ]);

            p.createCanvas(W, H);

            p.background(COLORS[0]);

            p.stroke(COLORS[3]);
            p.strokeWeight(W * 0.005);
            p.noFill();
            p.beginShape();
            MAPPED_BC.forEach(v => p.vertex(v[0], v[1]));
            p.endShape();

            for(var i = 0; i < MAPPED_CP.length; i++) {
                let v = MAPPED_CP[i];
                p.stroke(COLORS[3]);
                p.strokeWeight(W * 0.03);
                p.point(v[0], v[1]);
                p.textSize(W * 0.015);
                p.textAlign(p.CENTER, p.CENTER);
                p.fill(255);
                p.noStroke();
                p.text(i.toString(), v[0], v[1]);
                if(i === 0 || i === MAPPED_CP.length - 1) {
                    p.fill(COLORS[3]);
                    p.text(`(${CONTROLPOINTS[i][0]}, ${CONTROLPOINTS[i][1]})`, v[0], v[1] + W * 0.045);
                }
                
            }

            p.stroke(COLORS[1]);
            p.strokeWeight(W * 0.035);
            MAPPED_G.forEach(v => p.point(v[0], v[1]));

            p.noStroke();
            p.fill(COLORS[2]);
            p.rectMode(p.CENTER);
            MAPPED_B.forEach(v => p.rect(v[0], v[1], W * 0.035));

            TABLE.innerHTML = "";
            for(var i = 1; i < CONTROLPOINTS.length - 1; i++) {
                const cp = CONTROLPOINTS[i];
                const tr = document.createElement("tr");
                const th = document.createElement("th");
                const td = document.createElement("td");
                th.innerHTML = `\\(\\boldsymbol{P}_{${i}} = \\)`;
                td.innerHTML = `(${cp[0].toFixed(0)}, ${cp[1].toFixed(0)})`
                tr.append(th, td);
                TABLE.appendChild(tr);
            }

            const fitness = calculateFitness(GOODIES, BADDIES, BEZIER);
            FITNESS_P.innerHTML = `\\(\\phi(h) = ${fitness.toFixed(4)}\\)`;

            MathJax.typeset();
        }

        function calculateFitness(GOODIES, BADDIES, BEZIER) {
            const r = W * 0.0175;
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
    };
}

function makeNewHypothesis() {
    const HYP_CONTAINER = document.getElementById("sk-hyp");
    const HYP_TBL = document.getElementById("hyp-tbl");
    const FIT_P = document.getElementById("hyp-fit");
    HYP_CONTAINER.innerHTML = "";
    new p5(HYPOTHESIS_GEN(HYP_CONTAINER, HYP_TBL, FIT_P), "sk-hyp");
}

makeNewHypothesis();

document.makeNewHypothesis = makeNewHypothesis;