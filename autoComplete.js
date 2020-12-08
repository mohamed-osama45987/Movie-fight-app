const createAutoComplete = ({root, renderOption, onOptionSelect, inputValue, fetchData}) => {
    //making the event listner function for the input event.
const onInput = async (event) => {
	const items = await fetchData(event.target.value);

	// if there is no data returned from api close the dropdown menu.
	if (!items.length) {
		dropdown.classList.remove('is-active');
		return;
	}

	//to clear existing items in the input to performe a clean search
	resultsWrapper.innerHTML = '';

	//to make dropdwon appear in the Dom.
	dropdown.classList.add('is-active');

	//appending the results to the Dom.
	for (let item of items) {
		const option = document.createElement('a');
		option.classList.add('dropdown-item');

        //check index.js for this function.
		option.innerHTML=renderOption(item);

		//appending option to resultWapper
		resultsWrapper.appendChild(option);

		//adding click event to the option  in the dropdown menu
		option.addEventListener('click', () => {
			//1.closing the drop down menu
			dropdown.classList.remove('is-active');

			//2.updating the text inside the input.
			inputElement.value = inputValue(item);

            //3.react to option select from the dropdown menu.
			onOptionSelect(item);
		});
	}
};

//creating the needed html structure for autocomplete to work
root.innerHTML = `
    <label><b>Search</b></label>
    <input class="input"/>
    <div class="dropdown">  
        <div class="dropdown-menu">
          <div class="dropdown-content results"></div>
        </div>
    </div>
 `;

//selecting the dropdown menue and the results in order to tweak them
const dropdown = root.querySelector('.dropdown');
const resultsWrapper = root.querySelector('.results');

// selecting and eventliestning on the input.
const inputElement = root.querySelector('input');
// and debouncing the onInput
inputElement.addEventListener('input', debounce(onInput, 500));

//inorder to remove drop down menu on clicking any were else form the dropdown
document.addEventListener('click', (event) => {
	if (!root.contains(event.target)) {
		dropdown.classList.remove('is-active');
	}
});

};