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
        
    <ProjectCarousel :numVisible="1" :numScroll="1" :showIndicators="false">

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

</div>
</template>

<script setup>
import { useHead } from '@unhead/vue';

import Project from '../components/project.vue';
import ProjectCarousel from "../components/projectCarousel.vue"

import rtclImage from "@/assets/example_projects/rtcl.jpg";
import safeRoadsImage from "@/assets/example_projects/safe_roads.jpg";
import cwruClassesImage from "@/assets/example_projects/cwru_classes.jpg";
import singlehandedImage from "@/assets/example_projects/singlehanded.jpg";
import subwayImage from "@/assets/example_projects/subway.jpg";
import escapeImage from "@/assets/example_projects/escape.jpg";
import faunaImage from "@/assets/example_projects/fauna.jpg";

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

// more projects that could be added:
// third place khe 2022, nfc tap-based check-in: https://devpost.com/software/duckduckgoose
// simple top-down driving game, "best game" from khe 2019: https://devpost.com/software/picky-alien

</script>

<style scoped lang="scss">
.container {
    width: 600px;
    max-width: 90vw;
    margin: 100px auto;

    line-height: 1.5;
}
h1 {
    font-size: 2rem;
}
p {
    margin: 30px 0;
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
</style>
