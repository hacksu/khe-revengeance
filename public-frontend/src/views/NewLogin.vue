<template>
    <div id="login" class="widget">
        <div class="back"></div>
        <h2>Log in to your account</h2>
        <p>(Currently only useful to staff)</p>
        <a href="/login/github"><button>Log in through Github</button></a>
        <a href="/login/discord"><button>Log in through Discord</button></a>
    </div>
</template>

<style scoped lang="scss">
@import "@/styles/global.scss";
@import '@/styles/space.scss';

#login {
    @include bg-primary;
    text-align: center;
    // padding: 2rem 6rem;
    padding: 100px 6rem 100px 6rem;
    font-size: 20px;
    line-height: 30px;
    // height: 100vh;
    max-width: 600px;
    margin-left: auto;
    margin-right: auto;
}

a button {
    display: block;
    margin: 10px auto;
    text-align: center;
    width: 300px;
    font-size: 1em;
}
</style>
