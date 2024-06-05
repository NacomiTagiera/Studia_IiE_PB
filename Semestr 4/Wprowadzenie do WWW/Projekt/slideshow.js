const icons = document.querySelectorAll('.slideshow-icons i');
let i = 1;

setInterval(() => {
	i++;
	const icon = document.querySelector('.slideshow-icons .change');
	icon.classList.remove('change');

	if (i > icons.length) {
		icons[0].classList.add('change');
		i = 1;
	} else {
		icon.nextElementSibling.classList.add('change');
	}
}, 3500);
