<template>
<div class="container">
    <h1>
        A Quickstart Guide to Hackathons
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
                the hider and the seekers bring up the game on their phones, and
                then when the hider hides, the seekers are shown a
                randomly-placed circle on the map that the hider is
                <em>somewhere</em> within. The hider can explore a wide range of
                possible hiding spots, across a whole college campus, for
                example, but the game stays fair.
            </p>
            <p>
                This simple enhancement to an age-old pastime shows how
                technology can be integrated with the real world in a new way to
                create something fun.
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
                AI, probably, and this project used it to connect people with
                animals.
            </p>
            <p class="small-text">
                <strong>Technologies used: </strong><br />
                Flask, a Python library, to create a web server for the web interface <br />
                Google Cloud Vision to recognize animals with AI <br />
                APIs for Wikipedia and animal databases
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
            This is the most common way to create apps, using centralized data
            and computation and convenient graphical user interfaces.
        </template>
        <p style="text-align: center;">
            <img :src="wwwGif" alt="A retro animated spinning globe." />
        </p>
        <p>
            The web technologies that were originally developed for the creation
            of Geocities pages and mailing list address forms eventually broke
            containment and infiltrated every single facet of the modern
            graphical user interface-based world.
        </p>
        <p>
            Generally, to use them, you need to create a <strong>backend server
            application</strong> that can store data, make itself available on a
            network, and usually do most of the actual work that the thing
            you're making needs to do. When a web browser (aka a
            <strong>client</strong>) connects to it, the backend server will
            send <strong>client-side code</strong> to the browser that will tell
            the browser what to display to the user. The server application is
            known as the <strong>backend</strong>; the client-side code is
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
                <span>(JavaScript backend + <a href="https://react.dev/">React</a> frontend components.)</span>
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
                HTML files and open them with your web browser, but that does make
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

    <TechnologyGuide title="APIs">
        <template #description>
            A quick note on the concept
        </template>
        <p style="text-align: center">
            <img :src="apiImage" style="width: 300px; max-width: 80%" alt="A picture from Wikipedia of a person working at a very old-fashioned computer, captioned: 'Although the people who coined the term API were implementing software on a Univac 1108, the goal of their API was to make hardware independent programs possible.'" />
        </p>
        <p>
            API stands for Application Programming Interface and it is a very
            broad term that can refer to any agreed-upon system for enabling two
            computer programs or libraries to interact in a constructive way.
        </p>
        <p>
            A lot of the time, though, an API is going to turn out to be a
            service that provides structured data over the Internet. A classic
            example is the <a href="https://openweathermap.org/api">OpenWeather
            API</a>. You can create an API call, which in this case requires you
            to identify yourself using a unique API key that you got by making
            an account with the service, and your program will get back data in
            some specified format like JSON or XML that informs it what the
            weather is, was, or is predicted to be in a certain area. It will
            handle a certain amount of requests for free, and then expect you to
            pay up for more. You can create a program that uses that data to do
            things like critique picnicking schedules.
        </p>
        <p>
            This is essentially a backend web server (see the section above)
            that responds to network requests with raw data, instead of with
            client-side code that creates a graphical user interface. It is
            often useful to use an API to interact with fancy tools that you
            can't build yourself, like large language models (see the section
            below.)
        </p>
        <p>
            Often, libraries exist that provide pre-programmed ways to request
            data from any given API, like <a
            href="https://github.com/csparpa/pyowm">this</a> Python library that
            lets you get weather data with simple function calls. Keep an eye
            out for libraries like this, because they can be helpful.
        </p>
        <p>
            <a href="https://github.com/public-api-lists/public-api-lists">Here
            is a big list I found that encompasses many web APIs.</a>
        </p>
    </TechnologyGuide>

    <TechnologyGuide title="Artificial Intelligence">
        
        <template #description>
            This term typically refers to technology that can make sense out of
            the ambiguities involved in natural phenomenona like language or
            images in a probabilistic way.
        </template>

        <a href="https://nedroid.com" style="text-align: center; display: block; margin-bottom: 15px; margin-top: -10px" target="_blank">
            <img :src="aiImage" style="max-width: 90%" alt="A cartoonish drawing of a robot breakdancing. The caption reads 'I was built to destroy but right now I'm busy'" />
        </a>
        <p>
            Artificial intelligence is a highly technical field replete with
            functions with weird names like softmax and sigmoid and the promise
            that it'll replace us all (humans) any minute now, but the basic
            ideas are actually pretty approachable, and there are a lot of tools
            out there right now that package up the last few decades of the
            field's progress so you don't have to redo it.
        </p>
        <p>
            Here are a few ways to <a
            href="https://www.businessinsider.com/y-combinator-paul-graham-delve-ai-chatgpt-giveaway-email-pitch-2024-4">delve</a>
            into this fertile territory, from least to most hands-on:
        </p>
        <h3>
            Using existing tools via APIs
        </h3>
        <ul>
            <li>
                As covered in the section above, APIs let you request data from
                other people's computers and use it in your own endeavors. The <a
                href="https://platform.openai.com/docs/introduction">OpenAI API</a>,
                which you can use to get freshly generated text or images or
                transcribed audio or various other things, is the basis of tons of
                products and projects. However, as such, it's not free.
                <ul>
                    <li>
                        If you haven't opened an OpenAI account before, you are granted $5
                        of free credit for signing up, which expires after three months; $5
                        doesn't sound like a lot, but if you look at <a
                        href="https://openai.com/pricing">OpenAI's pricing</a>, it can go a
                        fairly long way.
                    </li>
                </ul>
            </li>
            <li>
                Google offers a lot more free credit for its <a
                href="https://cloud.google.com/use-cases/free-ai-tools">AI
                tools</a>, including <a
                href="https://ai.google.dev/pricing">Gemini</a>, its large
                language model. You can use Gemini 1.0 Pro for free at a maximum
                rate of 15 requests per minute - that won't let you deploy a
                product to hundreds of thousands of users, but it can be useful
                for a hackathon project here and there.
            </li>
            <li>
                Cohere, which has recently released a new large language model
                called Command R+ that has climbed the ranks on the Chatbot
                Arena Leaderboard, also <a
                href="https://cohere.com/pricing">offers free trial access to
                their API</a>.
            </li>
        </ul>

        <h3>
            Using existing tools through libraries
        </h3>

        <ul>
            <li>
                There are also many options for those ambitious enough to want
                to install a mechanical soul into their own actual computer. <a
                href="https://github.com/ggerganov/llama.cpp">llama.cpp</a> is a
                library that lets you run a variety of large language models
                locally for text completion and chat, although you'll be
                expected to have pretty decent specs to run the high-end ones.
            </li>
            <li>
                <a href="https://huggingface.co">Hugging Face</a> provides a vast
                array of models for different use cases that involve handling text,
                images, and audio, most of which can be downloaded and utilised in a
                few lines of code using their <a
                href="https://github.com/huggingface/transformers">transformers</a>
                Python library. Again, you might have to be a little bit patient to
                get results on an ordinary computer, but it is more exciting to see
                things like speech recognition happen right there in front of you.
            </li>
            <li>
                Also, there exist higher-level libraries that can make use of
                local and non-local machine learning models, like <a
                href="https://www.ibm.com/topics/langchain">LangChain</a>, which
                is a popular framework for building applications around large
                language models using techniques like retrieval-augmented
                generation (RAG), where the AI is given the ability to skim
                through text that you provide to identify relevant information
                and answer your questions. (Basically.)
            </li>
        </ul>
    
        <h3>
            Training brand new models
        </h3>
        <p>
            Although getting new machine learning models working takes quite a
            bit of ambition and patience, it is interesting to see how computers
            can turn data into the appearance of intelligence, and there are two
            whole extremely popular Python libraries to do it with.
        </p>
        <ul>
            <li>
                <a
                href="https://github.com/tensorflow/tensorflow">TensorFlow</a>
                has more stars on Github so I'm putting it first. It is a
                machine learning library created by Google and later integrated
                with another library called Keras that provides a high-level
                interface to the problem of turning e.g. a gigantic number of
                pictures of birds into a machine learning model that can
                recognize species of bird. It also provides access to <a
                href="https://www.tensorflow.org/hub">TensorFlow Hub</a>, which
                provides many models pre-trained for things like image
                recognition, which can be customized to recognize specific kinds
                of images, like those of birds.
            </li>
            <li>
                <a href="https://github.com/pytorch/pytorch">PyTorch</a> is used
                more by academics and is also perfectly capable of being used to
                create a bird recognizer. Although it seems to me like a lot of
                generalist usage of these libraries is centered around
                recognizing pictures of things, <a
                href="https://www.youtube.com/watch?v=kCc8FmEb1nY">here</a> is a
                YouTube video where a former OpenAI engineer uses PyTorch to
                build a GPT-style LLM, which is something.
            </li>
        </ul>

        <p>
            Note that <a href="https://colab.research.google.com/">Google
            Colab</a> and <a href="https://www.kaggle.com/">Kaggle</a> both
            provide <a href="https://jupyter.org/">Jupyter Notebook</a>-based
            Python environments that are commonly used to test out AI projects.
        </p>

    </TechnologyGuide>

    <TechnologyGuide title="Apps!">
        
        <template #description>
            Creating simple and useful programs that one can install on one's
            phone or computer is still a thing.
        </template>

        <p style="text-align: center">
            <img :src="appImage" style="width: 400px; max-width: 90%" />
        </p>

        <p>
            Native, installable apps can benefit in speed, look, and feel from
            being built to run on a specific kind of device. There are usually
            relatively straightforward recommended ways to build apps for a
            specific platform; there aren't a huge number of different ideas for
            how to deploy things crowding into the field. How you create your app
            depends largely on where you want it to run, so let's go through the
            possibilities:
        </p>

        <h3>Windows</h3>

        <p>
            If you want to create an app for Windows, you should probably use
            the Windows Presentation Foundation (WPF) framework. It lets you
            create apps using XAML, which is like HTML but for Windows, and C#.
            The simplest way to use WPF is to create a new project with it in <a
            href="https://visualstudio.microsoft.com/vs/">Microsoft Visual
            Studio</a>.
        </p>

        <h3>MacOS/iOS</h3>
        <p>
            Apple's devices currently use the <a
            href="https://developer.apple.com/xcode/swiftui/">SwiftUI</a>
            framework for creating apps, which is build around the new-ish programming
            language called Swift.
        </p>

        <h3>Android</h3>
        <p>
            Android apps are currently usually built in <a
            href="https://developer.android.com/studio">Android Studio</a> using
            a new-ish programming language called Kotlin.
        </p>

        <h3>Cross-Platform for Desktop</h3>
        <p>
            <a href="https://www.qt.io/">Qt</a> is a C++ library that is mostly
            used to make desktop apps for MacOS, Linux, and Windows by projects
            ranging from Maya to VLC Player. It also has a Python version.
        </p>

        <h3>Cross-Platform for Mobile</h3>
        <p>
            Guess what, React Native is a popular way to create apps for phones
            that are not on the web but somehow still use JavaScript. God why.
        </p>

        <h3>Cross-platform in General</h3>
        <p>
            <a href="https://flutter.dev/">Flutter</a> is a new-ish framework
            created by Google that I've seen work well on desktop and on mobile.
        </p>

    </TechnologyGuide>

    <!-- <TechnologyGuide title="Games">
        
        <template #description>
            Video games can be fun.
        </template>

    </TechnologyGuide> -->

    <h2>But:</h2>
    <p>
        Don't let this list of technologies hold you back!
    </p>
    <p>
        The above is meant to be a survey of the most common ways to accomplish
        different tasks, not an exhaustive list of interesting bases for
        projects. You can ignore all of the above and build a GUI in <a
        href="https://ziglang.org/">Zig</a> or a command line app in Lisp, as
        long as it does something interesting and you learn something while
        doing it.
    </p>

    <p style="font-size: small">
        This content is released under the terms of <a
        href="https://creativecommons.org/licenses/by/4.0/">CC-BY 4.0</a>.
    </p>

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

import wwwGif from "@/assets/technology_guide/www.gif";
import aiImage from "@/assets/technology_guide/ai.jpg";
import apiImage from "@/assets/technology_guide/api.jpg";
import appImage from "@/assets/technology_guide/app.png";

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
    & > h3 {
        border-radius: 0;
    }
}
li {
    margin: 8px;
}
</style>
