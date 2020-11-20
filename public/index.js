const ui = {
	'getUsersButton': document.querySelector('.getUsersButton'),
	'listTextFilesButton': document.querySelector('.listTextFilesButton'),
	'createTextFileTextArea': document.querySelector('.createTextFileTextArea'),
	'createTextFileButton': document.querySelector('.createTextFileButton'),
};

ui.getUsersButton.onclick = async e => {
	const users = await apiFetch('users');
	console.log('users', users);
}

function apiFetch(path, payload = {}) {
	return fetch(`./api/${path}`, {
		'method': 'POST',
		'headers': {
			'Content-Type': 'application/json',
		},
		'body': JSON.stringify(payload),
	})
		.then(res => res.json());
}