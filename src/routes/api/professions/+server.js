import { json } from '@sveltejs/kit';

const professions = [
  "<Backend Developer />",
	"<Full Stack Developer />",
	"<Software Developer />",
	"<Discord Bot Developer />",
	"<Game Developer />",
	"<First Level IT Support/>"
];

export async function GET({ url }) {
  const count = parseInt(url.searchParams.get('count')) || professions.length;
  const random = url.searchParams.get('random') === 'true';
  
  let result = [...professions];
  
  if (random) {
    result = result.sort(() => Math.random() - 0.5);
  }
  
  return json(result.slice(0, count), {
    headers: {
      'Cache-Control': 'max-age=1800' // Cache for 30 minutes
    }
  });
}
