import PeruFlag from '@layouts/partials/Header/flags/Peru.astro';
import UnitedStatesFlag from '@layouts/partials/Header/flags/UnitedStates.astro';
// Add missing imports
export const LANGUAGES: Record<
	string,
	{ code: string; name: string; flag: typeof PeruFlag}
> = {
	en: {
		code: 'en',
		name: 'EN',
		flag: UnitedStatesFlag,
	},
	es: {
		code: 'es',
		name: 'ES',
		flag: PeruFlag,
	},
};

export const defaultLang = 'es';
export const showDefaultLang = true;

export const ui = {
	es: {
		'nav.home': 'Inicio',
		'nav.about': 'Nosotros',
                'nav.products': 'Productos',
                'nav.blog': 'Blog',
                'nav.educational': 'Educativo',
                'nav.entertainment': 'Entretenimiento',
                'nav.scientific': 'Científico',
		'nav.contact': 'Contacto',
	},
	en: {
		'nav.home': 'Home',
		'nav.about': 'About',
                'nav.products': 'Products',
                'nav.blog': 'Blog',
                'nav.educational': 'Educational',
                'nav.entertainment': 'Entertainment',
                'nav.scientific': 'Scientific',
		'nav.contact': 'Contact',
	},
} as const;

export const routes = {
	es: {
		'home': '/',
		'about': 'about',
                'products': 'products',
                'blog': 'blog',
                'blog/educational': 'blog/educational',
                'blog/entertainment': 'blog/entertainment',
                'blog/scientific': 'blog/scientific',
                'contact': 'contact',
        },
        en: {
                'home': '/',
                'about': 'about',
                'products': 'products',
                'blog': 'blog',
                'blog/educational': 'educational',
                'blog/entertainment': 'entertainment',
                'blog/scientific': 'scientific',
                'contact': 'contact',
        },
};
