const scoreL = document.querySelector("#scoreL");
const canvas = document.querySelector("canvas");
console.log(canvas);
const c = canvas.getContext("2d");

canvas.width = 1024;
canvas.height = 574;

class Player {
  constructor() {
    this.velocity = {
      x: 0,
      y: 0,
    };

    this.rotation = 0;
    this.opacity = 1;

    const image = new Image();
    image.src = "./img/spaceship.png";
    image.onload = () => {
      const scale = 0.15;
      this.image = image;
      this.width = image.width * scale;
      this.height = image.height * scale;
      this.position = {
        x: canvas.width / 2 - this.width / 2,
        y: canvas.height - this.height - 20,
      };
    };
  }

  changePosition(xPosition, yPosition) {
    this.position = {
      x: xPosition,
      y: yPosition,
    };
  }

  draw() {
    // c.fillStyle = 'red'
    // c.fillRect(this.position.x, this.position.y,
    // this.width, this.height)
    c.save();
    c.globalAlpha = this.opacity;
    c.translate(
      player.position.x + player.width / 2,
      player.position.y + player.height / 2
    );
    c.rotate(this.rotation);

    c.translate(
      -player.position.x + -player.width / 2,
      -player.position.y + -player.height / 2
    );

    c.drawImage(
      this.image,
      this.position.x,
      this.position.y,
      this.width,
      this.height
    );

    c.restore();
  }

  update() {
    if (this.image) {
      this.draw();
      this.position.x += this.velocity.x;
      this.position.y += this.velocity.y;
    }
  }
}

class Projectile {
  constructor({ position, velocity }) {
    this.position = position;
    this.velocity = velocity;

    this.radius = 4.5;
    playerShoot.play();
  }

  draw() {
    c.beginPath();
    c.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2);

    c.fillStyle = "red";
    c.fill();
    c.closePath();
  }

  update() {
    this.draw();
    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;
  }
}

class Particle {
  constructor({ position, velocity, radius, color, opacity, fades }) {
    this.position = position;
    this.velocity = velocity;

    this.radius = radius;
    this.color = color;
    this.opacity = 1;
    this.fades = fades;
  }

  draw() {
    c.save();
    c.globalAlpha = this.opacity;
    c.beginPath();
    c.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2);

    c.fillStyle = this.color;
    c.fill();
    c.closePath();
    c.restore();
  }

  update() {
    this.draw();
    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;

    if (this.fades) this.opacity -= 0.01;
  }
}
class InvaderProjectile {
  constructor({ position, velocity }) {
    this.position = position;
    this.velocity = velocity;

    this.width = 4;
    this.height = 8;
  }

  draw() {
    c.fillStyle = "yellow";
    c.fillRect(this.position.x, this.position.y, this.width, this.height);
  }

  update() {
    this.draw();
    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;
  }
}

class Invader {
  constructor({ position }) {
    this.velocity = {
      x: 0,
      y: 0,
    };

    this.rotation = 0;

    const image = new Image();
    image.src = "./img/invader.png";
    image.onload = () => {
      const scale = 0.8;
      this.image = image;
      this.width = image.width * scale;
      this.height = image.height * scale;
      this.position = {
        x: position.x,
        y: position.y,
      };
    };
  }

  draw() {
    // c.fillStyle = 'red'
    // c.fillRect(this.position.x, this.position.y,
    // this.width, this.height)

    c.drawImage(
      this.image,
      this.position.x,
      this.position.y,
      this.width,
      this.height
    );
  }

  update({ velocity }) {
    if (this.image) {
      this.draw();
      this.position.x += velocity.x;
      this.position.y += velocity.y;
    }
  }
  shoot(invaderProjectiles) {
    invaderProjectiles.push(
      new InvaderProjectile({
        position: {
          x: this.position.x + this.width / 2,
          y: this.position.y + this.height,
        },
        velocity: {
          x: 0,
          y: 5,
        },
      })
    );
  }
}

class Grid {
  constructor() {
    this.position = {
      x: 0,
      y: 0,
    };

    this.velocity = {
      x: 1.8,
      y: 0,
    };

    this.invaders = [];
    const columns = Math.floor(Math.random() * 8 + 5);
    const rows = Math.floor(Math.random() * 4 + 2);

    this.width = columns * 25;

    for (let x = 0; x < columns; x++) {
      for (let y = 0; y < rows; y++) {
        this.invaders.push(
          new Invader({
            position: {
              x: x * 25,
              y: y * 25,
            },
          })
        );
      }
    }
  }

  update() {
    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;

    this.velocity.y = 0;

    if (this.position.x + this.width >= canvas.width || this.position.x <= 0) {
      this.velocity.x = -this.velocity.x;
      this.velocity.y = 25;
    }
  }
}
const invaderProjectiles = [];
const projectiles = [];
const player = new Player();
const grids = [];
const particles = [];
let enemyExpolode = new Audio("audio/explode.wav");
enemyExpolode.volume = 0.03;
document.body.appendChild(enemyExpolode);

let playerShoot = new Audio("audio/shoot.wav");
playerShoot.volume = 0.05;
document.body.appendChild(playerShoot);

let enemyShoot = new Audio("audio/enemyShoot.wav");
enemyShoot.volume = 0.1;
document.body.appendChild(enemyShoot);

let backgroundSound = new Audio("audio/backgroundMusic.wav");
backgroundSound.volume = 0.01;
document.body.appendChild(backgroundSound);

let loseSound = new Audio("audio/gameOver.mp3");
loseSound.volume = 0.3;
document.body.appendChild(loseSound);

let randomInterval = Math.floor(Math.random() * 500 + 500);
let frames = 0;
let wait = false;
let game = {
  over: false,
  active: true,
};
let score = 0;

const startSpeed = 3.6;
const startSpeedVert = 4.2;
const dodgeSpeed = 6;
const moveBox = (canvas.height / 4) * 3;

const keys = {
  a: {
    pressed: false,
  },
  d: {
    pressed: false,
  },
  space: {
    pressed: false,
  },
  w: {
    pressed: false,
  },
  s: {
    pressed: false,
  },
  f: {
    pressed: false,
  },
};

for (let i = 0; i < 100; i++) {
  particles.push(
    new Particle({
      position: {
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
      },
      velocity: {
        x: 0,
        y: 0.4,
      },
      radius: Math.random() * 2,
      color: "white",
    })
  );
}

function createParticles({ object, color, radius, fades }) {
  for (let i = 0; i < 15; i++) {
    particles.push(
      new Particle({
        position: {
          x: object.position.x + object.width / 2,
          y: object.position.y + object.height / 2,
        },
        velocity: {
          x: (Math.random() - 0.5) * 2,
          y: (Math.random() - 0.5) * 2,
        },
        radius: radius,
        color: color || "#BAA0DE",
        fades,
      })
    );
  }
}

function animate() {
  if (!game.active) return;

  requestAnimationFrame(animate);
  c.fillStyle = "black";
  c.fillRect(0, 0, canvas.width, canvas.height);
  backgroundSound.play();
  player.update();

  particles.forEach((particle, i) => {
    if (particle.position.y - particle.radius >= canvas.height) {
      particle.position.x = Math.random() * canvas.width;
      particle.position.y = -particle.radius;
    }

    if (particle.opacity <= 0) {
      setTimeout(() => {
        particles.splice(i, 1);
      }, 0);
    } else {
      particle.update();
    }
  });
  //  console.log("showMe: ", particles);

  invaderProjectiles.forEach((invaderProjectile, index) => {
    if (
      invaderProjectile.position.y + invaderProjectile.height >=
      canvas.height
    ) {
      setTimeout(() => {
        invaderProjectiles.splice(index, 1);
      }, 0);
    } else invaderProjectile.update();

    // projectile hits player
    if (
      invaderProjectile.position.y + invaderProjectile.height >=
        player.position.y &&
      invaderProjectile.position.x + invaderProjectile.width >=
        player.position.x &&
      invaderProjectile.position.x <= player.position.x + player.width
    ) {
      loseSound.play();
      loseSound.muted = false;
      setTimeout(() => {
        invaderProjectiles.splice(index, 1);
        player.opacity = 0;
        game.over = true;
      }, 0);
      setTimeout(() => {
        game.active = false;
      }, 2000);
      console.log("you lose");

      createParticles({
        object: player,
        color: "gray",
        fades: true,
        radius: Math.random() * 4 + 1,
      });
    }
  });

  projectiles.forEach((projectile, index) => {
    if (projectile.position.y + projectile.radius <= 0) {
      setTimeout(() => {
        projectiles.splice(index, 1);
      }, 0);
    } else {
      projectile.update();
    }
  });

  grids.forEach((grid, gridIndex) => {
    grid.update();

    //spawn projectile
    if (frames % 100 === 0 && grid.invaders.length > 0) {
      grid.invaders[Math.floor(Math.random() * grid.invaders.length)].shoot(
        invaderProjectiles
      );
      enemyShoot.play();
    }

    grid.invaders.forEach((invader, i) => {
      invader.update({ velocity: grid.velocity });
      // projectiles hiiting enemy
      projectiles.forEach((projectile, j) => {
        if (
          projectile.position.y - projectile.radius <=
            invader.position.y + invader.height &&
          projectile.position.x + projectile.radius >= invader.position.x &&
          projectile.position.x - projectile.radius <=
            invader.position.x + invader.width &&
          projectile.position.y + projectile.radius >= invader.position.y
        ) {
          setTimeout(() => {
            const invaderFound = grid.invaders.find(
              (invader2) => invader2 === invader
            );

            const projectileFound = projectiles.find(
              (projectile2) => projectile2 === projectile
            );
            // remove enemy&projectile
            if (invaderFound && projectileFound) {
              enemyExpolode.play();
              score += 100;
              scoreL.innerHTML = score;
              createParticles({
                object: invader,
                fades: true,
                radius: Math.random() * 3,
              });

              grid.invaders.splice(i, 1);
              projectiles.splice(j, 1);

              if (grid.invaders.length > 0) {
                const firstInvader = grid.invaders[0];
                const lastInvader = grid.invaders[grid.invaders.length - 1];
                //             console.log("showMe: ",lastInvader
                grid.width =
                  lastInvader.position.x -
                  firstInvader.position.x +
                  lastInvader.width;
                grid.position.x = firstInvader.position.x;
              } else {
                grids.splice(gridIndex, 1);
              }
            }
          }, 0);
        }
      });
    });
  });

  if (keys.a.pressed && keys.f.pressed && player.position.x >= 0) {
    player.velocity.x = -startSpeed + -dodgeSpeed;
    player.rotation = -0.45;
  } else if (
    keys.d.pressed &&
    keys.f.pressed &&
    player.position.x + player.width <= canvas.width
  ) {
    player.velocity.x = startSpeed + dodgeSpeed;
    player.rotation = 0.45;
  } else {
    if (keys.a.pressed && player.position.x >= 0) {
      player.velocity.x = -startSpeed;
      player.rotation = -0.15;
    } else if (
      keys.d.pressed &&
      player.position.x + player.width <= canvas.width
    ) {
      player.velocity.x = startSpeed;
      player.rotation = 0.15;
    } else {
      player.velocity.x = 0;
      player.rotation = 0;
    }
  }

  if (keys.w.pressed && player.position.y >= moveBox) {
    player.velocity.y = -startSpeedVert;
  } else if (
    keys.s.pressed &&
    player.position.y + player.height <= canvas.height
  ) {
    player.velocity.y = startSpeedVert;
  } else {
    player.velocity.y = 0;
  }
  // enemies
  if (frames % randomInterval === 0) {
    grids.push(new Grid());
    randomInterval = Math.floor(Math.random() * 500 + 500);
    frames = 0;
  }

  frames++;
}

animate();

addEventListener("keydown", ({ key }) => {
  if (game.over) return;
  switch (key) {
    case "a":
      console.log("left");
      keys.a.pressed = true;
      break;
    case "d":
      console.log("right");
      keys.d.pressed = true;
      break;
    case " ":
      console.log("space");
      keys.space.pressed = true;
      projectiles.push(
        new Projectile({
          position: {
            x: player.position.x + player.width / 2,
            y: player.position.y,
          },
          velocity: {
            x: 0,
            y: -20,
          },
        })
      );
      break;
    case "w":
      console.log("up");
      keys.w.pressed = true;
      break;
    case "s":
      console.log("down");
      keys.s.pressed = true;
      break;
    case "Shift":
      console.log("dodge");
      keys.f.pressed = true;
      break;
  }
});

addEventListener("keyup", ({ key }) => {
  switch (key) {
    case "a":
      console.log("left");
      keys.a.pressed = false;
      break;
    case "d":
      console.log("right");
      keys.d.pressed = false;
      break;
    case " ":
      console.log("space");
      keys.space.pressed = false;
      break;
    case "w":
      console.log("up");
      keys.w.pressed = false;
      break;
    case "s":
      console.log("down");
      keys.s.pressed = false;
      break;
    case "Shift":
      console.log("dodge");
      keys.f.pressed = false;
      break;
  }
});
