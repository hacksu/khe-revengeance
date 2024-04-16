<template>
<div class="container">
    <h1>
        Our Guide to Hackathons
    </h1>
    <p class="large-text">
        Throwing together a revolutionary new product that <strong>shakes the
        world to its core</strong> and <strong><em>permanently changes humans'
        relationship with technology</em></strong> in less than 24 hours might
        sound hard, <strong>but it's really not.</strong>
    </p>
    <p>
        All you need is an idea and the tools to implement it. For example:
    </p>

    <h2 style="text-align: center; margin-bottom: 0">~ Previous Projects ~</h2>
        
    <ProjectCarousel :numVisible="1" :numScroll="1">

        <Project title="Escape Pursuit (HackPSU Spring 2024)"
            link="https://devpost.com/software/escape-pursuit" :image="escapeImage">
            <p>
                This online game adds an online component to hide-and-seek: both
                the hider and the seekers bring up the game on their phone, and
                then when the hider hides, the seekers are shown a
                randomly-placed circle on the map that the hider is
                <em>somewhere</em> within. The hider can go anywhere, but the
                game stays fair.
            </p>
            <p>
                This simple enhancement to an age-old pastime shows how
                technology can be integrated with the real world in a new way to
                create something fun!
            </p>
            <p class="small-text">
                <strong>Technologies used: </strong><br />
                Angular as the framework for creating the game's web interface <br />
                MongoDB to store users' data while playing <br />
                Google Maps to provide maps <br />
                Cloudflare Workers to host the site
            </p>
        </Project>
        
        <Project title="RTCL (KHE 2022)"
            :image="rtclImage" link="https://devpost.com/software/rtcl-article">
            <p>
                This was a Python program that read PDFs and, with the help of a
                language model, created PowerPoint slides that summarized their
                contents.
            </p>
            <p>
                These days, everyone knows AI can do this kind of thing, but back in
                October 2022, before ChatGPT, <strong>this blew people's minds.</strong>
                This project found an application of technology that people
                weren't used to yet.
            </p>
            <p class="small-text">
                <strong>Technologies used: </strong><br />
                pdfminer (a Python library) to get text from PDFs <br />
                Cohere NLP to generate bullet points <br />
                pptx (a Python library) to put them in PowerPoints
            </p>
        </Project>

        <Project title="Single-Handed Typing (KHE 2022)"
            link="https://devpost.com/software/singlehanded-typing-tech" :image="singlehandedImage">
            <p>
                This was a project created by someone who once broke their arm
                and wasn't able to type with one of their hands. To improve this
                kind of situation for everyone, they decided to try to implement
                an old idea for a dynamic one-handed keyboard layout they found.
            </p>
            <p>
                This project wasn't completely original, but it did iterate on a
                forgotten concept that then only existed in old Linux config
                files. Sometimes you just need someone to actually make the
                thing.
            </p>
            <p class="small-text">
                <strong>Technologies used: </strong><br />
                keyboard, a Python library that can detect and modify keyboard input <br />
                PyQt, a Python library used to display stuff in a window <br />
                Vue and Nuxt to create the website that demoed the project
            </p>
        </Project>

        <Project title="FaunaFinder (MakeUC 2023)"
            link="https://devpost.com/software/faunafinder-ai-powered-animal-breed-recognition" :image="faunaImage">
            <p>
                This AI-based application recognizes pictures of animals, brings
                up information about the species of those animals, and tells you
                about related animals that you might also want to know about.
            </p>
            <p>
                There is still a lot of untapped potential within the world of
                AI, probably, and something as simple as a new animal recognizer
                can make use of that.
            </p>
            <p class="small-text">
                <strong>Technologies used: </strong><br />
                Flask, a Python library, to create a web server for the web interface <br />
                Google Cloud Vision to recognize animals with AI <br />
            </p>
        </Project>

        <Project title="Subway Cheese Chase (MakeUC 2023)"
            link="https://devpost.com/software/subway-cheese-chase" :image="subwayImage">
            <p>
                This is simply a horror game about being in a dark Subway
                (restaurant) looking for your car keys.
            </p>
            <p>
                Not every hackathon project has to be super serious!
            </p>
            <p class="small-text">
                <strong>Technologies used: </strong><br />
                Godot, a popular free game engine <br />
                Blender, a program for creating 3D art
            </p>
        </Project>

        <Project title="CWRU Full-Text Class Search (KHE 2019)"
            :image="cwruClassesImage" link="https://devpost.com/software/cwru-full-text-class-search">
            <p>
                This was a project developed by students from Case Western
                Reserve University who disapproved of their university's portal
                for class searches. So, they scraped the content of the portal
                and made their own website out of it.
            </p>
            <p>
                This project <strong>identified a part of our built environment
                that sucks</strong> and <strong>decided to try to fix
                it.</strong>
            </p>
            <p class="small-text">
                <strong>Technologies used: </strong><br />
                Scrapy, a Python library designed to turn web pages into data <br />
                MongoDB to store the scraped data <br />
                Elasticsearch to rapidly search the scraped text <br />
                Google Cloud to host the resulting website
            </p>
        </Project>

        <Project title="Safe-Roads (MakeUC 2023)"
            link="https://devpost.com/software/safe-roads" :image="safeRoadsImage">
            <p>
                This project uses publicly-available maps and data to visualize how
                dangerous any given segment of road is. I imagine this is perfect for
                anyone who's already anxious about driving.
            </p>
            <p>
                This project shows how useful public datasets from websites like
                <a href="http://kaggle.com/">Kaggle</a> can be if given the right frame.
                The Internet has a ton of information on it that just needs a little bit
                of data science done to it to become relevant and accessible in people's
                lives.
            </p>
            <p class="small-text">
                <strong>Technologies used: </strong><br />
                The Google Maps API, to get maps <br />
                Streamlit, a Python framework for visualizing data, to visualize data
            </p>
        </Project>

    <!--
        more projects that could be added:
        third place khe 2022, nfc tap-based check-in: https://devpost.com/software/duckduckgoose
        simple top-down driving game, "best game" from khe 2019: https://devpost.com/software/picky-alien
    -->

    </ProjectCarousel>

    <p>
        <a href="https://devpost.com/software">For even more projects, browse
        the global project gallery on Devpost.</a>
    </p>

    <h3>Key takeaways for success:</h3>
    <ul>
        <li>
            Keep the scope of your project narrow - if you have an idea, try to
            just implement the core of it.
        </li>
        <li style="font-size: 110%">
            <strong>Put a little hot sauce on that bad boy.</strong>
        </li>
        <li>
            Use libraries written in your chosen language that solve hard
            problems.
        </li>
        <li>
            Use a high-level framework that takes care of the routine details of
            the kind of project you're working on.
        </li>
    </ul>

    <p>For more on those last two points, read on:</p>

    <h2>Technologies</h2>

    <TechnologyGuide title="Web Development">
        <template #description>
            This is the most common way to create apps with centralized data and
            convenient graphical user interfaces.
        </template>
        <p style="text-align: center;">
            <img :src="wwwGif" />
        </p>
        <p>
            The technologies originally developed to make Geocities websites and
            mailing list address forms eventually broke containment and
            infiltrated every single facet of the modern graphical user
            interface-based world.
        </p>
        <p>
            Generally, to use them, you need to create a <strong>backend server
            application</strong> that can store data, make itself available on a
            network, and usually do most of the actual work that the thing
            you're making needs to do. When a web browser (aka a
            <strong>client</strong>) connects to it, the backend server will
            send <strong>client-side code</strong> to the browser. The server
            application is known as the <strong>backend</strong>; the
            client-side code that tells the web browser what to display is
            called the <strong>frontend</strong>.
        </p>

        <p>
            Here is a list of some of the more currently popular
            backend/frontend combos in very approximately escalating order of
            complexity:
        </p>

        <div class="web-dev-grid">
            <h3>Backend</h3>
            <h3>Frontend</h3>
            
            <p>None</p>
            <p><a href="https://developer.mozilla.org/en-US/docs/Learn/HTML">HTML files</a></p>

            <p><a href="https://flask.palletsprojects.com/en/3.0.x/">Flask</a><br />(Python library)</p>
            <p><a href="https://jinja.palletsprojects.com/en/3.1.x/">Jinja HTML templates</a></p>

            <!-- <p>
                <a href="https://expressjs.com">Express.js</a>
                (JavaScript library)
            </p>
            <p><span>
                HTML templates using <a href="https://ejs.co/">EJS</a>, <a
                href="https://handlebarsjs.com/">Handlebars</a>, etc.
            </span></p> -->
            
            <p>
                <a href="https://expressjs.com">Express.js</a>
                (JavaScript library)
            </p>
            <p><span>
                Interactive components using
                <a href="https://vuejs.org/">Vue</a> &
                <a href="https://vitejs.dev/">Vite</a> (more JavaScript)
            </span></p>

            <p style="grid-column: 1/3">
                <a href="https://nextjs.org/">Next.js</a>
                (JavaScript backend + React-based frontend components.)
            </p>

            <p><span>
                Serverless Functions, deployed to something like
                <a href="https://vercel.com/">Vercel</a> or
                <a href="https://www.netlify.com/">Netlify</a>
            </span></p>
            <p><span>
                Static site generation with a framework like <a href="https://astro.build/">Astro</a>
                <br />
                (The <a href="https://jamstack.org/">Jamstack</a> approach)
            </span></p>

        </div>

        <h2>Follow-up points:</h2>
        <ul>
            <li>
                Yes, there are several zillion web development frameworks. We'll
                come up with one that leaves your sanity intact eventually.
            </li>
            <li>
                Note that you need to download <a
                href="https://nodejs.org/en">Node.js</a> to run JavaScript
                outside of the browser just like you need to download <a
                href="https://www.python.org/downloads/">Python</a> to run
                Python.
            </li>
            <li>
                Backend code can be written in any language that has a library
                that lets you communicate over a network.
                <a href="https://github.com/yhirose/cpp-httplib">Even C++!</a>
                But usually not C++.
            </li>
            <li>
                You don't need backend code if you just stick frontend code in
                HTML files and open them with your web browser, but that makes
                it pretty much impossible to do things like persist data or
                communicate with an API over the Internet.
            </li>
            <li>
                Frontend code must be written in HTML, CSS, and JavaScript
                because those are the languages web browsers understand.
                <ul>
                    <li style="font-size: 90%">
                        Unless you're using a language that can be transformed
                        into one of those languages, like TypeScript.
                    </li>
                    <li style="font-size: 80%">
                        Or you're compiling code from other languages into
                        WebAssembly. Look, I might be getting too
                        detail-oriented here.
                    </li>
                </ul>
            </li>
            <!-- <li>
                You can also combine the frontend and backend into one
                installable app using a framework like <a
                href="https://www.electronjs.org/">Electron</a>, which is how
                Discord, VSCode, and Microsoft Teams hide the fact that they use
                JavaScript. You probably don't need to think that hard about
                shipping an installable app for your hackathon project, though.
            </li>
            <li>
                Similarly, most web apps use databases to store
                data, like <a href="https://www.postgresql.org/">PostgreSQL</a>
                or <a href="https://www.mongodb.com/">MongoDB</a>, but hot take,
                for a quick project, you probably don't need much more than a <a
                href="https://tinydb.readthedocs.io/en/latest/">simple</a> <a
                href="https://github.com/typicode/lowdb">library</a> that can
                store stuff in JSON files.
            </li> -->
        </ul>
    </TechnologyGuide>

    <TechnologyGuide title="Artificial Intelligence">
        
        <template #description>
            This typically refers to technology that can make sense out of the
            ambiguities involved in natural phenomenona like language or images
            in a probabilistic way.
        </template>

        <p>
            
        </p>

    </TechnologyGuide>

</div>
</template>

<script setup>
import { useHead } from '@unhead/vue';

import Project from '../components/project.vue';
import ProjectCarousel from "../components/projectCarousel.vue";
import TechnologyGuide from "../components/technologyGuide.vue";

import rtclImage from "@/assets/example_projects/rtcl.jpg";
import safeRoadsImage from "@/assets/example_projects/safe_roads.jpg";
import cwruClassesImage from "@/assets/example_projects/cwru_classes.jpg";
import singlehandedImage from "@/assets/example_projects/singlehanded.jpg";
import subwayImage from "@/assets/example_projects/subway.jpg";
import escapeImage from "@/assets/example_projects/escape.jpg";
import faunaImage from "@/assets/example_projects/fauna.jpg";

import wwwGif from "@/assets/technology_guide/www.gif"

useHead({
  title: "KHE's Guide to Hackathons",
  meta: [
    {
      name: "description",
      content: "Our guide to hackathons, with examples of projects, a roadmap " +
                "of technologies, and more.",
    },
  ],
});

</script>

<style scoped lang="scss">
.container {
    width: 600px;
    max-width: 96vw;
    margin: 100px auto;
    line-height: 1.5;
}
h1 {
    font-size: 2rem;
}
p {
    margin: 20px 0;
    font-size: 1.1rem;
    &.large-text {
        font-size: 1.25rem;
    }
    &.small-text {
        font-size: 0.8rem;
    }
}
:deep(.p-carousel-item) {
    display: flex;
    flex-direction: column;
    justify-content: center;
}
:deep(button.p-carousel-next), :deep(button.p-carousel-prev) {
    background-color: #fff3!important;
}
:deep(.p-carousel-indicator.p-highlight) button {
    background-color: white!important;
}
// adjusting the positions and sizes of carousel control buttons by a couple
// pixels at a time because i care so much it hurts
:deep(button.p-carousel-next) {
    transform: translateX(-2px);
    @media (max-width: 600px) {
        display: none;
    }
}
:deep(button.p-carousel-prev) {
    transform: translateX(2px);
    @media (max-width: 600px) {
        display: none;
    }
}
:deep(.p-carousel-next-icon) {
    transform: scale(1.5) translateX(-1px);
}
:deep(.p-carousel-prev-icon) {
    transform: scale(1.5) translateX(1px);
}
:deep(.p-accordion-content) > p:first-of-type {
    margin-top: 0px;
}
.web-dev-grid {
    display: grid;
    width: 500px;
    max-width: 100%;
    margin: 0 auto;
    grid-template-columns: repeat(2, 1fr);
    & > p, & > h3 {
        text-align: center;
    }
    & > p {
        margin: 5px;
        padding: 5px;
        background-color: #fff3;
        border-radius: 5px;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        min-height: 50px;
    }
}
li {
    margin: 8px;
}
</style>
