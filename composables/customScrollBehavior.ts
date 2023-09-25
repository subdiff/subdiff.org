export const customScrollBehavior = (to: { hash: any }, from: any, savedPosition: any) => {
    if (to && to.hash) {
        return {
            el: to.hash,
            // Avoid blocking the view with our navigation bar.
            top: 80
        }
    }
    if (savedPosition) {
        return savedPosition
    }
    return { left: 0, top: 0 }
};
