/* =========================================
   MODO ESCURO
========================================= */

const themeToggle =
    document.getElementById("theme-toggle");


themeToggle.addEventListener(
    "click",
    function () {

        document.body.classList.toggle(
            "dark-mode"
        );


        if (
            document.body.classList.contains(
                "dark-mode"
            )
        ) {

            themeToggle.textContent = "☀️";

        } else {

            themeToggle.textContent = "🌙";

        }

    }
);



/* =========================================
   CANVAS
========================================= */

const canvas =
    document.getElementById("particles");


const ctx =
    canvas.getContext("2d");


let width;
let height;

let particles = [];



/* =========================================
   CONFIGURAÇÕES
========================================= */

const config = {

    /*
        Quantidade de partículas.

        90 = leve e elegante
        130 = mais cheio
    */

    particleCount: 90,


    /*
        Distância máxima para
        criar as linhas.
    */

    connectionDistance: 140,


    /*
        Velocidade normal.
    */

    speed: 0.22,


    /*
        Tamanho das partículas.
    */

    minSize: 1,

    maxSize: 2,


    /*
        Distância de influência
        do mouse.
    */

    mouseRadius: 180,


    /*
        Força com que as partículas
        acompanham o mouse.
    */

    mouseForce: 0.015,


    /*
        Velocidade máxima.
    */

    maxSpeed: 0.8
};



/* =========================================
   MOUSE
========================================= */

const mouse = {

    x: null,

    y: null,

    lastX: null,

    lastY: null,

    vx: 0,

    vy: 0
};



/* =========================================
   MOVIMENTO DO MOUSE
========================================= */

window.addEventListener(
    "mousemove",
    function (event) {

        const newX =
            event.clientX;

        const newY =
            event.clientY;


        /*
            Calcula quanto o mouse
            se movimentou.
        */

        if (mouse.x !== null) {

            mouse.vx =
                newX - mouse.x;

            mouse.vy =
                newY - mouse.y;
        }


        mouse.lastX =
            mouse.x;

        mouse.lastY =
            mouse.y;


        mouse.x =
            newX;

        mouse.y =
            newY;

    }
);



/* =========================================
   MOUSE SAI DA TELA
========================================= */

window.addEventListener(
    "mouseleave",
    function () {

        mouse.x = null;

        mouse.y = null;

        mouse.vx = 0;

        mouse.vy = 0;

    }
);



/* =========================================
   TOUCH / CELULAR
========================================= */

window.addEventListener(
    "touchmove",
    function (event) {

        if (
            !event.touches.length
        ) {

            return;
        }


        const touch =
            event.touches[0];


        mouse.x =
            touch.clientX;

        mouse.y =
            touch.clientY;

    },
    {
        passive: true
    }
);


window.addEventListener(
    "touchend",
    function () {

        mouse.x = null;

        mouse.y = null;

        mouse.vx = 0;

        mouse.vy = 0;

    }
);



/* =========================================
   TAMANHO DO CANVAS
========================================= */

function resizeCanvas() {

    width =
        canvas.width =
        window.innerWidth;


    height =
        canvas.height =
        window.innerHeight;


    createParticles();
}



window.addEventListener(
    "resize",
    resizeCanvas
);



/* =========================================
   CRIAR PARTÍCULAS
========================================= */

function createParticles() {

    particles = [];


    for (
        let i = 0;
        i < config.particleCount;
        i++
    ) {

        particles.push({

            x:
                Math.random() *
                width,


            y:
                Math.random() *
                height,


            /*
                Movimento aleatório.
            */

            vx:
                (
                    Math.random() -
                    0.5
                ) *
                config.speed,


            vy:
                (
                    Math.random() -
                    0.5
                ) *
                config.speed,


            size:
                config.minSize +
                Math.random() *
                (
                    config.maxSize -
                    config.minSize
                )

        });

    }
}



/* =========================================
   ATUALIZAR PARTÍCULA
========================================= */

function updateParticle(
    particle
) {


    /*
        Movimento normal.
    */

    particle.x +=
        particle.vx;

    particle.y +=
        particle.vy;



    /* =====================================
       MOUSE
    ====================================== */

    if (
        mouse.x !== null &&
        mouse.y !== null
    ) {

        const dx =
            mouse.x -
            particle.x;


        const dy =
            mouse.y -
            particle.y;


        const distance =
            Math.sqrt(
                dx * dx +
                dy * dy
            );


        /*
            Só afeta partículas
            próximas do cursor.
        */

        if (
            distance <
                config.mouseRadius &&
            distance > 0
        ) {


            /*
                Quanto mais perto,
                maior a força.
            */

            const force =
                (
                    config.mouseRadius -
                    distance
                ) /
                config.mouseRadius;


            /*
                Faz a partícula
                acompanhar o mouse.
            */

            particle.vx +=
                (
                    dx /
                    distance
                ) *
                force *
                config.mouseForce;


            particle.vy +=
                (
                    dy /
                    distance
                ) *
                force *
                config.mouseForce;


            /*
                Adiciona parte da
                velocidade do mouse.
            */

            particle.vx +=
                mouse.vx *
                force *
                0.002;


            particle.vy +=
                mouse.vy *
                force *
                0.002;

        }

    }



    /* =====================================
       LIMITAR VELOCIDADE
    ====================================== */

    const maxSpeed =
        config.maxSpeed;


    const currentSpeed =
        Math.sqrt(
            particle.vx *
                particle.vx +
            particle.vy *
                particle.vy
        );


    if (
        currentSpeed >
        maxSpeed
    ) {

        particle.vx =
            (
                particle.vx /
                currentSpeed
            ) *
            maxSpeed;


        particle.vy =
            (
                particle.vy /
                currentSpeed
            ) *
            maxSpeed;
    }



    /* =====================================
       DESACELERAÇÃO
    ====================================== */

    particle.vx *= 0.995;

    particle.vy *= 0.995;



    /*
        Se ficar muito lento,
        recupera o movimento.
    */

    if (
        Math.abs(particle.vx) <
        0.02
    ) {

        particle.vx +=
            (
                Math.random() -
                0.5
            ) *
            0.01;
    }


    if (
        Math.abs(particle.vy) <
        0.02
    ) {

        particle.vy +=
            (
                Math.random() -
                0.5
            ) *
            0.01;
    }



    /* =====================================
       TELETRANSPORTE NAS BORDAS
    ====================================== */

    if (
        particle.x < 0
    ) {

        particle.x =
            width;
    }


    if (
        particle.x > width
    ) {

        particle.x = 0;
    }


    if (
        particle.y < 0
    ) {

        particle.y =
            height;
    }


    if (
        particle.y > height
    ) {

        particle.y = 0;
    }

}



/* =========================================
   DESENHAR PARTÍCULA
========================================= */

function drawParticle(
    particle
) {

    ctx.beginPath();


    ctx.arc(

        particle.x,

        particle.y,

        particle.size,

        0,

        Math.PI * 2

    );


    /*
        Cor das partículas.

        Lilás claro para combinar
        com seu fundo.
    */

    ctx.fillStyle =
        "rgba(225, 215, 255, 0.80)";


    /*
        Brilho.
    */

    ctx.shadowBlur = 8;


    ctx.shadowColor =
        "rgba(210, 190, 255, 0.8)";


    ctx.fill();


    ctx.shadowBlur = 0;

}



/* =========================================
   DESENHAR CONEXÕES
========================================= */

function drawConnections() {


    for (
        let i = 0;
        i < particles.length;
        i++
    ) {


        for (
            let j = i + 1;
            j < particles.length;
            j++
        ) {


            const a =
                particles[i];


            const b =
                particles[j];


            const dx =
                a.x - b.x;


            const dy =
                a.y - b.y;


            const distance =
                Math.sqrt(
                    dx * dx +
                    dy * dy
                );


            /*
                Se estiverem próximas,
                cria uma linha.
            */

            if (
                distance <
                config.connectionDistance
            ) {


                /*
                    Linha fica mais
                    transparente conforme
                    aumenta a distância.
                */

                const opacity =
                    1 -
                    (
                        distance /
                        config.connectionDistance
                    );


                ctx.beginPath();


                ctx.moveTo(
                    a.x,
                    a.y
                );


                ctx.lineTo(
                    b.x,
                    b.y
                );


                ctx.strokeStyle =
                    `rgba(
                        220,
                        205,
                        255,
                        ${opacity * 0.25}
                    )`;


                ctx.lineWidth =
                    0.7;


                ctx.stroke();

            }

        }

    }

}



/* =========================================
   ANIMAÇÃO PRINCIPAL
========================================= */

function animate() {


    /*
        Limpa o canvas.
    */

    ctx.clearRect(
        0,
        0,
        width,
        height
    );


    /*
        Atualiza partículas.
    */

    particles.forEach(
        updateParticle
    );


    /*
        Desenha conexões.
    */

    drawConnections();


    /*
        Desenha partículas.
    */

    particles.forEach(
        drawParticle
    );


    /*
        Continua a animação.
    */

    requestAnimationFrame(
        animate
    );

}



/* =========================================
   INICIAR
========================================= */

resizeCanvas();

animate();
