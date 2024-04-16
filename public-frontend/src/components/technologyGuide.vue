<template>
    <Accordion style="margin-top: 30px">
        <AccordionTab>
            <template #header>
                <div style="margin-right: 10px">
                    <h2 style="margin: 0 0 10px 0">{{ title }}</h2>
                    <slot name="description"></slot>
                </div>
            </template>
            <slot></slot>
        </AccordionTab>
    </Accordion>
</template>

<script setup>
import Accordion from 'primevue/accordion';
import AccordionTab from 'primevue/accordiontab';
defineProps({
    title: {
        type: String,
        required: true
    }
});
</script>

<style scoped lang="scss">
:deep(.p-accordion-header-link) {
    background: #1e1e1e!important;
    &:hover {
        background: #222!important;
    }
}
:deep(.p-accordion-toggle-icon) {
    flex-shrink: 0;
}
</style>
