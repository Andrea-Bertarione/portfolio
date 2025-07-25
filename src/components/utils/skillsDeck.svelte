<script>
    import { onMount } from 'svelte';


    let skills = [
        {
            name: "JavaScript / TypeScript",
            level: "Expert",
            description: "Proficient in modern JavaScript (ES6+) and TypeScript, with extensive experience building asynchronous, scalable APIs.",
            icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/javascript/javascript-original.svg",
            color: "#f7e018"
        },
        {
            name: "Node.js / API Design",
            level: "Expert",
            description: "Expert in server-side development using Node.js and Express, designing and implementing RESTful",
            icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/nodejs/nodejs-original.svg",
            color: "#026e00"
        },
        {
            name: "SQL / Relational Databases",
            level: "Intermediate",
            description: "Experienced in relational modeling and query optimization with MySQL and PostgreSQL.",
            icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/mysql/mysql-original.svg",
            color: "#00758f"
        },
        {
            name: "Angular / Front-End",
            level: "Intermediate",
            description: "Comfortable building dynamic SPAs with Angular, vanilla JavaScript, and CSS.",
            icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/angularjs/angularjs-original.svg",
            color: "#dd0031"
        },
        {
            name: "Python",
            level: "Intermediate",
            description: "Developed web and desktop utilities, including an OCR document‐processing tool and hobby game scripts.",
            icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/python/python-original.svg",
            color: "#3776ab"
        },
        {
            name: "C / C++",
            level: "Intermediate",
            description: "Solid foundation in systems programming and data structures gained through coursework and projects.",
            icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/cplusplus/cplusplus-original.svg",
            color: "#00599c"
        },
        {
            name: "Java",
            level: "Intermediate",
            description: "Familiar with object-oriented design and multithreading in Java for desktop and server applications.",
            icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/java/java-original.svg",
            color: "#b07219"
        },
        {
            name: "Svelte",
            level: "Intermediate",
            description: "Learning Svelte to build this portfolio and other interactive web apps, leveraging its reactive paradigm.",
            icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/svelte/svelte-original.svg",
            color: "#ff3e00"
        },
        {
            name: "Game Development (Godot)",
            level: "Hobbyist",
            description: "Experimenting with Godot engine for small games and procedural tools.",
            icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/godot/godot-original.svg",
            color: "#478cbf"
        },
        {
            name: "IT Support / Troubleshooting",
            level: "Intermediate",
            description: "Providing Level 1 on-site and remote support with hardware/software troubleshooting, ticketing, and user training.",
            icon: "https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.5.0/svgs/solid/headset.svg",
            color: "#6f42c1"
        },
        {
            name: "Project Management & Docs",
            level: "Intermediate",
            description: "Organizing collaborative wikis and documentation using Obsidian, Vercel deployments, and agile workflows.",
            icon: "https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.5.0/svgs/solid/clipboard-check.svg",
            color: "#e67643"
        },
        {
            name: "Discord Bot Development",
            level: "Intermediate",
            description: "Built custom Node.js bots for automation, moderation, and interactive commands on multiple communities.",
            icon: "https://cdn.jsdelivr.net/npm/simple-icons@v15/icons/discord.svg",
            color: "#5865F2"
        },
        {
            name: "MongoDB / NoSQL",
            level: "Advanced",
            description: "Skilled with MongoDB schema design, aggregation pipelines, and performance tuning for high-throughput backends.",
            icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/mongodb/mongodb-original.svg",
            color: "#13aa52"
        },
    ];


    const levels = {
        Hobbyist: {
            BarFill: 25,
            BarColor: "#FFB74D"
        },
        Intermediate: {
            BarFill: 50,
            BarColor: "#EBE013"
        },
        Advanced: {
            BarFill: 75,
            BarColor: "#4CAF50"
        },
        Expert: {
            BarFill: 100,
            BarColor: "#2196F3"
        },
    };

    const getSkillLevelStyle = (level) => {
        if (levels[level]) {
            return `background: linear-gradient(to right, ${levels[level].BarColor} ${levels[level].BarFill}%, #ddd ${levels[level].BarFill}%);`;
        }
        return 'background-color: #ccc;';
    };

    function hexToRgb(hex) {
        hex = hex.replace(/^#/, "");
        if (hex.length === 3) hex = hex.split('').map(x => x + x).join('');
        const num = parseInt(hex, 16);
        return [num >> 16, (num >> 8) & 0xff, num & 0xff];
    }

    function darken(rgb, percent) {
        return rgb.map(c => Math.round(c * (1 - percent)));
    }

    function lighten(rgb, percent) {
        return rgb.map(c => Math.round(c + (255 - c) * percent));
    }

    function moreNoticableGradient(hex) {
        const base = hexToRgb(hex);
        const dark = darken(base, 0.25);
        const light = lighten(base, 0.4);
        const baseStr = base.join(',');
        const lightStr = light.join(',');
        const darkStr = dark.join(',');

        // Noticeable stops: base (5%) -> light highlight (45%) -> dark (90%)
        return `background: linear-gradient(135deg, rgba(${baseStr},1) 5%, rgba(${lightStr},0.9) 45%, rgba(${darkStr},1) 90%);`;
    }
    const getCardBg = (skill) => {
        return moreNoticableGradient(skill.color);
    }


    let deckIndex = 0;
    let currentCard = skills[deckIndex];
    let sideLeft = skills[skills.length - 1];
    let sideRight = skills[deckIndex + 1];
    currentCard.focussed = "focussed";
    sideLeft.focussed = "right";
    sideRight.focussed = "left";

    let animRunning = false;

    export const updateCardIndex = (direction) => {
        if (animRunning) return;
        animRunning = true;

        if (direction === 'next') {
            deckIndex = (deckIndex + 1) % skills.length;
            skills[(deckIndex + 1) % skills.length].focussed = "prev";
            skills[(deckIndex + 1) % skills.length].animation = 'animateLeft';
            setTimeout(() => {
                skills[(deckIndex + 1) % skills.length].focussed = "";
                skills[(deckIndex + 1) % skills.length].animation = '';
            }, 500);
        } else if (direction === 'prev') {
            deckIndex = deckIndex - 1 < 0 ? skills.length - 1 : deckIndex - 1;
            skills[(deckIndex - 1 + skills.length) % skills.length].focussed = "next";
            skills[(deckIndex - 1 + skills.length) % skills.length].animation = 'animateRight';
            setTimeout(() => {
                skills[(deckIndex - 1 + skills.length) % skills.length].focussed = "";
                skills[(deckIndex - 1 + skills.length) % skills.length].animation = '';
            }, 500);
        }


        currentCard.animation = direction == 'next' ? 'animateRight' : 'animateLeft';
        sideLeft.animation = direction == 'next' ? 'animateRight' : 'animateLeft';
        sideRight.animation = direction == 'next' ? 'animateRight' : 'animateLeft';

        skills = [...skills];

        setTimeout(updateState, 500);
        setTimeout(() => {
            currentCard.animation = '';
            sideLeft.animation = '';
            sideRight.animation = '';
        }, 490);
    }


    const updateState = () => {
        currentCard.focussed = "";
        sideLeft.focussed = "";
        sideRight.focussed = "";


        currentCard = skills[deckIndex];
        sideLeft = skills[deckIndex - 1 < 0 ? skills.length - 1 : deckIndex - 1];
        sideRight = skills[(deckIndex + 1) % skills.length];


        currentCard.focussed = "focussed";
        sideLeft.focussed = "right";
        sideRight.focussed = "left";


        skills = [...skills];
        animRunning = false;
    }


    onMount(() => {
        window.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowRight') {
                updateCardIndex('next');
            } else if (e.key === 'ArrowLeft') {
                updateCardIndex('prev');
            }
        });


        window.addEventListener('click', (e) => {
            const leftCard = e.target.closest('.left');
            const rightCard = e.target.closest('.right');

            if (leftCard) {
                updateCardIndex('next');
            } else if (rightCard) {
                updateCardIndex('prev');
            }
        });
    });
</script>


<div class="SkillsContainer">
    <div class="skillsDeck">
        {#each skills as skill, index}
            <div class="skillCard {skill.focussed} {skill.animation}" style="{getCardBg(skill)}" id={index}>
                <div class="iconCircle">
                    <img src={skill.icon} alt={skill.name} class="skillIcon" />
                </div>
                
                <h3 class="skillName">{skill.name}</h3>
                <p class="skillLevel" style="{getSkillLevelStyle(skill.level)}">{skill.level}</p>
                <p class="skillDescription">{skill.description}</p>
            </div>
        {/each}
    </div>
</div>


<style>
    .SkillsContainer {
        display: flex;
        justify-content: center;
        align-items: center;
        height: 100%;
        margin-left: 30px;
        margin-right: 30px;
        margin-bottom: 50px;
    }


    .skillsDeck {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 1rem;
        max-width: 750px;
        margin: 0 auto;
        align-items: center;
        perspective: 1200px;
    }


    .skillCard {
        display: none;
        justify-content: center;
        align-items: center;
        border-radius: 30px;
        border: 15px solid #b6b6b6;
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        width: 100%;
        min-height: 350px;
        max-height: 400px;
        text-align: center;
        box-sizing: border-box;
        transition: transform 0.25s ease;
    }

    .skillName {
        text-shadow: 2px 0 #000000, -2px 0 #000000, 0 2px #000000, 0 -2px #000000,
             1px 1px #000000, -1px -1px #000000, 1px -1px #000000, -1px 1px #000000;
    }

    .skillLevel {
        font-weight: bold;
        padding: 5px 10px;
        border-radius: 5px;
        border: 3px solid #000;
        text-shadow: 2px 0 #000000, -2px 0 #000000, 0 2px #000000, 0 -2px #000000,
             1px 1px #000000, -1px -1px #000000, 1px -1px #000000, -1px 1px #000000;
    }

    .skillDescription {
        font-size: 14px;
        text-shadow: 2px 0 #000000, -2px 0 #000000, 0 2px #000000, 0 -2px #000000,
             1px 1px #000000, -1px -1px #000000, 1px -1px #000000, -1px 1px #000000;
    }

    .iconCircle {
        width: 70px;
        height: 70px;
        border-radius: 50%;
        background: #fff;
        display: flex;
        align-items: center;
        justify-content: center;
        margin-top: 10px;
        box-shadow: 0 4px 10px rgba(0,0,0,0.1);
        
    }
    .skillIcon {
        width: 50px;
        height: 50px;
        object-fit: contain;
        display: block;
    }


    .focussed {
        z-index: 3;
        display: flex;
        flex-direction: column;
        grid-area: 1 / 2 / 2 / 3;
    }


    .right {
        z-index: 2;
        display: flex;
        flex-direction: column;
        grid-area: 1 / 3 / 2 / 4;
        transform-style: preserve-3d;
        transform: scaleX(0.7) scaleY(0.8) rotate3d(0, 1, 0, 35deg);
        cursor: pointer;
    }

    .right:hover {
        animation: hoverRight 2.5s infinite;
    }

    @keyframes hoverRight {
        0% {
            transform: scaleX(0.7) scaleY(0.8) rotate3d(0, 1, 0, 35deg);
        }
        50% {
            transform: scaleX(0.8) scaleY(0.9) rotate3d(0, 1, 0, 15deg);
        }
        100% {
            transform: scaleX(0.7) scaleY(0.8) rotate3d(0, 1, 0, 35deg);
        }
    }

    .left {
        z-index: 2;
        display: flex;
        flex-direction: column;
        grid-area: 1 / 1 / 2 / 2;
        transform-style: preserve-3d;
        transform: scaleX(0.7) scaleY(0.8) rotate3d(0, 1, 0, -35deg);
        cursor: pointer;
    }

    .left:hover {
        animation: hoverLeft 2.5s infinite;
    }

    @keyframes hoverLeft {
        0% {
            transform: scaleX(0.7) scaleY(0.8) rotate3d(0, 1, 0, -35deg);
        }
        50% {
            transform: scaleX(0.8) scaleY(0.9) rotate3d(0, 1, 0, -15deg);
        }
        100% {
            transform: scaleX(0.7) scaleY(0.8) rotate3d(0, 1, 0, -35deg);
        }
    }

    .next {
        display: flex;
        flex-direction: column;
        grid-area: 1 / 3 / 2 / 4;
        transform-style: preserve-3d;
        transform: scaleX(0.4) scaleY(0.6) rotate3d(0, 1, 0, -90deg);
    }

    .prev {
        display: flex;
        flex-direction: column;
        grid-area: 1 / 1 / 2 / 2;
        transform-style: preserve-3d;
        transform: scaleX(0.4) scaleY(0.6) rotate3d(0, 1, 0, 90deg);
    }

    .focussed.animateLeft {
        animation: animateLeftCurrent 0.5s forwards;
    }

    .focussed.animateRight {
        animation: animateRightCurrent 0.5s forwards;
    }

    .right.animateLeft {
        animation: animateLeftSide 0.5s forwards;
    }

    .right.animateRight {
        animation: animateRightSide 0.5s forwards;
    }

    .left.animateLeft {
        animation: animateLeftSide2 0.5s forwards;
    }

    .left.animateRight {
        animation: animateRightSide2 0.5s forwards;
    }

    .next.animateRight {
        animation: animateNextRight 0.5s forwards;
    }

    .prev.animateLeft {
        animation: animatePrevLeft 0.5s forwards;
    }

    @keyframes animateLeftCurrent {
        from {
            transform: scaleX(1) scaleY(1) rotate3d(0, 1, 0, 0deg);
        }
        to {
            transform: translateX(calc(-100% - 1rem)) scaleX(0.7) scaleY(0.8) rotate3d(0, 1, 0, -35deg);
        }
    }

    @keyframes animateRightCurrent {
        from {
            transform: scaleX(1) scaleY(1) rotate3d(0, 1, 0, 0deg);
        }
        to {
            transform: translateX(calc(100% + 1rem)) scaleX(0.7) scaleY(0.8) rotate3d(0, 1, 0, 35deg);
        }
    }

    @keyframes animateLeftSide {
        from {
            transform: scaleX(0.7) scaleY(0.8) rotate3d(0, 1, 0, 35deg);
        }
        to {
            transform: translateX(calc(-100% - 1rem)) scaleX(1) scaleY(1) rotate3d(0, 1, 0, 0deg);
        }
    }

    @keyframes animateRightSide {
        from {
            
        }
        to {
            transform: scaleX(0.4) scaleY(0.6) rotate3d(0, 1, 0, 90deg);
        }
    }

    @keyframes animateLeftSide2 {
        from {
            
        }
        to {
            transform: scaleX(0.4) scaleY(0.6) rotate3d(0, 1, 0, -90deg);
        }
    }

    @keyframes animateRightSide2 {
        from {
            transform: scaleX(0.7) scaleY(0.8) rotate3d(0, 1, 0, -35deg);
        }
        to {
            transform: translateX(calc(100% + 1rem)) scaleX(1) scaleY(1) rotate3d(0, 1, 0, 0deg);
        }
    }

    @keyframes animateNextRight {
        from {
            transform: scaleX(0.4) scaleY(0.6) rotate3d(0, 1, 0, 90deg);
        }
        to {
            transform: scaleX(0.7) scaleY(0.8) rotate3d(0, 1, 0, 35deg);
        }
    }

    @keyframes animatePrevLeft {
        from {
            transform: scaleX(0.4) scaleY(0.6) rotate3d(0, 1, 0, -90deg);
        }
        to {
            transform: scaleX(0.7) scaleY(0.8) rotate3d(0, 1, 0, -35deg);
        }
    }
</style>