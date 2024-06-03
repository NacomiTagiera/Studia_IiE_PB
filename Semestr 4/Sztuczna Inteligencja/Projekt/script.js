let przedmioty = [];
const dodanePrzedmiotyDiv = document.getElementById('dodanePrzedmioty');
const dniTygodnia = ['poniedzialek', 'wtorek', 'sroda', 'czwartek', 'piatek'];

const getInputValueAndReset = (inputId) => {
	const input = document.getElementById(inputId);
	const value = input.value;
	input.value = '';
	return value;
};

const dodajPrzedmiot = (e) => {
	e.preventDefault();

	const nazwa = getInputValueAndReset('nazwa');
	const ilosc = parseInt(getInputValueAndReset('ilosc'));
	const preferowanyDzien = parseInt(getInputValueAndReset('preferowanyDzien'));

	if (isValidPrzedmiot(nazwa, ilosc)) {
		przedmioty.push({ nazwa, ilosc, preferowanyDzien });
		wyswietlDodanePrzedmioty();
	}
};

const isValidPrzedmiot = (nazwa, ilosc, dzien) => {
	if (dzien < 0 || dzien > 5) {
		alert('Nieprawidłowy dzień tygodnia');
		return false;
	}

	return nazwa.trim() !== '' && !isNaN(ilosc) && ilosc > 0;
};

const wyswietlDodanePrzedmioty = () => {
	dodanePrzedmiotyDiv.innerHTML = '';
	przedmioty.forEach((przedmiot) => {
		const przedmiotDiv = document.createElement('div');
		przedmiotDiv.textContent = `${przedmiot.nazwa} (liczba godzin: ${
			przedmiot.ilosc
		}, preferowany dzień: ${getNazwaDnia(przedmiot.preferowanyDzien)})`;
		dodanePrzedmiotyDiv.appendChild(przedmiotDiv);
	});
};

const znajdzPrzedmiot = (wiersz, kolumna) => {
	const dostepnePrzedmioty = przedmioty.filter(
		(przedmiot) =>
			przedmiot.ilosc > 0 &&
			(przedmiot.preferowanyDzien === 0 || przedmiot.preferowanyDzien === kolumna),
	);

	if (dostepnePrzedmioty.length === 0) {
		return null;
	}

	const wybranePrzedmioty = dostepnePrzedmioty.filter((przedmiot) => {
		const nazwa = przedmiot.nazwa;
		const limit = 3; // maksymalna liczba wystąpień danego przedmiotu w danym dniu
		const wystapienia = Array.from(
			document.querySelectorAll(`#${getIdKolumny(kolumna)}${wiersz}`),
		).filter((komorka) => komorka.textContent === nazwa).length;

		return wystapienia < limit;
	});

	if (wybranePrzedmioty.length === 0) {
		return null;
	}

	const losowyIndeks = Math.floor(Math.random() * wybranePrzedmioty.length);
	const wybranyPrzedmiot = wybranePrzedmioty[losowyIndeks];
	wybranyPrzedmiot.ilosc--;
	przedmioty = przedmioty.filter((przedmiot) => przedmiot.ilosc > 0);

	return wybranyPrzedmiot.nazwa;
};

const getIdKolumny = (kolumna) => {
	const ids = ['p', 'wt', 'śr', 'cz', 'pt'];
	return ids[kolumna - 1] || '';
};

const getCheckbox = (id) => document.getElementById(id);

const wpiszPrzedmioty = (e) => {
	e.preventDefault();

	const tabela = document.querySelector('table');
	const wiersze = tabela.getElementsByTagName('tr');

	for (let i = 1; i < wiersze.length; i++) {
		const komorki = wiersze[i].getElementsByTagName('td');

		for (let j = 1; j < komorki.length; j++) {
			let nazwaPrzedmiotu = null;

			if (!getCheckbox(dniTygodnia[j - 1]).checked) {
				nazwaPrzedmiotu = znajdzPrzedmiot(i, j);
			}

			if (nazwaPrzedmiotu !== null) {
				komorki[j].textContent = nazwaPrzedmiotu;
			}
		}
	}
};

const getNazwaDnia = (dzien) => {
	const dni = ['brak preferencji', ...dniTygodnia];
	return dni[dzien] || '';
};

document.getElementById('dodajPrzedmiot').addEventListener('click', dodajPrzedmiot);
document.getElementById('wpiszPrzedmioty').addEventListener('click', wpiszPrzedmioty);
