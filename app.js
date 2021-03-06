const imagesArea = document.querySelector('.images');
const gallery = document.querySelector('.gallery');
const galleryHeader = document.querySelector('.gallery-header');
const searchBtn = document.getElementById('search-btn');
const sliderBtn = document.getElementById('create-slider');
const sliderContainer = document.getElementById('sliders');
const durationInput = document.getElementById('duration');
// selected image 
let sliders = [];


// If this key doesn't work
// Find the name in the url and go to their website
// to create your own api key
const KEY = '20265487-f5777c8b32d185e30ff9e49de&q';

// show images 
const showImages = (images) => {

  imagesArea.style.display = 'block';
  gallery.innerHTML = '';

  if(images.length < 1) {
    gallery.innerHTML = 'Sorry could not find any image. Try another keyword for search.';
    gallery.style.color = 'red';
    return;
  }


  // show gallery title
  galleryHeader.style.display = 'flex';
  images.forEach(image => {
    let div = document.createElement('div');
    div.className = 'col-lg-3 col-md-4 col-xs-6 img-item mb-2';
    div.innerHTML = ` <img class="img-fluid img-thumbnail" onclick=selectItem(event,"${image.webformatURL}") src="${image.webformatURL}" alt="${image.tags}">`;
    gallery.appendChild(div)
  })

}

const getImages = (query) => {
  document.getElementById('spinner').classList.remove('d-none')
  document.getElementById('spinner').classList.add('d-flex')
  
  fetch(`https://pixabay.com/api/?key=${KEY}=${query}&image_type=photo&pretty=true`)
    .then(response => response.json())
    .then(data => {
      
      showImages(data.hits)
      document.getElementById('spinner').classList.remove('d-flex');
      document.getElementById('spinner').classList.add('d-none');
    })
    .catch(err => {
      console.log('ERROR:' + err);
      document.getElementById('spinner').classList.remove('d-flex');
      document.getElementById('spinner').classList.add('d-none');
      gallery.innerHTML = err + '. May be your server is down or your api key is not working.';
      gallery.style.color = 'red';
    })
}

  

let slideIndex = 0;
const selectItem = (event, img) => {
  let element = event.target;
  
  let item = sliders.indexOf(img);
  if (item === -1) {
    element.classList.add('added');
    sliders.push(img);
  } else {
    element.classList.remove('added');
    sliders = sliders.filter(el => el != img)
  }
}

var timer;
let duration;

  if(durationInput.value > 0) {
    duration = durationInput.value;
  } else {
    duration = 1000;
  }

durationInput.addEventListener('change', (e)=> {
  if(e.target.value < 0){
    alert('Give positive integer number.')
    e.target.value = 0;
    return;
  }
})

const createSlider = () => {
  // check slider image length
  if (sliders.length < 2) {
    alert('Select at least 2 image.')
    return;
  }
  // crate slider previous next area
  sliderContainer.innerHTML = '';
  const prevNext = document.createElement('div');
  prevNext.className = "prev-next d-flex w-100 justify-content-between align-items-center";
  prevNext.innerHTML = ` 
  <span class="prev" onclick="changeItem(-1)"><i class="fas fa-chevron-left"></i></span>
  <span class="next" onclick="changeItem(1)"><i class="fas fa-chevron-right"></i></span>
  `;

  sliderContainer.appendChild(prevNext)
  document.querySelector('.main').style.display = 'block';
  // hide image aria
  imagesArea.style.display = 'none';

  
  
  sliders.forEach(slide => {
    let item = document.createElement('div')
    item.className = "slider-item";
    item.innerHTML = `<img class="w-100"
    src="${slide}"
    alt="">`;
    sliderContainer.appendChild(item)
  })
  changeSlide(0)
  timer = setInterval(function () {
    slideIndex++;
    changeSlide(slideIndex);
  }, duration);
}

//mouse hover pause slider
sliderContainer.addEventListener('mouseenter', e => {
  clearInterval(timer);
})
sliderContainer.addEventListener('mouseleave', e => {
  timer = setInterval(function () {
    slideIndex++;
    changeSlide(slideIndex);
  }, duration);
})

// change slider index 
const changeItem = index => {
  changeSlide(slideIndex += index);
}

// change slide item
const changeSlide = (index) => {

  const items = document.querySelectorAll('.slider-item');
  if (index < 0) {
    slideIndex = items.length - 1
    index = slideIndex;
  };

  if (index >= items.length) {
    index = 0;
    slideIndex = 0;
  }

  items.forEach(item => {
    item.style.display = "none"
  })

  items[index].style.display = "block"
}

document.getElementById('image-search').addEventListener('submit', function (e) {
  e.preventDefault()
  document.querySelector('.main').style.display = 'none';
  clearInterval(timer);
  const search = document.getElementById('search');
  getImages(search.value);
  document.getElementById('search').value = '';
  sliders.length = 0;
})

sliderBtn.addEventListener('click', function () {
  createSlider()
})

window.addEventListener('keyup', e => {
  if(e.key === '/') {
    document.getElementById('search').focus();
  }
})
