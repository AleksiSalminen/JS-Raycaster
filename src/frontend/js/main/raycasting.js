

function castRay(map, player, players, point, angle, range) {
    let sin = Math.sin(angle);
    let cos = Math.cos(angle);
    let noWall = { length2: Infinity };

    return ray({ x: point.x, y: point.y, height: 0, distance: 0 });

    function ray(origin) {
        let stepX = step(sin, cos, origin.x, origin.y);
        let stepY = step(cos, sin, origin.y, origin.x, true);
        let nextStep = stepX.length2 < stepY.length2
            ? inspect(stepX, 1, 0, origin.distance, stepX.y)
            : inspect(stepY, 0, 1, origin.distance, stepY.x);

        if (nextStep.distance > range) return [origin];
        return [origin].concat(ray(nextStep));
    }

    function step(rise, run, x, y, inverted) {
        if (run === 0) return noWall;
        let dx = run > 0 ? Math.floor(x + 1) - x : Math.ceil(x - 1) - x;
        let dy = dx * (rise / run);
        return {
            x: inverted ? y + dy : x + dx,
            y: inverted ? x + dx : y + dy,
            length2: dx * dx + dy * dy
        };
    }

    function inspect(step, shiftX, shiftY, distance, offset) {
        let dx = cos < 0 ? shiftX : 0;
        let dy = sin < 0 ? shiftY : 0;
        step.height = getMapTile(step.x - dx, step.y - dy);
        step.distance = distance + Math.sqrt(step.length2);
        step.playerHit = getPlayerHit(step.x - dx, step.y - dy);
        if (shiftX) step.shading = cos < 0 ? 2 : 0;
        else step.shading = sin < 0 ? 2 : 1;
        step.offset = offset - Math.floor(offset);
        return step;
    }

    function getMapTile(x, y) {
        x = Math.floor(x);
        y = Math.floor(y);
        if (x < 0 || x > map.size - 1 || y < 0 || y > map.size - 1) return -1;
        return map.wallGrid[y * map.size + x];
    };

    function getPlayerHit(x, y) {
        for (let plI = 0;plI < players.length;plI++) {
            const chosenPlayer = players[plI];
            if (chosenPlayer.number !== player.number) {
                if (Math.floor(chosenPlayer.pos.x) - Math.floor(x)
                 && Math.floor(chosenPlayer.pos.y) - Math.floor(y)) {
                    return checkTileForPlayer(chosenPlayer, {x,y});
                }
            }
        }
        return undefined;
    }

    function checkTileForPlayer (player, rayPos) {
        const increment = 0.1;
        const accuracy = 1;
        const plPos = {
            x: player.pos.x,
            y: player.pos.y
        };
        let rayOutsideBounds = false;
        let tile = {
            x: Math.floor(rayPos.x),
            y: Math.floor(rayPos.y)
        }
        let plRay = {
            x: rayPos.x,
            y: rayPos.y,
            distance: 0
        };
        while (!rayOutsideBounds) {
            // Check if ray is very close to the player
            if (Math.abs(plRay.x - plPos.x) <= accuracy
             && Math.abs(plRay.y - plPos.y) <= accuracy) {
                plRay.player = player;
                return plRay;
            }

            // Update the ray
            plRay.x += cos * increment;
            plRay.y += sin * increment;
            plRay.distance += increment;

            // If ray went over to other tile
            if (Math.floor(plRay.x) !== tile.x
             || Math.floor(plRay.y) !== tile.y) {
                rayOutsideBounds = true;
            }
        }

        return undefined;
    }
};


const RAYCASTING = {
    castRay
};

export {
    RAYCASTING
};

