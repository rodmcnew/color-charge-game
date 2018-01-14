const c = document.getElementById("canvas");
const ctx = c.getContext("2d");
const infoTextArea = document.getElementById('info');

const world = {
    size: [1024, 768],
    forceStrength: 100,
    quarkCount: 6,
    otherQuarksMove: false
};
c.width = world.size[0];
c.height = world.size[1];
const charges = ['red', 'green', 'blue'];
const antiCharges = ['cyan', 'pink', 'yellow'];

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

let quarks = [];

for (let i = 0; i < world.quarkCount; i++) {
    quarks.push(
        {
            position: [
                getRandomInt(0, world.size[0] / 2) + world.size[0] / 4,
                getRandomInt(0, world.size[1] / 2) + world.size[1] / 4
            ],
            velocity: [0, 0],
            charge: getRandomInt(0, 2)
        },
    )
}

function doPhysics() {
    quarks.forEach((quark, i) => {
        if (i > 0 && !world.otherQuarksMove) {
            return; //Disable having all quarks move
        }
        let totalForceVector = [0, 0];
        quarks.forEach((otherQuark, otherI) => {
            if (i === otherI) {
                return;
            }
            const polarityFactor = (quark.charge === otherQuark.charge ? 1 : -1);
            const distance = [quark.position[0] - otherQuark.position[0], quark.position[1] - otherQuark.position[1]];
            const totalDistance = Math.sqrt(Math.pow(distance[0], 2) + Math.pow(distance[1], 2));
            const angle = Math.atan2(distance[1], distance[0]);
            let force = world.forceStrength / Math.pow(totalDistance, 2) * polarityFactor;
            if (world.otherQuarksMove) {
                force = force / 2;
            }
            if (totalDistance < 10) {
                force = 0;
            }
            const forceVector = [force * Math.cos(angle), force * Math.sin(angle)];
            totalForceVector[0] = totalForceVector[0] + forceVector[0];
            totalForceVector[1] = totalForceVector[1] + forceVector[1];
        });
        quark.velocity[0] += totalForceVector[0];
        quark.velocity[1] += totalForceVector[1];
        quark.position[0] += quark.velocity[0];
        quark.position[1] += quark.velocity[1];

        if (quark.position[0] > world.size[0] || quark.position[0] < 0) {
            quark.velocity[0] = quark.velocity[0] * -1;
        }
        if (quark.position[1] > world.size[1] || quark.position[1] < 0) {
            quark.velocity[1] = quark.velocity[1] * -1;

        }
    });
    const totalVelocity = Math.sqrt(Math.pow(quarks[0].velocity[0], 2) + Math.pow(quarks[0].velocity[1], 2));

    infoTextArea.value = (
        'Velocity' + ': ' + totalVelocity.toFixed(2) + '\n' +
        (totalVelocity >= 10 ? '(!) Winning (!)' : '') + '\n\n\n'
        // 'Fx' + ': ' + totalForceVector[0].toFixed(2) + '\n' +
        // 'Fy' + ': ' + totalForceVector[1].toFixed(2) + '\n' +
        // 'Vx' + ': ' + quarks[0].velocity[0].toFixed(2) + '\n' +
        // 'Vy' + ': ' + quarks[0].velocity[1].toFixed(2) + '\n' +
        // 'Px' + ': ' + quarks[0].position[0].toFixed(2) + '\n' +
        // 'Py' + ': ' + quarks[0].position[1].toFixed(2) + '\n'
    );

}

function render() {
    ctx.clearRect(0, 0, c.width, c.height);
    quarks.forEach((quark) => {
        ctx.beginPath();
        ctx.arc(quark.position[0], quark.position[1], 5, 0, 2 * Math.PI);
        ctx.fillStyle = charges[quark.charge];
        ctx.fill();
    });

    ctx.beginPath();
    ctx.arc(quarks[0].position[0], quarks[0].position[1], 5, 0, 2 * Math.PI);
    // ctx.strokeStyle = antiCharges[quarks[0].charge];
    ctx.stroke();

    const velocityLineMultiplier = 10;
    ctx.moveTo(quarks[0].position[0], quarks[0].position[1]);
    ctx.lineTo(
        quarks[0].position[0] - quarks[0].velocity[0] * velocityLineMultiplier,
        quarks[0].position[1] - quarks[0].velocity[1] * velocityLineMultiplier
    );
    ctx.stroke();
}

setInterval(() => {
    doPhysics();
    render();
}, 10);

document.body.addEventListener('keydown', (e) => {
    switch (e.key) {
        case 'a':
            quarks[0].charge = 0;
            break;
        case 's':
            quarks[0].charge = 1;
            break;
        case 'd':
            quarks[0].charge = 2;
            break;
    }
});
