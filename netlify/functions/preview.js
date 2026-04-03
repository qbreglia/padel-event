exports.handler = async function(event, context) {
  const eventId = event.queryStringParameters?.event || '';
  const userAgent = event.headers['user-agent'] || '';
  const isCrawler = /facebookexternalhit|whatsapp|twitterbot|linkedinbot|telegrambot|slackbot|discordbot/i.test(userAgent);
  const appUrl = `https://partido-de-padel.netlify.app/?event=${eventId}`;
  const imageUrl = 'https://res.cloudinary.com/dc8ih423g/image/upload/v1775232171/Gemini_Generated_Image_8713d38713d38713_iekmof.png';

  if (isCrawler) {
    return {
      statusCode: 200,
      headers: { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'public, max-age=3600' },
      body: `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="utf-8" />
  <title>Te invitaron a un partido de pádel</title>
  <meta property="og:type" content="website" />
  <meta property="og:title" content="Te invitaron a un partido de pádel" />
  <meta property="og:description" content="Abrí el link para ver los detalles y confirmar si vas." />
  <meta property="og:image" content="${imageUrl}" />
  <meta property="og:image:width" content="1408" />
  <meta property="og:image:height" content="768" />
  <meta property="og:url" content="${appUrl}" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta http-equiv="refresh" content="0;url=${appUrl}" />
</head>
<body><a href="${appUrl}">Hacé clic acá si no te redirige</a></body>
</html>`
    };
  }

  return {
    statusCode: 302,
    headers: { Location: appUrl }
  };
};
