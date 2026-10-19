import { defineNuxtPlugin } from "#app";
import PrimeVue from "primevue/config";
import Accordion from 'primevue/accordion';
import AccordionTab from 'primevue/accordiontab';
import Fieldset from 'primevue/fieldset';
import Panel from 'primevue/panel';

export default defineNuxtPlugin((nuxtApp) => {
    nuxtApp.vueApp.use(PrimeVue, { ripple: true, unstyled: false });
    nuxtApp.vueApp.component('Accordion', Accordion);
    nuxtApp.vueApp.component('AccordionTab', AccordionTab);
    nuxtApp.vueApp.component('Fieldset', Fieldset);
    nuxtApp.vueApp.component('Panel', Panel);
});
