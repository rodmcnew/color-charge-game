const c = document.getElementById("canvas");
const ctx = c.getContext("2d");
const infoTextArea = document.getElementById('info');

const world = {
    size: [512, 512],
    forceStrength: 100,
    maxVelocity: Number.POSITIVE_INFINITY,
    quarkCount: 3
};
const charges = ['red', 'green', 'blue'];

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

const quarks = [
    // {
    //     position: [128, 256],
    //     charge: 'green'
    // },
    {
        position: [getRandomInt(0, world.size[0]), getRandomInt(0, world.size[1])],
        charge: 'red'
    },
    {
        position: [getRandomInt(0, world.size[0]), getRandomInt(0, world.size[1])],
        charge: 'green'
    },
    {
        position: [getRandomInt(0, world.size[0]), getRandomInt(0, world.size[1])],
        charge: 'blue'
    },
];
// for (let i = 0; i < world.quarkCount; i++) {
//     quarks.push(
//         {
//             position: [getRandomInt(0, world.size[0]), getRandomInt(0, world.size[1])],
//             charge: charges[getRandomInt(0, 2)]
//         },
//     )
// }


const player = {
    position: [world.size[0] / 2, world.size[1] / 2],
    velocity: [0, .5],
    charge: 'red'
};

let frame = 0;
setInterval(() => {
    frame++;
    ctx.clearRect(0, 0, c.width, c.height);
    quarks.forEach((quark) => {
        ctx.beginPath();
        ctx.arc(quark.position[0], quark.position[1], 5, 0, 2 * Math.PI);
        ctx.fillStyle = quark.charge;
        ctx.fill();
    });

    ctx.beginPath();
    ctx.arc(player.position[0], player.position[1], 5, 0, 2 * Math.PI);
    ctx.fillStyle = player.charge;
    ctx.fill();
    ctx.arc(player.position[0], player.position[1], 5, 0, 2 * Math.PI);
    ctx.stroke();

    let totalForceVector = [0, 0];
    quarks.forEach((quark, i) => {
        const polarityFactor = (quark.charge === player.charge ? -1 : 1);
        const distance = [quark.position[0] - player.position[0], quark.position[1] - player.position[1]];
        const distanceToPlayer = Math.sqrt(Math.pow(distance[0], 2) + Math.pow(distance[1], 2));
        const angle = Math.atan2(distance[1], distance[0]);
        // const force = world.forceStrength / distanceToPlayer;
        let force = world.forceStrength / Math.pow(distanceToPlayer, 2) * polarityFactor;
        if (distanceToPlayer < 10) {
            force = 0;
        }
        // console.log(force);
        const forceVector = [force * Math.cos(angle), force * Math.sin(angle)];
        // if (distanceToPlayer < 10) {
        //     forceVector[0] = forceVector[0] * -1;
        //     forceVector[1] = forceVector[1] * -1;
        // }
        totalForceVector[0] = totalForceVector[0] + forceVector[0];
        totalForceVector[1] = totalForceVector[1] + forceVector[1];
    });

    // const totalForce = Math.sqrt(Math.pow(totalForceVector[0], 2) + Math.pow(totalForceVector[1], 2));
    const totalVelocity = Math.sqrt(Math.pow(player.velocity[0], 2) + Math.pow(player.velocity[1], 2));
    const nextTotalVelocity = Math.sqrt(
        Math.pow(player.velocity[0] + totalForceVector[0], 2)
        + Math.pow(player.velocity[1] + totalForceVector[1], 2)
    );
    let atMaxV = false;
    if (nextTotalVelocity > world.maxVelocity) {
        atMaxV = true;
    } else {
        player.velocity[0] += totalForceVector[0];
        player.velocity[1] += totalForceVector[1];
    }
    player.position[0] += player.velocity[0];
    player.position[1] += player.velocity[1];

    if (player.position[0] > world.size[0] || player.position[0] < 0) {
        player.velocity[0] = player.velocity[0] * -1;
    }
    if (player.position[1] > world.size[1] || player.position[1] < 0) {
        player.velocity[1] = player.velocity[1] * -1;

    }

    const velocityLineMultiplier = 10;
    ctx.moveTo(player.position[0], player.position[1]);
    ctx.lineTo(
        player.position[0] - player.velocity[0] * velocityLineMultiplier,
        player.position[1] - player.velocity[1] * velocityLineMultiplier
    );
    ctx.stroke();

    // if (player.position[0] > world.size[0]) {
    //     player.velocity[0] = 0;
    //     player.position[0] = world.size[0]
    // }
    // if (player.position[0] < 0) {
    //     player.velocity[0] = 0;
    //     player.position[0] = 0;
    // }
    // if (player.position[1] > world.size[1]) {
    //     player.velocity[1] = 0;
    //     player.position[1] = world.size[1]
    // }
    // if (player.position[1] < 0) {
    //     player.velocity[1] = 0;
    //     player.position[1] = 0;
    // }
    infoTextArea.value = (
        // 'Frame' + ': ' + frame + '\n' +
        // 'Force' + ': ' + totalForce + '\n' +
        // 'Fx' + ': ' + totalForceVector[0] + '\n' +
        // 'Fy' + ': ' + totalForceVector[1] + '\n' +
        'Velocity' + ': ' + totalVelocity.toFixed(2) + (atMaxV ? ' (!)' : '') + '\n' +
        (totalVelocity >= 10 ? '(!) Winning (!)' : '') + '\n' +
        'You are the moving particle.\nLike colors repel.\nDifferent colors attract.\nUse "W", "S", and "D" to change you color.\n' +
        'Get your velocity above 10 to win the game.\nCmd + R to restart.'
        // 'Vx' + ': ' + player.velocity[0] + '\n' +
        // 'Vy' + ': ' + player.velocity[1] + '\n' +
        // 'Px' + ': ' + player.position[0] + '\n' +
        // 'Py' + ': ' + player.position[1] + '\n'
    );
}, 10);

document.body.addEventListener('keydown', (e) => {
    switch (e.key) {
        case 'a':
            player.charge = 'red';
            break;
        case 's':
            player.charge = 'green';
            break;
        case 'd':
            player.charge = 'blue';
            break;
    }
});
