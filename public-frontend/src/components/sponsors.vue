<template>
    <div style="display: flex; gap: 30px; flex-wrap: wrap; flex-direction: column; align-items: center;">
        <a href="https://www.wolframalpha.com/" target="_blank" title="Wolfram Alpha">
            <WolframAlpha style="width: 600px; height: 150px; background-color: white; border-radius: 10px;"/>
        </a>
        <a href="https://ybi.org" target="_blank" title="Youngstown Business Incubator">
            <img src="@/assets/ybi.png" style="width: 600px; height: auto; border-radius: 10px;" />
        </a>
        <a href="https://enbasis.com/" target="_blank" title="Enbasis">
            <Enbasis style="width: 600px; height: 150px; border-radius: 10px;" />
        </a>
    </div>
</template>

<script setup>
import WolframAlpha from "@/assets/wolfram-corporate-logo-horizontal.svg?component"
import Enbasis from "@/assets/enbasis.svg?component";
</script>
