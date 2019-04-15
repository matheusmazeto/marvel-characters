(function() {
  'use strict';

  const PUBLIC_KEY = '671908b4f1d7b04393bf4efe6fbdf299';
  const HASH = '9c225c095c1551b84e8c5292c3c0553b';
  const TS = 1;
  const URL = `http://gateway.marvel.com/v1/public/characters?limit=99&ts=${TS}&apikey=${PUBLIC_KEY}&hash=${HASH}`;
  const URL_EVENTS = `http://gateway.marvel.com/v1/public/characters/1011334/events?ts=${TS}&apikey=${PUBLIC_KEY}&hash=${HASH}`;

  const boxCharacters = document.querySelector('.section-characters');
  const input = document.querySelector('.input');
  let charactersData = [];
  let ID = [];

  let heroesPerPage = 10;
  let startOfList = 0;
  let endOfList = heroesPerPage;
  let paginationControls = document.querySelectorAll('.pagination ul li');

  const modal = document.getElementById('modal');
  const modalContent = document.querySelector('.modal-content');

  getCharacters();
  controls();
  paginationControls[0].classList.add('active');
  input.addEventListener('input', searchFilter);

  function controls() {
    paginationControls.forEach(function(item, index) {
      item.classList.remove('active');
      item.addEventListener('click', function() {
        controls();
        rangeUsersPerPage(index, item);
        getCharacters();
      });
    });
  }

  function rangeUsersPerPage(index, item) {
    if (!index) {
      startOfList = 0;
      endOfList = heroesPerPage;
      item.classList.add('active');
    } else {
      item.classList.add('active');
      startOfList = heroesPerPage * index;
      endOfList = startOfList + heroesPerPage;
    }
  }

  function searchFilter(e) {
    const inputValue = e.target.value;
    let regex = new RegExp(inputValue, 'gi');
    const arrayFiltered = charactersData.filter(hero => {
      return regex.test(hero.name);
    });
    const a = arrayFiltered.map(item => createHTML(item));
    const b = charactersData.map(item => createHTML(item));
    return inputValue !== ''
      ? (boxCharacters.innerHTML = a)
      : (boxCharacters.innerHTML = b);
  }

  async function getCharacters() {
    const response = await fetch(URL);
    const data = await response.json();
    const results = data['data'].results;
    charactersData = results;
    boxCharacters.innerHTML = '';
    results.map(item => ID.push(item.id));
    return results.slice(startOfList, endOfList).map(item => {
      boxCharacters.innerHTML += createHTML(item);
    });
  }

  async function getSeries(id) {
    const series = `http://gateway.marvel.com/v1/public/characters/${id}/series?ts=${TS}&apikey=${PUBLIC_KEY}&hash=${HASH}`;
    const response = await fetch(series);
    const data = await response.json();
    const results = data['data'].results;
    modalContent.innerHTML = '';
    return results.map(item => {
      modalContent.innerHTML += createModal(item);
    });
  }

  function createModal(param) {
    return `
    <h1>${param.title}</h1>
    <span onClick="closeModal()" class="close">&times;</span>
    <div class="year">
      <p>Ínicio: ${param.startYear}</p>
      <img
      src="${param.thumbnail.path}.${param.thumbnail.extension}"
      alt=""
    />
      <p>Fim: ${param.endYear}</p>
    </div>
    <div class="info">
      <p>Personagens: ${param.characters.available}</p>
      <p>Comics: ${param.comics.available}</p>
      <p>Criadores: ${param.creators.available}</p>
      <p>Histórias: ${param.stories.available}</p>
    </div>  `;
  }

  function createHTML(param) {
    return `<div onclick="openModal(${param.id})" class="container-characters">
    <section class="characters-name">
    <img
      src="${param.thumbnail.path}.${param.thumbnail.extension}"
      alt=""
    />
    <h1>${param.name}</h1>
  </section>
  <section class="characters-series">
  ${param.series.items
    .map((item, index) => (index < 3 ? `<p>${item.name}</p>` : null))
    .join('')}
  </section>
  <section class="characters-events">
  ${param.events.items
    .map((item, index) => (index < 3 ? `<p>${item.name}</p>` : null))
    .join('')}
  </section>
    </div>`;
  }

  window.openModal = id => {
    modal.style.display = 'block';
    getSeries(id);
  };

  window.closeModal = () => {
    modal.style.display = 'none';
  };

  window.addEventListener('click', function(e) {
    if (e.target == modal) {
      modal.style.display = 'none';
    }
  });
  window.addEventListener('keydown', function(e) {
    if (e.keyCode == 27 && modal.style.display == 'block') {
      modal.style.display = 'none';
    }
  });
})();
