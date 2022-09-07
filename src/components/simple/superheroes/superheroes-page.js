const { getSupeheroesPage } = require('../../../lib/api/superheroes.api');
const { createInlineNavigationKeboard } = require('../../../lib/keyboards/dynamic-keyboards');
const { navigatonMarks, navigationMarks } = require('../../../store/strings');

async function createSuperheroesPage(page, speciality) {
	const { superheroes, navigation } = await getSupeheroesPage(page, speciality);

	navigation.mark = navigationMarks.SUPERHEROES;
	if (navigation.left) navigation.left += `-${speciality}`;
	if (navigation.right) navigation.right += `-${speciality}`;

	//	Create 'back' button
	const keyboard = createInlineNavigationKeboard(navigation, true, {
		text: 'Назад',
		callbackData: `${navigationMarks.SUPERHEROES}_ENTRY`,
	});

	if (!superheroes.length) return ['Тут пока никого нет(', keyboard];

	const message = superheroes.reduce(
		(prev, superhero) => prev + createSuperheroInfoCard(superhero) + '\n',
		''
	);

	return [message, keyboard];
}

//	Creates SRTING with info about superhero
function createSuperheroInfoCard(superhero) {
	let message = '';

	message += `${superhero.first_name} ${superhero.last_name}\n`;
	message += `Специальность: ${superhero.speciality}\n`;
	message += `Кафедра: ${superhero.university_department}\n`;
	message += `Курс: ${superhero.year}\n`;

	return message;
}

module.exports = { createSuperheroesPage };
