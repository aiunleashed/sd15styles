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
  prevLink.textContent = '«';
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
  nextLink.textContent = '»';
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

  // Add check to set currentImage to initial value
  var currentImage = imagePath;

  var currentImageIndex;

  var close = document.getElementsByClassName('close')[0];
  close.addEventListener('click', function() {
    closeModal();
  });

  var prev = document.getElementsByClassName('modal-prev')[0];
  prev.addEventListener('click', function() {
    navigate(-1);
  });

  var next = document.getElementsByClassName('modal-next')[0];
  next.addEventListener('click', function() {
    navigate(1);
  });

  var images = [];
  var gallery = document.getElementById('gallery');
  var galleryImages = gallery.querySelectorAll('.image');
  for (var i = 0; i < galleryImages.length; i++) {
    var imageSrc = galleryImages[i].getAttribute('data-src');
    if (imageSrc) {
      var image = imageSrc.replace('imgthumb/', 'imgfull/');
      images.push(image);
      if (image === imagePath) {
        currentImageIndex = images.length - 1;
      }
    }
  }  

  var touchStartX = null;

  function handleTouchStart(event) {
    touchStartX = event.touches[0].clientX;
  }

  function handleTouchEnd(event) {
    var touchEndX = event.changedTouches[0].clientX;
    var swipeDistance = touchEndX - touchStartX;

    if (swipeDistance < 0) {
      navigate(1); // swipe left
    } else if (swipeDistance > 0) {
      navigate(-1); // swipe right
    }
  }

  modalImage.addEventListener('touchstart', handleTouchStart);
  modalImage.addEventListener('touchend', handleTouchEnd);

  function navigate(direction) {
    // Use currentImageIndex variable to set initial currentIndex
    var currentIndex = currentImageIndex;
    var nextIndex = currentIndex + direction;
  
    if (nextIndex < 0) {
      nextIndex = images.length - 1;
    } else if (nextIndex >= images.length) {
      nextIndex = 0;
    }
  
    var nextImage = images[nextIndex];
    var nextImagePath = nextImage.replace('imgthumb/', 'imgfull/');
  
    document.getElementById('modal-image').setAttribute('src', nextImagePath);
  
    // Update currentImage variable after navigation
    currentImage = nextImage;
    currentImageIndex = nextIndex;
  }  

  document.addEventListener('keydown', function(event) {
    if (event.key === 'ArrowLeft') {
      // Left arrow key pressed
      navigate(-1);
    } else if (event.key === 'ArrowRight') {
      // Right arrow key pressed
      navigate(1);
    }
  });
}



function closeModal() {
  var modal = document.getElementById('modal');
  modal.style.display = 'none';
  document.getElementById('modal-image').setAttribute('src', '');
}

window.addEventListener('scroll', lazyLoadImages);
window.addEventListener('resize', lazyLoadImages);
window.addEventListener('orientationchange', lazyLoadImages);

initGallery();
setPagination();
