import { ui, defaultLang, showDefaultLang, routes } from './ui';

export function getLangFromUrl(url: URL) {
	const [, lang] = url.pathname.split('/');
	if (lang in ui) return lang as keyof typeof ui;
	return defaultLang;
}

export function useTranslations(lang: keyof typeof ui) {
	return function t(key: keyof (typeof ui)[typeof defaultLang]) {
		return ui[lang][key] || ui[defaultLang][key];
	};
}

export function useTranslatedPath(lang: keyof typeof ui) {
	return function translatePath(path: string, l: string = lang) {
		const pathName = path.replaceAll('/', '');
		const hasTranslation =
			defaultLang !== l &&
			(routes[l as keyof typeof routes] as Record<string, string>)[
				pathName
			] !== undefined;
		const translatedPath = hasTranslation
			? '/' +
			  (routes[l as keyof typeof routes] as Record<string, string>)[
					pathName
			  ]
			: path;

		return !showDefaultLang && l === defaultLang
			? translatedPath
			: `/${l}${translatedPath}`;
	};
}

function findIndexConvertibleToNumber(arr: string[]): number {
    for (let i = 0; i < arr.length; i++) {
        // Intentar convertir el elemento en un número
        const num = parseInt(arr[i]);
        // Verificar si la conversión fue exitosa y el número es un entero
        if (!isNaN(num) && Number.isInteger(num)) {
            // Devolver el índice del elemento que puede convertirse en número
            return i;
        }
    }
    // Si no se encuentra ningún elemento que pueda convertirse en número, devolver -1
    return -1;
}

function splitArrayAtElement(arr: string[]): [string[], string[]] {
    // Verificar si la palabra "page" está en el array
    const pageIndex = arr.indexOf('page');
    if (pageIndex !== -1) {
        // Si la palabra "page" está presente, dividir el array en dos partes en ese punto
        const firstPart = arr.slice(0, pageIndex);
        const secondPart = arr.slice(pageIndex);
        return [firstPart, secondPart];
    } else {
        // Si la palabra "page" no está presente, buscar un elemento que pueda convertirse en número
        const index = findIndexConvertibleToNumber(arr);
        ////console.log(index)
        if (index !== -1) {
            // Si se encuentra un elemento que puede convertirse en número, dividir el array en dos partes
            const firstPart = arr.slice(0, index);
            const secondPart = arr.slice(index);
            return [firstPart, secondPart];
        } else {
            // Si no se encuentra ningún elemento que pueda convertirse en número, devolver el array original y un array vacío
            return [arr, []];
        }
    }
}


function concatenateWithDelimiter(str: string, arr: string[]): string {
  if (!str) {
    return arr.join('/');
  }

  if (arr.length === 0) {
    return str;
  }

  return `${str}/${arr.join('/')}`;
}

export function getRouteFromUrl(url: URL): string | undefined {
  const pathname = new URL(url).pathname;
  const parts = pathname?.split('/') ?? [];
  const [firstPart, secondPart] = splitArrayAtElement(parts);
  const currentLang = getLangFromUrl(url);

  const relevantSegments = firstPart
    .filter((segment) => segment !== '')
    .filter((segment, index) => !(index === 0 && segment === currentLang));

  if (relevantSegments.length === 0) {
      return '';
  }

  const leafSegment = relevantSegments[relevantSegments.length - 1];
  if (!leafSegment) {
      return '';
  }

  const baseSegments = relevantSegments.slice(0, -1);
  const combinedSegments = [...baseSegments, leafSegment];
  const combinedPath = combinedSegments.filter(Boolean).join('/');

  const trailingSegments = secondPart.filter((segment) => segment !== '');
  const appendTrailing = (base: string) => concatenateWithDelimiter(base, trailingSegments);

  if (defaultLang === currentLang) {
      return appendTrailing(combinedPath);
  }

  const getKeyByValue = (
      obj: Record<string, string>,
      value: string
  ): string | undefined => {
      return Object.keys(obj).find((key) => obj[key] === value);
  };

  const reversedKey = getKeyByValue(routes[currentLang], leafSegment);

  if (reversedKey !== undefined) {
      return appendTrailing(reversedKey);
  }

  return appendTrailing(combinedPath);
}
