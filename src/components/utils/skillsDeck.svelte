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

    const deckIndex = 0;
    const currentCard = skills[deckIndex];
    currentCard.focussed = "focussed";

    onMount(() => {
        
    });
</script>

<div class="SkillsContainer">
    <div class="skillsDeck">
        {#each skills as skill, index}
            <div class="skillCard {skill.focussed}" id={index}>
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
        margin-bottom: 50px;
    }

    .skillsDeck {
        display: flex;
        justify-content: center;
        align-items: center;
        gap: 20px;
        width: 100%;

    }

    .skillCard {
        display: none;
        background: white;
        border-radius: 10px;
        padding: 20px;
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        width: calc(25% - 20px);
        height: 50vh;
        text-align: center;
    }

    .focussed {
        display: block;
        animation: fadeIn 0.5s ease-in-out;
    }

    .skillIcon {
        width: 50px;
        height: 50px;
    }

    .skillLevel {
        font-weight: bold;
    }
</style>