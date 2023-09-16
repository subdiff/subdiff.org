export default defineNuxtPlugin(({ vueApp }) => {
    vueApp.directive('click-outside', {
        mounted(el, binding, vnode) {
            el.clickOutsideEvent = function (event: Event) {
                if (!(el == event.target || el.contains(event.target))) {
                    binding.value(event, el);
                }
            };
            document.body.addEventListener('click', el.clickOutsideEvent)
        },
        unmounted: function (el) {
            document.body.removeEventListener('click', el.clickOutsideEvent)
        },
    });
});