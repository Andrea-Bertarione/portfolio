import { json } from '@sveltejs/kit';

const skillsDatabase = [
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

export async function GET({ url }) {
  const category = url.searchParams.get('category');
  const shuffle = url.searchParams.get('shuffle') === 'true';
  
  let skills = [...skillsDatabase];
  
  // Filter by category if specified
  if (category) {
    skills = skills.filter(skill => 
      skill.category.toLowerCase() === category.toLowerCase()
    );
  }
  
  // Shuffle if requested (for random skill display)
  if (shuffle) {
    skills = skills.sort(() => Math.random() - 0.5);
  }
  
  return json(skills, {
    headers: {
      'Cache-Control': 'max-age=3600' // Cache for 1 hour
    }
  });
}
