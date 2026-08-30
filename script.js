/* =========================================
   MODO ESCURO
========================================= */

const themeToggle =
    document.getElementById(
        "theme-toggle"
    );


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
   PARTÍCULAS
========================================= */

const canvas =
    document.getElementById(
        "particles"
    );


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
       Quantidade de pontos.

       90 = mais elegante
       130 = mais tecnológico
    */

    particleCount: 90,


    /*
       Distância máxima entre
       duas partículas para criar
       uma linha.
    */

    connectionDistance: 140,


    /*
       Velocidade do movimento.

       Deixei bem lento para
       combinar com seu layout.
    */

    speed: 0.22,


    /*
       Tamanho dos pontos.
    */

    minSize: 1,

    maxSize: 2,


    /*
       Área afetada pelo mouse.
    */

    mouseRadius: 150,


    /*
       Intensidade da interação.
    */

    mouseForce: 0.45
};



/* =========================================
   MOUSE
========================================= */

const mouse = {

    x: null,

    y: null
};


window.addEventListener(
    "mousemove",
    function (event) {

        mouse.x =
            event.clientX;

        mouse.y =
            event.clientY;

    }
);


window.addEventListener(
    "mouseleave",
    function () {

        mouse.x = null;

        mouse.y = null;

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


        mouse.x =
            event.touches[0].clientX;

        mouse.y =
            event.touches[0].clientY;

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
       Movimento normal
    */

    particle.x +=
        particle.vx;

    particle.y +=
        particle.vy;



    /*
       Se sair da tela,
       aparece do outro lado.
    */

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



    /* =====================================
       INTERAÇÃO COM MOUSE
    ====================================== */

    if (
        mouse.x !== null &&
        mouse.y !== null
    ) {

        const dx =
            particle.x -
            mouse.x;


        const dy =
            particle.y -
            mouse.y;


        const distance =
            Math.sqrt(
                dx * dx +
                dy * dy
            );


        if (
            distance <
                config.mouseRadius &&
            distance > 0
        ) {

            const force =
                (
                    config.mouseRadius -
                    distance
                ) /
                config.mouseRadius;


            /*
               Afasta levemente
               a partícula do mouse.
            */

            particle.x +=
                (
                    dx /
                    distance
                ) *
                force *
                config.mouseForce;


            particle.y +=
                (
                    dy /
                    distance
                ) *
                force *
                config.mouseForce;

        }

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
       Lilás claro.

       Combina com o
       fundo roxo.
    */

    ctx.fillStyle =
        "rgba(220, 210, 255, 0.75)";


    /*
       Brilho suave.
    */

    ctx.shadowBlur = 8;


    ctx.shadowColor =
        "rgba(200, 180, 255, 0.8)";


    ctx.fill();


    ctx.shadowBlur = 0;

}



/* =========================================
   LINHAS ENTRE PARTÍCULAS
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
               Só desenha a linha
               quando os pontos estão
               próximos.
            */

            if (
                distance <
                config.connectionDistance
            ) {


                /*
                   Quanto mais perto,
                   mais visível.
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


                /*
                   Lilás transparente.
                */

                ctx.strokeStyle =
                    `rgba(
                        220,
                        205,
                        255,
                        ${opacity * 0.22}
                    )`;


                ctx.lineWidth =
                    0.7;


                ctx.stroke();

            }

        }

    }

}



/* =========================================
   ANIMAÇÃO
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
       Atualiza as partículas.
    */

    particles.forEach(
        updateParticle
    );


    /*
       Desenha as linhas.
    */

    drawConnections();


    /*
       Desenha os pontos.
    */

    particles.forEach(
        drawParticle
    );


    /*
       Próximo frame.
    */

    requestAnimationFrame(
        animate
    );

}



/* =========================================
   INICIAR
========================================= */

window.addEventListener(
    "resize",
    resizeCanvas
);


resizeCanvas();

animate();
