<script>
    import { onMount } from 'svelte';


    let skills = [
        {
            name: "JavaScript / TypeScript",
            level: "Advanced",
            description: "Proficient in modern JavaScript (ES6+) and TypeScript, with extensive experience building asynchronous, scalable APIs.",
            icon: "javascript.svg"
        },
        {
            name: "Node.js / API Design",
            level: "Advanced",
            description: "Expert in server-side development using Node.js and Express, designing and implementing RESTful and GraphQL APIs.",
            icon: "nodejs.svg"
        },
        {
            name: "MongoDB / NoSQL",
            level: "Advanced",
            description: "Skilled with MongoDB schema design, aggregation pipelines, and performance tuning for high-throughput backends.",
            icon: "mongodb.svg"
        },
        {
            name: "SQL / Relational Databases",
            level: "Intermediate",
            description: "Experienced in relational modeling and query optimization with MySQL and PostgreSQL.",
            icon: "sql.svg"
        },
        {
            name: "Angular / Front-End",
            level: "Intermediate",
            description: "Comfortable building dynamic SPAs with Angular, vanilla JavaScript, and CSS.",
            icon: "angular.svg"
        },
        {
            name: "Python",
            level: "Intermediate",
            description: "Developed web and desktop utilities, including an OCR document‐processing tool and hobby game scripts.",
            icon: "python.svg"
        },
        {
            name: "C / C++",
            level: "Intermediate",
            description: "Solid foundation in systems programming and data structures gained through coursework and projects.",
            icon: "cpp.svg"
        },
        {
            name: "Java",
            level: "Intermediate",
            description: "Familiar with object-oriented design and multithreading in Java for desktop and server applications.",
            icon: "java.svg"
        },
        {
            name: "Svelte",
            level: "Intermediate",
            description: "Learning Svelte to build this portfolio and other interactive web apps, leveraging its reactive paradigm.",
            icon: "svelte.svg"
        },
        {
            name: "Game Development (Godot)",
            level: "Hobbyist",
            description: "Experimenting with Godot engine for small games and procedural tools; also world-building as a Dungeon Master.",
            icon: "godot.svg"
        },
        {
            name: "IT Support / Troubleshooting",
            level: "Intermediate",
            description: "Providing Level 1 on-site and remote support with hardware/software troubleshooting, ticketing, and user training.",
            icon: "it_support.svg"
        },
        {
            name: "Project Management & Docs",
            level: "Intermediate",
            description: "Organizing collaborative wikis and documentation using Obsidian, Vercel deployments, and agile workflows.",
            icon: "project_management.svg"
        },
        {
            name: "Discord Bot Development",
            level: "Intermediate",
            description: "Built custom Node.js bots for automation, moderation, and interactive commands on multiple communities.",
            icon: "discord.svg"
        }
    ];


    let deckIndex = 0;
    let currentCard = skills[deckIndex];
    let sideLeft = skills[skills.length - 1];
    let sideRight = skills[deckIndex + 1];
    currentCard.focussed = "focussed";
    sideLeft.focussed = "right";
    sideRight.focussed = "left";


    const updateCardIndex = (direction) => {
        if (direction === 'next') {
            deckIndex = (deckIndex + 1) % skills.length;
        } else if (direction === 'prev') {
            deckIndex = deckIndex - 1 < 0 ? skills.length - 1 : deckIndex - 1;
        }


        currentCard.animation = direction === 'next' ? 'animateRight' : 'animateLeft';
        sideLeft.animation = direction === 'next' ? 'animateRight' : 'animateLeft';
        sideRight.animation = direction === 'next' ? 'animateRight' : 'animateLeft';


        setTimeout(updateState, 500);
        setTimeout(() => {
            currentCard.animation = '';
            sideLeft.animation = '';
            sideRight.animation = '';
        }, 500);
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
            if (e.target.classList.contains('left') || e.target.classList.contains('right')) {
                updateCardIndex(e.target.classList.contains('left') ? 'next' : 'prev');
            }
        });
    });
</script>


<div class="SkillsContainer">
    <div class="skillsDeck">
        {#each skills as skill, index}
            <div class="skillCard {skill.focussed} {skill.animation}" id={index}>
                <img src={skill.icon} alt={skill.name} class="skillIcon" />
                <h3>{skill.name}</h3>
                <p class="skillLevel">{skill.level}</p>
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
        max-width: 700px;
        margin: 0 auto;
        align-items: center;
    }


    .skillCard {
        display: none;
        justify-content: center;
        align-items: center;
        background: white;
        border-radius: 10px;
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        width: 100%;
        min-height: 350px; /* or whatever fits your design */
        text-align: center;
        box-sizing: border-box;
    }


    .focussed {
        display: flex;
        flex-direction: column;
        grid-area: 1 / 2 / 2 / 3;
    }


    .right {
        display: flex;
        flex-direction: column;
        grid-area: 1 / 3 / 2 / 4;
        transform: scaleX(0.7) scaleY(0.8);
    }


    .left {
        display: flex;
        flex-direction: column;
        grid-area: 1 / 1 / 2 / 2;
        transform: scaleX(0.7) scaleY(0.8);
    }


    .skillIcon {
        width: 50px;
        height: 50px;
    }


    .skillLevel {
        font-weight: bold;
    }
</style>