# What Is This?

In /public-frontend, there is a Vite + Vue project that can operate in development server mode or leverage [vite-ssg](https://github.com/antfu/vite-ssg) to pre-render plain HTML+CSS+JS for production.

In /staff-frontend, there is a minimal Next.js React project that can do the same things via built-in Next.js stuff.

In /global-includes, there are database model classes that Remult can use to automatically create database tables and an API that modifies them.

In /server, there is a server application that ties everything together. In dev mode, it creates Remult, Vite, and Next.js server middleware, and puts up the staff frontend at staff.localhost:3000 and the public frontend and Remult API at localhost:3000. Requests are routed seamlessly; the database API is globally available, but the sites are neatly separated.

# How Do I Use It?

[Install Node.js](https://nodejs.org/en), which will run our server-side code. Open the root directory of this repository in your terminal. Install [yarn](https://yarnpkg.com/), which will download the site's libraries, tools, and dependencies, by running `npm install -g yarn` in it. Install this project's specific dependencies by running `yarn install`. Then, run the project by inputting `yarn dev`.

# Why?

The existing public site for KHE, which is written in Vue, is not in bad shape and mostly just needs a fresh coat of paint; so, I'm using it as a base with Vite as the build system responsible for it. The existing staff site for KHE is very old and written in AngularJS, so I think it should be mostly replaced with a Next.js project. Also, why not?

If you are new to this kind of project, kindly read the next 1,000,000 words of explanation in order to better understand the above.

## JavaScript

is a language. Originally, JavaScript ran in web browsers to make simple changes to HTML web pages in response to visitor's actions. In [the words](https://softwareengineering.stackexchange.com/a/221658) of one of the relevant developers: "The by-design purpose of JavaScript was to make the monkey dance when you moused over it. Scripts were often a single line." Now, JavaScript generates most new pages on the Internet completely on its own.

First of all, JavaScript can run outside of the browser now. Node.js is a program that can run arbitrary JavaScript code wherever a normal program can be installed. Many web developers use this to write and run "backend" or "server-side" JavaScript code, which is code that will run on a server and do things the browser-side code cannot, like store and retrieve information from a centralized database. The code that actually runs in a user's browser to show them pictures and respond to button presses is called, in contrast, frontend code.

## How to Write Frontend Code

The typical modern frontend development process involves writing HTML-like templates and then feeding those templates into a JavaScript library like React or Vue. The templates become these things known as "components", which are reusable units of code that work kind of like functions in normal programming; they have variables, which make up what is known as the components' "state." The JavaScript library automatically fills in the templates by using the initial values of the variables used by the components. Then, it changes that state as needed by assigning new value to the variables in functions that run when users do things. Importantly, whenever the state variables are updated, the JavaScript library automatically updates the templates to match the current state.

Writing functions that directly modify HTML is kind of tricky a lot of the time; believe it or not, writing templates that use variables and then writing functions that modify those variables is actually easier; so that's where we are.

This is the loose code for a simple component written with the JavaScript library "React". Go [here](https://stackblitz.com/edit/react-1wd8ln?file=src%2FApp.js) to see it run.

```js
import React, { useState } from "react";

export default function MyComponent() {
  // create component state variable called "greeting"; initialize it to the
  // string "hello world":
  const [greeting, setGreeting] = useState("hello world");
  // create a function that will update oir state in response to user actions:
  function leaveWorld() {
    setGreeting("goodbye world");
  }
  // use these JavaScript things in an HTML-like template:
  return (
    <>
      <p>{greeting}</p>
      <button onClick={leaveWorld}>Say Goodbye</button>
    </>
  );
}
```

This is the loose code that accomplishes the same thing with Vue. Go [here](https://stackblitz.com/edit/vue3-vite-starter-nythwm?file=src/App.vue) to see it run.

```html
<script setup>
  import { ref } from "vue";
  // create component state variable called "greeting"; initialize it to the
  // string "hello world":
  const greeting = ref("hello world");
  // create a function that will update our state in response to user actions:
  function leaveWorld() {
    greeting.value = "goodbye world";
  }
</script>

<template>
  <!-- use these JavaScript things in an HTML-like template: -->
  <p>{{ greeting }}</p>
  <button :onClick="leaveWorld">Say Goodbye</button>
</template>
```

You will notice that the comments in the two versions are identical. The two libraries accomplish very similar things. They used to be more different, but this is the latest method for defining components in each library.

## The Compilation Step

Neither library's HTML-like template syntax is actualy valid JavaScript that web browsers can understand. Both of the above examples need to be compiled before browsers can understand them. There are many tools that are used to solve this problem, but the most recent fastest and buzziest top-level tool for accomplishing this is called Vite. There is also an older tool that is still very widely used called Webpack. Both of these programs have the ability to constantly re-compile and reload components in your browser as you develop them, as well as the ability to output a small, compressed, optimized JavaScript "bundle" (potentially containing many files combined into one) that, when you're done developing, can be served to browsers over the Internet at top speed.

This is how many Vue and React sites work: the developers write code using their favorite library; the compiler turns that code into valid browser-friendly JavaScript; and the browser runs that code to create pages when the user downloads it. Basically no actual HTML is sent to browsers; JavaScript runs to create and arrange everything on screen. Additionally, the same JavaScript will usually be sent to the browser no matter what page the visitor visits; the code has to detect the URL the browser has open and choose what page to render correspondingly. This is known as the SPA or single-page app approach, since there is effectively only one page; it's just being rendered in different ways by JavaScript and the browser, based on the user's actions and the current web address.

## Making Life Easier for Browsers

It is mean to not have HTML to send to browsers, and to make them do all that work themselves. It is also potentially quite slow, depending on the speed of your users' computers. It is also hard for search engines to figure out what search terms match your page when the page is blank when it initially loads and they have to run JavaScript to fill it in. Fortunately, as mentioned before, we have the ability to run JavaScript outside of the browser, thanks to Node.js. Running our frontend code in Node.js lets us turn it or some of it into real HTML before sending it to the browser, so the content loads more quickly and is understandable to search engines.

Next.js is a library for React that automatically turns React components into HTML web pages. It is currently occuping the /staff-frontend folder. You can put it in SPA mode, where all the page rendering is done on the frontend, but you can also use it for server-side rendering (SSR), where the React code is partially turned into HTML before it's sent to the browser, or static site generation (SSG), where the React code is completely turned into HTML files that can then be used however you want. Behind the scenes, Next.js uses Webpack.

Vite is the easiest way to render Vue sites like the existing old KHE public website that the new one is going to be based on. It creates SPA apps by default, but with the libraries vite-ssr and vite-ssg, it can also be made to do server-side rendering and static site generation.

## So those are the basics of how the frontend code works.

The backend code is located in the /server directory. It starts up the Vite and Next.js servers, and sends browser requests that start with staff.\[khe.io] to the Next.js server and the others to the Vite server. It also uses a backend library called Remult to create a database consisting of objects that follow the class specifications in the /global-includes directory. The database can then be accessed from the frontend by importing different Remult code and running it in the Vite and in the Next.js projects; doing this will cause the Remult code that should run on the frontend to send a request to the server that the Remult code running on the backend will respond to.

Currently, Remult just creates a JSON file in the db folder to serve as a simple database, but at some point we should make it instead save stuff in MongoDB so it can be faster.

The backend code is written in TypeScript, which is a version of JavaScript in which variables and objects are annotated with types. Without TypeScript, any variable can be any type and any object can have any member variables or member functions; this shouldn't be a big problem on the frontend, since there won't be a ton of variables or data, but on the backend, especially when interacting with databases, it is important to be clear about what data you are accepting and emitting. TypeScript needs to be compiled (technically, "transpiled") to regular JavaScript for Node.js to run it. Such is life.

## To be continued?
