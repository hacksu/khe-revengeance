<template>
    <Carousel :value="$slots.default()">
        <template #item="inputValue">
            <RenderNode :nodeToRender="inputValue.data" />
        </template>
    </Carousel>
</template>

<script>
// this component creates a carousel in which each of its child elements is an
// item.

// in contrast to the vanilla PrimeVue Carousel component, which expects to
// receive an array of objects via its "value" prop that all get mapped into DOM
// elements the same way, this wrapper component will use each of its child
// elements as the items in the carousel. this means that each item in the
// carousel can easily have different HTML in it.

// to accomplish this, the children of this component are retrieved using
// $slots.default(). each of those children will take the form of an object of
// type VNode. these VNodes are passed to the <Carousel> as the objects that
// need to be mapped into DOM elements. then, a very simple utility component
// called <RenderNode> is used to trivially "map" the VNodes into Vue's virtual
// DOM using a render function.

// (you can apparently use <Component> with :is="..." to do the same thing that
// <RenderNode> is doing here, but that's undocumented/possibly unintended
// functionality)

import Carousel from "primevue/carousel";
export default {
    name: "ProjectCarousel",
    components: {
        Carousel,
        // this technically constitutes a complete component definition:
        RenderNode: {
            props: ["nodeToRender"],
            render: (instance) => instance.nodeToRender
        }
    }
}
</script>
