(function() {
  'use strict';

  const PUBLIC_KEY = '671908b4f1d7b04393bf4efe6fbdf299';
  const HASH = '9c225c095c1551b84e8c5292c3c0553b';
  const TS = 1;
  const URL = `http://gateway.marvel.com/v1/public/characters?limit=100&ts=${TS}&apikey=${PUBLIC_KEY}&hash=${HASH}`;

  const boxCharacters = document.querySelector('.section-characters');
  const input = document.querySelector('.input');

  let heroesPerPage = 10;
  let startOfList = 0;
  let endOfList = heroesPerPage;

  let tabsLIs = document.querySelector('.pagination ul');

  const modal = document.getElementById('modal');
  const modalContent = document.querySelector('.modal-content');

  const tabs = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  let inicio = 0;
  let fim = 6;

  function cutLis() {
    tabsLIs.innerHTML = '';
    tabs.slice(inicio, fim).map(item => {
      return (tabsLIs.innerHTML += `<li onClick="clickLi()">${item}</li>`);
    });
  }

  cutLis();

  let paginationControls = document.querySelectorAll(
    'footer .pagination ul li'
  );

  const prevPage = document.querySelector('.previous-page');
  const nextPage = document.querySelector('.next-page');

  nextPage.addEventListener('click', goToNextPage);
  prevPage.addEventListener('click', goToPreviousPage);

  function goToNextPage() {
    if (startOfList === 50) {
      inicio = 1;
      fim = 7;
      cutLis();
    } else if (startOfList === 60) {
      inicio = 2;
      fim = 8;
      cutLis();
    } else if (startOfList === 70) {
      inicio = 3;
      fim = 9;
      cutLis();
    } else if (startOfList === 80) {
      inicio = 4;
      fim = 10;
      cutLis();
    } else if (startOfList >= 90) {
      console.log('ok');
      return;
    }
    startOfList += 10;
    endOfList += 10;
    getCharacters();
  }

  function goToPreviousPage() {
    if (startOfList === 50) {
      inicio = 0;
      fim = 6;
      cutLis();
    } else if (startOfList === 60) {
      inicio = 1;
      fim = 7;
      cutLis();
    } else if (startOfList === 70) {
      inicio = 2;
      fim = 8;
      cutLis();
    } else if (startOfList === 80) {
      inicio = 3;
      fim = 9;
      cutLis();
    } else if (startOfList <= 0) {
      console.log('ok');
      return;
    }
    startOfList -= 10;
    endOfList -= 10;
    getCharacters();
  }

  getCharacters();
  controls();
  paginationControls[0].classList.add('active');
  input.addEventListener('input', searchFilter);

  function controls() {
    paginationControls.forEach(function(item, index) {
      item.classList.remove('active');
      item.addEventListener('click', function() {
        controls();
        clickLi(index, item);
        getCharacters();
      });
    });
  }

  window.clickLi = (index, item) => {
    if (!index) {
      startOfList = 0;
      endOfList = heroesPerPage;
      paginationControls[0].classList.add('active');
    } else {
      item.classList.add('active');
      startOfList = heroesPerPage * index;
      endOfList = startOfList + heroesPerPage;
    }
  };

  async function searchFilter(e) {
    const inputValue = e.target.value;
    if (inputValue !== '') {
      const URL_SEARCH = `https://gateway.marvel.com/v1/public/characters?name=${inputValue}&ts=${TS}&apikey=${PUBLIC_KEY}&hash=${HASH}`;
      const response = await fetch(URL_SEARCH);
      const data = await response.json();
      const results = data['data'].results;
      const heroes = results.map(item => {
        return (boxCharacters.innerHTML = createHTML(item));
      });
      return heroes;
    }
    return getCharacters();
  }

  async function getCharacters() {
    const response = await fetch(URL);
    const data = await response.json();
    const results = data['data'].results;
    boxCharacters.innerHTML = '';
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
