<script>
    import { onMount } from 'svelte';
    import { swipe } from 'svelte-gestures';
    import { tick } from 'svelte';

    let skills = $state([]);


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

    let index           = $state(0);           // deck pointer
    let animRunning     = $state(false); 

    let total            = $derived(skills.length);
    let leftIndex        = $derived((index - 1 + total) % total);
    let rightIndex       = $derived((index + 1) % total);

    let prevIndex        = $derived((index - 2 + total) % total);
    let nextIndex        = $derived((index + 2) % total);

    let focus = $derived(
        skills.map((_, i) =>
            i === index      ? 'focussed' :
            i === leftIndex  ? 'right'    :
            i === rightIndex ? 'left'     : ''
        )
    );

    let animation = $state();

    export async function updateCardIndex(dir /* 'next' | 'prev' */) {
        if (animRunning) return;
        animRunning = true;

        const outgoing  = dir === 'next' ? rightIndex : leftIndex;

        const motion = dir === 'next' ? 'animateRight'  : 'animateLeft';

        animation[outgoing]  = motion;
        animation[index]    = motion;
        animation[leftIndex] = motion;
        animation[rightIndex]= motion;

        if (dir === 'next') {
            focus[nextIndex] = 'next';
            animation[nextIndex] = motion;
        } else {
            focus[prevIndex] = 'prev';
            animation[prevIndex] = motion;
        }

        await new Promise(r => setTimeout(r, 500));

        focus[nextIndex] = '';
        focus[prevIndex] = '';

        index = dir === 'next'
            ? (index + 1) % total
            : (index - 1 + total) % total;

        animation = Array(total).fill('');
        animRunning = false;
    }

    function handlerSwipe(e) {
        const { direction } = e.detail;
        if (window.innerWidth < 600) {
            direction === 'top'    && updateCardIndex('prev');
            direction === 'bottom' && updateCardIndex('next');
        } else {
            direction === 'left'   && updateCardIndex('prev');
            direction === 'right'  && updateCardIndex('next');
        }
    }


    onMount(async () => {
        const response = await fetch('/api/skills?shuffle=true');
        if (response.ok) {
            skills = await response.json();
            animation = Array(total).fill('');
        }
        window.addEventListener('keydown', e => {
            e.key === 'ArrowRight' && updateCardIndex('next');
            e.key === 'ArrowLeft'  && updateCardIndex('prev');
        });


        window.addEventListener('click', (e) => {
            const leftCard = e.target.closest('.left');
            const rightCard = e.target.closest('.right');

            if (leftCard) {
                updateCardIndex('next');
            } else if (rightCard) {
                if (window.innerWidth < 600) { return; }
                updateCardIndex('prev');
            }
        });
    });
</script>


<div class="SkillsContainer" use:swipe={()=>({ timeframe: 300, minSwipeDistance: 100})} onswipe={handlerSwipe} >
    <div class="skillsDeck"  >
        {#each skills as skill, i}
            <div
            class={`skillCard ${focus[i]} ${animation[i]}`}
            aria-current={focus[i] === 'focussed'}
            style="{getCardBg(skill)}" id={i}
            >
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
        width: 100%;
        height: 100%;
        margin-left: 30px;
        margin-right: 30px;
        margin-bottom: 50px;
    }


    .skillsDeck {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 1rem;
        max-width: 1050px;
        width: 60%;
        height: auto;
        min-height: 60vh;
        max-height: 80vh;
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
        height: 100%;
        min-height: 350px;
        text-align: center;
        box-sizing: border-box;
        transition: transform 0.25s ease;
    }

    .skillName {
        font-size: 1.5rem;
        font-weight: 600;
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
        font-size: 1.1rem;
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
        grid-area: 1 / 1 / 2 / 2;
        transform-style: preserve-3d;
        transform: scaleX(0.4) scaleY(0.6) rotate3d(0, 1, 0, -90deg);
    }

    .prev {
        display: flex;
        flex-direction: column;
        grid-area: 1 / 3 / 2 / 4;
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
            transform: scaleX(0.4) scaleY(0.6) rotate3d(0, 1, 0, -90deg);
        }
        to {
            transform: scaleX(0.7) scaleY(0.8) rotate3d(0, 1, 0, -35deg);
        }
    }

    @keyframes animatePrevLeft {
        from {
            transform: scaleX(0.4) scaleY(0.6) rotate3d(0, 1, 0, 90deg);
        }
        to {
            transform: scaleX(0.7) scaleY(0.8) rotate3d(0, 1, 0, 35deg);
        }
    }

    @media (max-width: 600px) {
        .SkillsContainer {
            width: 100%;
            min-height: 60vh;
            margin-left: 0;
            padding-right: 20px;
            padding-bottom: 10vh;
            
        }
        .skillsDeck {
            display: grid;
            grid-template-columns: 1fr;
            gap: 0.25rem;
            width: 70vw;
            max-width: 750px;
            min-height: 40vh;
            max-height: 60vh;
            margin: 0 auto;
            align-items: center;
            perspective: 1200px;
            pointer-events: none;
        }

        .focussed {
            width: 100%;
            transform: scaleX(1) scaleY(1) rotate3d(0, 1, 0, -10deg) translateX(20px) translateY(5px);
            z-index: 3;
        }

        .skillsDeck > .right {
            grid-area: 1 / 2 / 2 / 3;
            transform: scaleX(1) scaleY(1) rotate3d(0, 1, 0, -10deg) translateX(40px) translateY(10px);
            z-index: 2;
        }

        .skillsDeck > .left {
            grid-area: 1 / 2 / 2 / 3;
            transform: scaleX(1) scaleY(1) rotate3d(0, 1, 0, -10deg);
            z-index: 4;
        }

        .skillsDeck > .left:hover {
            animation: none;
        }
        .skillsDeck > .right:hover {
            animation: none;
        }

        .skillsDeck > .next, .skillsDeck > .prev {
            opacity:0; 
            grid-area: 1 / 2 / 2 / 3;
            transform: scaleX(1) scaleY(1) rotate3d(0, 1, 0, -10deg);
        }

        .skillsDeck > .next {
            z-index: 5;
        }

        .skillsDeck > .prev {
            z-index: 1;
        }

        .skillCard {
            min-height: 475px;
            max-height: 550px;
        }

        .iconCircle {
            width: 60px;
            height: 60px;
        }

        .skillIcon {
            width: 40px;
            height: 40px;
        }

        .next.animateRight {
            animation: animateNextRight 0.5s forwards;
        }

        .prev.animateLeft {
            animation: animatePrevLeft 0.5s forwards;
        }

        @keyframes animateRightCurrent {
        100% { transform: scaleX(1) scaleY(1) rotate3d(0,1,0,-10deg) translateX(40px) translateY(10px); }
        }
        @keyframes animateLeftCurrent {
        100% { transform: scaleX(1) scaleY(1) rotate3d(0,1,0,-10deg); }
        }


        @keyframes animateRightSide2 {
        100% { transform: scaleX(1) scaleY(1) rotate3d(0,1,0,-10deg) translateX(20px) translateY(5px); }
        }
        @keyframes animateLeftSide {
        100% { transform: translateX(20px) translateY(5px) rotate3d(0,1,0,-10deg); }
        }


        @keyframes animateRightSide {
        100% { transform: scaleX(1) scaleY(1) rotate3d(0,1,0,-10deg) translateX(80px) translateY(20px); opacity: 0; }
        }
        @keyframes animateLeftSide2 {
        100% { transform: scaleX(1) scaleY(1) rotate3d(0,1,0,-10deg) translateY(-70%); opacity: 0; }
        }


        @keyframes animateNextRight {
        0%   { transform: translateY(-70%) rotate3d(0,1,0,-10deg); opacity:0; }
        100% { transform: scaleX(1) scaleY(1) rotate3d(0,1,0,-10deg); opacity:1; }
        }

        @keyframes animatePrevLeft {
        0%   { transform: translateX(80px) translateY(20px) rotate3d(0,1,0,-10deg); opacity:0; }
        100% { transform: scaleX(1) scaleY(1) rotate3d(0,1,0,-10deg) translateX(40px) translateY(10px); opacity:1; }
        }

        /* △ Users preferring reduced motion get instant swaps */
        @media (prefers-reduced-motion:reduce) {
        .skillCard { animation:none !important; transition:none !important; }
        }
    }

    @media (min-width: 601px) and (max-width: 1367px) {
        .SkillsContainer {
            width: 100%;
        }
        .skillsDeck {
            width: 100%;
            height: 70vh;
            max-width: 100%;
        }
    }
</style>