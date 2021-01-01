const express = require('express');
const exphbs  = require('express-handlebars');
const bodyParser = require('body-parser');
const fs = require('fs');




const mangas = loadMangas();

const app = express();
app.engine('hbs', exphbs());
app.set('view engine', 'hbs');
app.use(bodyParser.json());

app.get('/', function (req, res) {
	res.render('index', {
		layout: false,
		mangas,
	});
});

app.get('/mangas', function (req, res) {
	res.send(mangas);
});

app.post('/mangas', function (req, res) {
	const manga = req.body;
	
	if (manga) {
		mangas.push(manga);
		saveMangas();
	  res.status(201).end();
	}
	else {
		res.status(400).send();
	}
});
	
app.delete('/mangas/:id', function (req, res) {
	const id = parseInt(req.params.id);
	const elementSupp = mangas.splice(id, 1);
	if (elementSupp.length > 0) {
		saveMangas();
		res.status(204).send();
	}
	else {
		res.status(404).send();
	}
});
	

app.use(express.static('public'));

app.listen(3000, function () {
    console.log('Votre app est disponible sur localhost:3000 !')
});


////////////

function saveMangas() {
	const content = JSON.stringify(mangas, null, 2);
	fs.writeFileSync("mangas.json", content);
}

function loadMangas() {
	const buffer = fs.readFileSync("mangas.json");
  const content = buffer.toString();
	const obj = JSON.parse(content);
	return obj;
}
