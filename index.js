///making a object to hold similarites of auto complete
const autoCompleteConfig = {
	renderOption(movie) {
		//if there is no poster display empty string.
		const posterSrc = movie.Poster === 'N/A' ? '' : movie.Poster;

		//final form of option to be displayed in the dropdown menu.
		return `<img src= "${posterSrc}"/> 
                ${movie.Title}`;
	},

	inputValue(movie) {
		return movie.Title;
	},

	async fetchData(searchTerm) {
		const response = await axios.get('https://www.omdbapi.com/', {
			params: {
				apikey: 'aa9fc6b1',
				s: searchTerm
			}
		});

		if (response.data.Error) {
			return [];
		}

		return response.data.Search;
	}
};
//cerating 2 auto complete instances
createAutoComplete({
	//unpacking the simularities
	...autoCompleteConfig,
	root: document.querySelector('#left-autocomplete'),

	onOptionSelect(movie) {
		document.querySelector('.tutorial').classList.add('is-hidden');
		onMovieSelect(movie, document.querySelector('#left-summary'), 'left');
	}
});

createAutoComplete({
	...autoCompleteConfig,

	root: document.querySelector('#right-autocomplete'),

	onOptionSelect(movie) {
		document.querySelector('.tutorial').classList.add('is-hidden');
		onMovieSelect(movie, document.querySelector('#right-summary'), 'right');
	}
});

//// what to do after selecting a movie from the drop down menu ////

//defining vars for comparizons.
let leftMovie;
let rightMovie;

// 1.sending a search by selected movie id
const onMovieSelect = async (movie, summaryRenderLocation, side) => {
	const followUpResponse = await axios.get('https://www.omdbapi.com/', {
		params: {
			apikey: 'aa9fc6b1',
			i: movie.imdbID
		}
	});

	//calling the template in order to render the movie data in style.
	summaryRenderLocation.innerHTML = movieTemplate(followUpResponse.data);

	//beging the comparizon
	if (side === 'left') {
		leftMovie = followUpResponse.data;
	} else {
		rightMovie = followUpResponse.data;
	}

	if (leftMovie && rightMovie) {
		runComparison();
	}
};

// comoparison function
const runComparison = () => {
	const leftSideStats = document.querySelectorAll('#left-summary .notification');
	const rightSideStats = document.querySelectorAll('#right-summary .notification');

	leftSideStats.forEach((leftStat, index) => {
		const rightStat = rightSideStats[index];

		const leftValue = leftStat.dataset.value;
		const rightValue = rightStat.dataset.value;

		if (leftValue > rightValue) {
			rightStat.classList.remove('is-primary');
			rightStat.classList.add('is-warning');
		} else {
			leftStat.classList.remove('is-primary');
			leftStat.classList.add('is-warning');
		}
	});
};

//2.rendring full movie data
const movieTemplate = (movieDetail) => {
	//extract numbers for comparizons////////
	const metaScore = parseInt(movieDetail.Metascore);
	const imdbRating = parseFloat(movieDetail.imdbRating);
	const imdbVotes = parseInt(movieDetail.imdbVotes.replace(/,/g, ''));
	const runTime = parseInt(movieDetail.Runtime);

	//to extract the numbers out of the awards string and add them together.
	const awards = movieDetail.Awards.split(' ').reduce((prev, word) => {
		const value = parseInt(word);

		if (isNaN(value)) {
			return prev;
		} else {
			return prev + value;
		}
	}, 0);

	return `
        <article class="media">
            <figure class="media-left">
                <p class="image">
                    <img src="${movieDetail.Poster}"/>
                </p>
            </figure>

            <div class="media-content">
                <div class="content">
                    <h1>${movieDetail.Title}</h1>
                    <h4>${movieDetail.Genre}</h4>
                    <p>${movieDetail.Plot}</p>
                </div>
            </div>

        </article>

        <article data-value=${awards} class="notification is-primary">
            <p class="title">${movieDetail.Awards}</p>
            <p class="subtitle">Awards</p>
        </article>

        <article data-value=${runTime} class="notification is-primary">
        <p class="title">${movieDetail.Runtime}</p>
        <p class="subtitle">Run Time</p>
        </article>

        <article data-value=${metaScore} class="notification is-primary">
        <p class="title">${movieDetail.Metascore}</p>
        <p class="subtitle">Metascore</p>
        </article>

        <article data-value=${imdbRating} class="notification is-primary">
        <p class="title">${movieDetail.imdbRating}</p>
        <p class="subtitle">IMDB Rating</p>
        </article>

        <article data-value=${imdbVotes} class="notification is-primary">
        <p class="title">${movieDetail.imdbVotes}</p>
        <p class="subtitle">IMDB Votes</p>
        </article>
    
    `;
};
