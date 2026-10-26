import { nextTick } from 'vue';
import { useRoute, useRouter } from 'vue-router';

export type HomeSection = 'quienesSomos' | 'nuestrosTrabajos' | 'colores' | 'coloresMelamina' | 'contacto';

export function useHomeNavigation() {
    const route = useRoute();
    const router = useRouter();

    async function navigateToHomeSection(section: HomeSection) {
        const hash = `#${section}`;
        const changedPage = route.path !== '/';
        let onHomeEntered: (() => void) | undefined;
        const homeEntered = changedPage
            ? new Promise<void>(resolve => {
                const listener = () => {
                    window.removeEventListener('home-route-entered', listener);
                    resolve();
                };
                onHomeEntered = listener;
                window.addEventListener('home-route-entered', onHomeEntered, { once: true });
            })
            : Promise.resolve();

        try {
            if (changedPage || route.hash !== hash) {
                const failure = await router.push({ path: '/', hash });
                if (failure || route.path !== '/') {
                    if (onHomeEntered) window.removeEventListener('home-route-entered', onHomeEntered);
                    return;
                }
            }

            if (changedPage) await homeEntered;
        } catch (error) {
            if (onHomeEntered) window.removeEventListener('home-route-entered', onHomeEntered);
            throw error;
        }

        await nextTick();
        await new Promise<void>(resolve => requestAnimationFrame(() => requestAnimationFrame(() => resolve())));

        const anchor = document.getElementById(section);
        if (!anchor) {
            throw new Error(`No se encontró la sección de inicio "${section}"`);
        }

        const headerHeight = document.getElementById('site-navbar')?.getBoundingClientRect().height ?? 96;
        const top = anchor.getBoundingClientRect().top + window.scrollY - headerHeight;
        window.scrollTo({ top, behavior: 'smooth' });
    }

    return { navigateToHomeSection };
}
