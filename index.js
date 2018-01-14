const c = document.getElementById("canvas");
const ctx = c.getContext("2d");
const infoTextArea = document.getElementById('info');

const world = {
    size: [512, 512],
    forceStrength: 100,
    quarkCount: 5
};
const charges = ['red', 'green', 'blue'];

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

let quarks = [];

for (let i = 0; i < world.quarkCount; i++) {
    quarks.push(
        {
            position: [getRandomInt(0, world.size[0]), getRandomInt(0, world.size[1])],
            charge: getRandomInt(0, 2)
        },
    )
}

const player = {
    position: [world.size[0] / 2, world.size[1] / 2],
    velocity: [0, 0],
    charge: 0
};

function doPhysics() {
    let totalForceVector = [0, 0];
    quarks.forEach((quark, i) => {
        const polarityFactor = (quark.charge === player.charge ? -1 : 1);
        const distance = [quark.position[0] - player.position[0], quark.position[1] - player.position[1]];
        const distanceToPlayer = Math.sqrt(Math.pow(distance[0], 2) + Math.pow(distance[1], 2));
        const angle = Math.atan2(distance[1], distance[0]);
        let force = world.forceStrength / Math.pow(distanceToPlayer, 2) * polarityFactor;
        if (distanceToPlayer < 10) {
            force = 0;
        }
        const forceVector = [force * Math.cos(angle), force * Math.sin(angle)];
        totalForceVector[0] = totalForceVector[0] + forceVector[0];
        totalForceVector[1] = totalForceVector[1] + forceVector[1];
    });
    const totalVelocity = Math.sqrt(Math.pow(player.velocity[0], 2) + Math.pow(player.velocity[1], 2));
    player.velocity[0] += totalForceVector[0];
    player.velocity[1] += totalForceVector[1];
    player.position[0] += player.velocity[0];
    player.position[1] += player.velocity[1];

    if (player.position[0] > world.size[0] || player.position[0] < 0) {
        player.velocity[0] = player.velocity[0] * -1;
    }
    if (player.position[1] > world.size[1] || player.position[1] < 0) {
        player.velocity[1] = player.velocity[1] * -1;

    }

    infoTextArea.value = (
        'Velocity' + ': ' + totalVelocity.toFixed(2) + '\n' +
        (totalVelocity >= 10 ? '(!) Winning (!)' : '') + '\n\n\n' +
        'Fx' + ': ' + totalForceVector[0].toFixed(2) + '\n' +
        'Fy' + ': ' + totalForceVector[1].toFixed(2) + '\n' +
        'Vx' + ': ' + player.velocity[0].toFixed(2) + '\n' +
        'Vy' + ': ' + player.velocity[1].toFixed(2) + '\n' +
        'Px' + ': ' + player.position[0].toFixed(2) + '\n' +
        'Py' + ': ' + player.position[1].toFixed(2) + '\n'
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
    ctx.arc(player.position[0], player.position[1], 5, 0, 2 * Math.PI);
    ctx.fillStyle = charges[player.charge];
    ctx.fill();
    ctx.arc(player.position[0], player.position[1], 5, 0, 2 * Math.PI);
    ctx.stroke();

    const velocityLineMultiplier = 10;
    ctx.moveTo(player.position[0], player.position[1]);
    ctx.lineTo(
        player.position[0] - player.velocity[0] * velocityLineMultiplier,
        player.position[1] - player.velocity[1] * velocityLineMultiplier
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
            player.charge = 0;
            break;
        case 's':
            player.charge = 1;
            break;
        case 'd':
            player.charge = 2;
            break;
    }
});
