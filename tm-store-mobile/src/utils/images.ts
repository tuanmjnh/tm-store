import delay from 'delay';

// const imageUrls = [
//   'https://images.unsplash.com/photo-1543610892-0b1f7e6d8ac1?q=80&w=1856&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
//   'https://images.unsplash.com/photo-1516914943479-89db7d9ae7f2?q=80&w=2732&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
//   'https://images.unsplash.com/photo-1531384698654-7f6e477ca221?q=80&w=2800&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
//   'https://images.unsplash.com/photo-1531901599143-df5010ab9438?q=80&w=2787&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
//   'https://images.unsplash.com/photo-1524255684952-d7185b509571?q=80&w=2787&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
//   'https://images.unsplash.com/photo-1588175996685-a40693ee1087?q=80&w=2864&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
//   'https://images.unsplash.com/photo-1624561172888-ac93c696e10c?q=80&w=2592&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
//   'https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?q=80&w=2787&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
// ];

const createImageElement = (url, index) => {
  const div = document.createElement('div');
  div.className = 'relative overflow-hidden aspect-w-16 aspect-h-9';
  const img = document.createElement('img');
  img.className = 'lazy-image w-full h-auto object-cover transition-opacity duration-300 opacity-0 rounded-lg';
  img.dataset.src = url;
  img.alt = `Image ${index + 1}`;
  const placeholder = document.createElement('div');
  placeholder.className = 'absolute inset-0 bg-neutral-200 animate-pulse w-full h-full';
  div.appendChild(placeholder);
  div.appendChild(img);
  return div;
}

export const lazyLoad = async (files, srcKey = 'src', isAppend = false) => {
  await delay(300)
  // Create and append image elements
  const gallery = document.getElementById('drive-gallery')
  if (gallery) {
    if (!isAppend) gallery.innerHTML = null
    files.forEach((file, index) => {
      const imageElement = createImageElement(file[srcKey], index)
      imageElement.addEventListener('click', e => {
        console.log(file)
      })
      gallery.appendChild(imageElement)
    });

    const images = document.querySelectorAll('img.lazy-image')
    const options = {
      root: null,
      rootMargin: '0px',
      threshold: 0.1,
    }
    const imageObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(async (entry) => {
        if (entry.isIntersecting) {
          await delay(200)
          const img = entry.target as any
          img.src = img.dataset.src
          img.onload = () => {
            img.classList.remove('opacity-0')
            if (img && img.previousElementSibling) img.previousElementSibling.remove() // Remove placeholder
          }
          observer.unobserve(img)
        }
      })
    }, options)
    images.forEach((img) => imageObserver.observe(img))
  }
}

export const lazyLoadImage = async (galleryClass = 'drive-gallery', imageClass = 'img.lazy-image') => {
  await delay(300)
  // Create and append image elements
  const gallery = document.getElementById(galleryClass)
  if (gallery) {
    // if (!isAppend) gallery.innerHTML = null
    // files.forEach((file, index) => {
    //   const imageElement = createImageElement(file[srcKey], index)
    //   imageElement.addEventListener('click', e => {
    //     console.log(file)
    //   })
    //   gallery.appendChild(imageElement)
    // });

    const images = document.querySelectorAll(imageClass)
    const options = {
      root: null,
      rootMargin: '0px',
      threshold: 1,
    }
    const imageObserver = new IntersectionObserver((entries, observer) => {
      // for(const e of entries)
      entries.forEach(async (entry) => {
        if (entry.isIntersecting) {
          await delay(300)
          const img = entry.target as any
          img.src = img.dataset.src
          img.onload = () => {
            img.classList.remove('opacity-0')
            if (img && img.previousElementSibling) img.previousElementSibling.remove() // Remove placeholder
          }
          observer.unobserve(img)
        }
      })
    }, options)
    images.forEach((img) => imageObserver.observe(img))
  }
}