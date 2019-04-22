(function() {
  'use strict';

  const PUBLIC_KEY = '671908b4f1d7b04393bf4efe6fbdf299';
  const HASH = '9c225c095c1551b84e8c5292c3c0553b';
  const TS = 1;
  let OFFSET = 0;
  let LIMIT = 10;
  let pageIndex = 0;
  let controlIndex = 4;
  const URL = `http://gateway.marvel.com/v1/public/characters?limit=${LIMIT}&offset=${OFFSET}&ts=${TS}&apikey=${PUBLIC_KEY}&hash=${HASH}`;

  const boxCharacters = document.querySelector('.section-characters');
  const input = document.querySelector('.input');

  const modal = document.getElementById('modal');
  const modalContent = document.querySelector('.modal-content');

  let allLIs = document.querySelectorAll('.pagination ul li');
  const Ul = document.querySelector('.pagination ul');

  const previousPage = document.querySelector('.previous-page');
  const nextPage = document.querySelector('.next-page');

  nextPage.addEventListener('click', goToNextPage);
  previousPage.addEventListener('click', function() {
    if (pageIndex) {
      goToPreviousPage();
    }
  });

  window.addEventListener('load', () => {
    allLIs[0].classList.add('active');
    addOrRemoveDisableArrow();
  });

  allLIs.forEach((item, index) => {
    item.classList.remove('active');
    item.addEventListener('click', () => paginationControls(index));
  });

  function paginationControls(index) {
    controlIndex = index;
    removeLiClass(index);
    allLIs[index].classList.add('active');
    const liValue = allLIs[index].textContent;
    if (liValue === '1') {
      OFFSET = 0;
    } else if (liValue === '2') {
      OFFSET = 10;
    } else {
      OFFSET = 10 * liValue - 10;
    }
    pageIndex = parseInt(liValue - 1);
    addOrRemoveDisableArrow();
    getCharacters();
  }

  function addOrRemoveDisableArrow() {
    if (OFFSET) {
      previousPage.classList.remove('arrow-disabled');
    } else {
      previousPage.classList.add('arrow-disabled');
    }
  }

  function removeLiClass(index) {
    allLIs = document.querySelectorAll('.pagination ul li');
    allLIs.forEach(item => {
      item.classList.remove('active');
    });
    allLIs[index].classList.add('active');
  }

  function goToNextPage() {
    if (!OFFSET) {
      OFFSET = 10;
    } else {
      OFFSET += 10;
    }
    pageIndex += 1;
    if (pageIndex < controlIndex) {
      controlIndex = 0;
    }
    addOrRemoveDisableArrow();
    isLastPage();
    controlIndex++;
    if (controlIndex == 6) {
      controlIndex = 5;
    }

    removeLiClass(controlIndex);
    getCharacters();
  }

  function goToPreviousPage() {
    if (!OFFSET) {
      OFFSET = 10;
    } else {
      OFFSET -= 10;
    }
    pageIndex -= 1;
    addOrRemoveDisableArrow();
    controlIndex--;
    if (controlIndex <= 0) {
      controlIndex = 0;
    }
    removeLiClass(controlIndex);
    if (pageIndex >= 1) {
      isFirstPage();
    }
    getCharacters();
  }

  function isFirstPage() {
    if (pageIndex == 0) {
      const arrayLI = Array.prototype.map.call(
        allLIs,
        item => `<li>${item.textContent}</li>`
      );
      arrayLI.unshift(`<li class="active">${pageIndex}</li>`);
      arrayLI.pop();
      pageIndex - 1;
      Ul.innerHTML = arrayLI.join('');
    }
    allLIs = document.querySelectorAll('.pagination ul li');
    allLIs.forEach((item, index) => {
      item.classList.remove('active');
      item.addEventListener('click', () => paginationControls(index));
    });
  }

  function isLastPage() {
    allLIs = document.querySelectorAll('.pagination ul li');
    if (pageIndex == allLIs[allLIs.length - 1].textContent) {
      const arrayLI = Array.prototype.map.call(
        allLIs,
        item => `<li>${item.textContent}</li>`
      );
      arrayLI.push(`<li class="active">${pageIndex + 1}</li>`);
      arrayLI.shift();
      Ul.innerHTML = arrayLI.join('');
      pageIndex + 1;
    }
    allLIs = document.querySelectorAll('.pagination ul li');
    allLIs.forEach((item, index) => {
      item.classList.remove('active');
      item.addEventListener('click', () => paginationControls(index));
    });
  }

  input.addEventListener('input', searchFilter);

  getCharacters();

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
    const response = await fetch(
      `http://gateway.marvel.com/v1/public/characters?limit=${LIMIT}&offset=${OFFSET}&ts=${TS}&apikey=${PUBLIC_KEY}&hash=${HASH}`
    );
    const data = await response.json();
    const results = data['data'].results;
    boxCharacters.innerHTML = '';
    return results.map(item => {
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
