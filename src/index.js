import './css/styles.css';
import debounce from 'lodash.debounce';
import { fetchCountries } from './fetchCountries';
import { Notify } from 'notiflix/build/notiflix-notify-aio';

const DEBOUNCE_DELAY = 300;
const searchBox = document.querySelector('#search-box');
const countryList = document.querySelector('.country-list');
const countryInfo = document.querySelector('.country-info');

searchBox.addEventListener('input', debounce(onSearch, DEBOUNCE_DELAY));

function onSearch (e){
let searchCountry = searchBox.value;
// console.log('searchCountry: ',searchCountry)
if(searchCountry.trim() === "") {
    countryList.innerHTML = "";
    countryInfo.innerHTML = "";
    return;
}
fetchCountries(searchCountry.trim())
.then(countries => {
    // console.log(countries)
    if(countries.length > 10) {
        Notify.info('Too many matches found. Please enter a more specific name.');
        countryList.innerHTML = "";
        countryInfo.innerHTML = "";
        return;
    }

    if(countries.length >= 2  && countries.length <= 10) {
    const listMarkup = countries.map(country => showCountryList(country))
    countryList.innerHTML = listMarkup.join('');
    countryInfo.innerHTML = "";
    }

    if(countries.length === 1){
        const countryCardMarcup = countries.map(country => showCountryCard(country));
        countryList.innerHTML = "";
        countryInfo.innerHTML = countryCardMarcup.join('');
    }
})
.catch(error => {
    Notify.failure('Oops, there is no country with that name');
    countryList.innerHTML = "";
    countryInfo.innerHTML = "";
    return error;
})
}

 function showCountryList ({ flags, name }){
    return `
    <li class = country-item>
    <img class = 'country-list__flags' src="${flags.svg}" alt="${name.official}" width=50/>
    <h2 class = country-list__name>${name.official}</h2>
    </li>
    `
}
 function showCountryCard ({ flags, name, capital, population, languages}){
    return `
    <div class='wrapper'>
        <img class='country-flag' src='${flags.svg}' alt='${name.official}' width=100 />
        <h2 class='country-title'>${name.official}</h2>
     </div>
    <div class='wrapper'>
        <p class='country-text'>Capital:</p> <span class='country-subtext'>${capital}</span>
    </div>
    <div class='wrapper'>
        <p class='country-text'>Population:</p>
        <span class='country-subtext'>${population}</span>
    </div>
    <div class='wrapper'>
        <p class='country-text'>Languages:</p>
        <span class='country-subtext'>${Object.values(languages)}</span>
    </div>
    `

}