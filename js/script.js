function getParameterByName(name) {
  var match = RegExp('[?&]' + name + '=([^&]*)').exec(window.location.search);
  return match && decodeURIComponent(match[1].replace(/\+/g, ' '));
}

function setPagination() {
  var totalPages = 20;
  var currentPage = parseInt(getParameterByName('p')) || 1;
  var maxVisiblePages = 3; // max page links
  var paginationTop = document.querySelectorAll('.pagination')[0];
  var paginationBottom = document.querySelectorAll('.pagination')[1];
  var prevLink = document.createElement('a');
  prevLink.href = '?p=' + (currentPage - 1);
  prevLink.textContent = '« Prev';
  if (currentPage === 1) {
    prevLink.classList.add('disabled');
    prevLink.removeAttribute('href');
  }
  paginationTop.appendChild(prevLink);
  paginationBottom.appendChild(prevLink.cloneNode(true));
  
  var startPage = Math.max(currentPage - Math.floor(maxVisiblePages / 2), 1);
  var endPage = Math.min(startPage + maxVisiblePages - 1, totalPages);
  
  for (var i = startPage; i <= endPage; i++) {
    var link = document.createElement('a');
    link.href = '?p=' + i;
    link.textContent = i;
    if (i === currentPage) {
      link.classList.add('active');
    }
    paginationTop.appendChild(link.cloneNode(true));
    paginationBottom.appendChild(link);
  }
  
  var nextLink = document.createElement('a');
  nextLink.href = '?p=' + (currentPage + 1);
  nextLink.textContent = 'Next »';
  if (currentPage === totalPages) {
    nextLink.classList.add('disabled');
    nextLink.removeAttribute('href');
  }
  paginationTop.appendChild(nextLink);
  paginationBottom.appendChild(nextLink.cloneNode(true));
};


function createImage(src) {
  var div = document.createElement('div');
  div.classList.add('image');
  div.style.backgroundImage = 'url(' + src + ')';
  return div;
}

function lazyLoadImages() {
  var images = document.querySelectorAll('.image');
  var windowHeight = window.innerHeight;

  for (var i = 0; i < images.length; i++) {
    var rect = images[i].getBoundingClientRect();

    if (rect.bottom >= 0 && rect.top < windowHeight) {
      var src = images[i].getAttribute('data-src');
      images[i].style.backgroundImage = 'url(' + src + ')';
    }
  }
}

function initGallery() {
  var numImages = 100;
  var maxImages = 1959;
  var pageNum = parseInt(getParameterByName('p')) || 1;
  var startImage = 1;
 
  if (pageNum > 1) {
    startImage = (pageNum - 1) * numImages + 1;
  }

  var stopImage = pageNum * numImages;

  if (startImage < maxImages && stopImage > maxImages) {
    stopImage = maxImages;
  }

  if (startImage > maxImages || stopImage > maxImages) {
    startImage = 1;
    stopImage = numImages;
  }

  // console.log('pageNum:', pageNum);
  // console.log('startImage:', startImage);
  // console.log('stopImage:', stopImage);
  
  var results = document.getElementById('results');
  var gallery = document.getElementById('gallery');
  var imgPrefix = `imgthumb/${pageNum}/`;
  var imgExtension = '.jpg';
  for (var i = startImage; i <= stopImage; i++) {
    var imgNumber = ('0000' + i).slice(-4);
    var imgPath = imgPrefix + imgNumber + imgExtension;
    var img = createImage('');
    img.setAttribute('data-src', imgPath);
    img.addEventListener('click', function() {
      openModal(this.getAttribute('data-src'));
    });
    gallery.appendChild(img);
  }
  lazyLoadImages();
  results.innerHTML = `Displaying ${startImage} to ${stopImage}`;
}

function openModal(src) {
  var modal = document.getElementById('modal');
  var modalImage = document.getElementById('modal-image');
  var imagePath = src.replace('imgthumb/', 'imgfull/');
  modalImage.setAttribute('src', imagePath);
  modal.style.display = 'block';

  var close = document.getElementsByClassName('close')[0];
  close.addEventListener('click', function() {
    closeModal();
  });

  window.addEventListener('click', function(event) {
    if (event.target == modal) {
      closeModal();
    }
  });

  window.addEventListener('keydown', function(event) {
    if (event.keyCode === 27) {
      closeModal();
    }
  });
}

function closeModal() {
  var modal = document.getElementById('modal');
  modal.style.display = 'none';
}

window.addEventListener('scroll', lazyLoadImages);
window.addEventListener('resize', lazyLoadImages);
window.addEventListener('orientationchange', lazyLoadImages);

initGallery();
setPagination();

