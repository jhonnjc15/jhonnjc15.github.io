// content reading
const readingTime = (content: string, locale: string = "en") => {
  const WPS = 275 / 60;

  let images = 0;
  const regex = /\w/;

  let words = content.split(" ").filter((word) => {
    if (word.includes("<img")) {
      images += 1;
    }
    return regex.test(word);
  }).length;

  let imageAdjust = images * 4;
  let imageSecs = 0;
  let imageFactor = 12;

  while (images) {
    imageSecs += imageFactor;
    if (imageFactor > 3) {
      imageFactor -= 1;
    }
    images -= 1;
  }

  const minutes = Math.ceil(((words - imageAdjust) / WPS + imageSecs) / 60);

  const isSpanish = locale.startsWith("es");
  const paddedMinutes = minutes < 10 ? `0${minutes}` : `${minutes}`;

  if (isSpanish) {
    return `${paddedMinutes} min de lectura`;
  }

  if (minutes === 1) {
    return `${paddedMinutes} Min read`;
  }

  return `${paddedMinutes} Mins read`;
};

export default readingTime;
