let przedmioty = [];
const dodanePrzedmiotyDiv = document.getElementById('dodanePrzedmioty');
const dniTygodnia = ['poniedzialek', 'wtorek', 'sroda', 'czwartek', 'piatek'];
const tabela = document.querySelector('table');

// funkcja pobierająca wartość z elementu input o danym ID, czyszcząca ten input i zwracająca pobraną wartość
const getInputValueAndReset = (inputId) => {
	const input = document.getElementById(inputId);
	const value = input.value;
	input.value = '';
	return value;
};

// funkcja wywoływana po naciśnięciu przycisku "Dodaj Przedmiot"
const dodajPrzedmiot = (e) => {
	e.preventDefault();

	// pobieranie wartości z inputów
	const nazwa = getInputValueAndReset('nazwa');
	const ilosc = parseInt(getInputValueAndReset('ilosc'));
	const preferowanyDzien = parseInt(getInputValueAndReset('preferowanyDzien'));

	// sprawdzanie poprawności danych i dodawanie przedmiotu do tablicy
	if (isValidPrzedmiot(nazwa, ilosc, preferowanyDzien)) {
		przedmioty.push({ nazwa, ilosc, preferowanyDzien });
		wyswietlDodanePrzedmioty();
	}
};

// funkcja sprawdzająca poprawność danych przedmiotu
const isValidPrzedmiot = (nazwa, ilosc, dzien) => {
	if (dzien < 0 || dzien > 5) {
		alert('Nieprawidłowy dzień tygodnia');
		return false;
	}

	return nazwa.trim() !== '' && !isNaN(ilosc) && ilosc > 0;
};

// funkcja aktualizująca wyświetlanie dodanych przedmiotów
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

// funkcja szukająca dostępnego przedmiotu na podstawie preferowanego dnia i jego ilości
const znajdzPrzedmiot = (kolumna) => {
	// Filtracja przedmiotów z uwzględnieniem preferowanego dnia
	let dostepnePrzedmioty = przedmioty.filter(
		(przedmiot) => przedmiot.ilosc > 0 && przedmiot.preferowanyDzien === kolumna,
	);

	// Jeśli brak przedmiotów dla preferowanego dnia, szuka bez preferencji
	if (dostepnePrzedmioty.length === 0) {
		dostepnePrzedmioty = przedmioty.filter(
			(przedmiot) => przedmiot.ilosc > 0 && przedmiot.preferowanyDzien === 0,
		);
	}

	// Jeśli nadal brak przedmiotów, zwraca null
	if (dostepnePrzedmioty.length === 0) {
		return null;
	}

	// Wybór dostępnego przedmiotu z ograniczeniem liczby wystąpień
	let wybranyPrzedmiot = wybierzDostepnyPrzedmiot(dostepnePrzedmioty, kolumna);

	if (!wybranyPrzedmiot) {
		wybranyPrzedmiot = wybierzDostepnyPrzedmiot(przedmioty, kolumna);
	}

	if (!wybranyPrzedmiot) {
		return null;
	}

	// Zmniejszenie liczby godzin wybranego przedmiotu i aktualizacja tablicy
	wybranyPrzedmiot.ilosc--;
	przedmioty = przedmioty.filter((przedmiot) => przedmiot.ilosc > 0);

	return wybranyPrzedmiot.nazwa;
};

// funkcja wybierająca przedmiot, który może być dodany do tabeli z uwzględnieniem ograniczeń
const wybierzDostepnyPrzedmiot = (przedmioty, kolumna) => {
	const wybranePrzedmioty = przedmioty.filter((przedmiot) => {
		const nazwa = przedmiot.nazwa;
		const wystapienia = Array.from(document.querySelectorAll(`#${getIdKolumny(kolumna)}`)).filter(
			(komorka) => komorka.textContent === nazwa,
		).length;

		return wystapienia < 4; // ograniczenie do 4 wystąpień przedmiotu w jednym dniu
	});

	if (wybranePrzedmioty.length === 0) {
		return null;
	}

	// losowy wybór przedmiotu spośród dostępnych
	return wybranePrzedmioty[Math.floor(Math.random() * wybranePrzedmioty.length)];
};

// funkcja zwracająca ID kolumny na podstawie indeksu kolumny
const getIdKolumny = (kolumna) => {
	const ids = ['p', 'wt', 'śr', 'cz', 'pt'];
	return ids[kolumna - 1] || '';
};

const getCheckbox = (id) => document.getElementById(id);

// funkcja wypełniająca tabelę przedmiotami
const wpiszPrzedmioty = () => {
	const wiersze = tabela.getElementsByTagName('tr');

	for (let i = 1; i < wiersze.length; i++) {
		const komorki = wiersze[i].getElementsByTagName('td');

		for (let j = 1; j < komorki.length; j++) {
			if (komorki[j].textContent.trim() !== '') {
				continue;
			}

			let nazwaPrzedmiotu = null;

			// sprawdzanie, czy checkbox dla danego dnia jest zaznaczony
			if (!getCheckbox(dniTygodnia[j - 1]).checked) {
				nazwaPrzedmiotu = znajdzPrzedmiot(j);
			}

			// wypełnianie komórki tabeli nazwą przedmiotu
			if (nazwaPrzedmiotu !== null) {
				komorki[j].textContent = nazwaPrzedmiotu;
			}
		}
	}

	// zapisanie aktualnego planu do localStorage
	zapiszPlanDoLocalStorage();
};

// funkcja zwracająca nazwę dnia na podstawie indeksu
const getNazwaDnia = (dzien) => {
	const dni = ['brak preferencji', ...dniTygodnia];
	return dni[dzien] || '';
};

// funkcja zapisująca aktualny plan zajęć do lokalnej pamięci przeglądarki
const zapiszPlanDoLocalStorage = () => {
	const wiersze = tabela.getElementsByTagName('tr');
	let plan = [];

	for (let i = 1; i < wiersze.length; i++) {
		const komorki = wiersze[i].getElementsByTagName('td');
		let wiersz = [];

		for (let j = 1; j < komorki.length; j++) {
			wiersz.push(komorki[j].textContent);
		}

		plan.push(wiersz);
	}

	localStorage.setItem('plan', JSON.stringify(plan));
};

// funkcja wczytująca plan zajęć z lokalnej pamięci
const wczytajPlanZLocalStorage = () => {
	const przechowywanyPlan = localStorage.getItem('plan');
	if (przechowywanyPlan) {
		const plan = JSON.parse(przechowywanyPlan);
		const wiersze = tabela.getElementsByTagName('tr');

		for (let i = 1; i < wiersze.length; i++) {
			const komorki = wiersze[i].getElementsByTagName('td');

			for (let j = 1; j < komorki.length; j++) {
				komorki[j].textContent = plan[i - 1][j - 1];
			}
		}
	}
};

// funkcja usuwająca zapisany plan z lokalnej pamięci i odświeżająca stronę
const resetujPlan = () => {
	localStorage.removeItem('plan');
	location.reload();
};

document.getElementById('dodajPrzedmiot').addEventListener('click', dodajPrzedmiot);
document.getElementById('wpiszPrzedmioty').addEventListener('click', wpiszPrzedmioty);
document.getElementById('resetujPlan').addEventListener('click', resetujPlan);
window.addEventListener('load', () => {
	wczytajPlanZLocalStorage();
});
