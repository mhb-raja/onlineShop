function slickInit() {
  let gallery = document.querySelectorAll("#carousel-related-product");
  console.log('gallery');
  // gallery.slick({
  $("#carousel-related-product").slick({
    dots: true,
    infinite: false,
    speed: 300,
    slidesToShow: 4,
    slidesToScroll: 4,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 3,
          infinite: true,
          dots: true,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
      // You can unslick at a given breakpoint now by adding:
      // settings: "unslick"
      // instead of a settings object
    ],
  });
console.log('gallery done');
}

function slickInit2() {
  let gallery = document.querySelectorAll("#carousel-related-product2");
   console.log('custom.js slick init');
  // gallery.slick({
  $("#carousel-related-product2").slick({
    slidesToShow: 3,
  slidesToScroll: 1,
  autoplay: true,
  autoplaySpeed: 2000,
    // infinite: true,
    // slidesToShow: 3,
    // slidesToScroll: 1,
    // arrows: true,
    dots: true,
    // speed: 700,
    // autoplay:true,
    // autoplaySpeed: 2000,

  });
  console.log('gallery2 done');
}
//(
function multiItemCarousel(minPerSlide) {
  let carousel = document.querySelector("#galleryCarousel.carousel");
  let items = document.querySelectorAll(
    "#galleryCarousel.carousel .carousel-item"
  );

  // if (items.length <= minPerSlide)
  // {
  //   for (let index = 1; index < items.length; index++) {
  //     let next2=items[index].nextElementSibling;
  //     if(!next2){
  //       let cloneChild2 = next2.cloneNode(true);
  //       items[index].appendChild(cloneChild2.children[0]);
  //     }
  //   }
  // }
  // else
  loopCarousel(items, minPerSlide);
  //console.log("carousel items=", items.length, "minperslide=", minPerSlide);

  // items.forEach((el) => {
  //   //const minPerSlide = 4;
  //   let next = el.nextElementSibling;
  //   for (var i = 1; i < minPerSlide; i++) {
  //     if (!next && minPerSlide<items.length) {
  //       // wrap carousel by using first child

  //       next = items[0];
  //       //break;
  //     }
  //     if(next){
  //     let cloneChild = next.cloneNode(true);
  //     el.appendChild(cloneChild.children[0]);
  //     next = next.nextElementSibling;
  //   }
  //   }
  // });
}
//)();

function loopCarousel(items, visibleItemsInCarousel) {
  console.log('loop');
  items.forEach((el) => {
    let next = el.nextElementSibling;
    for (var i = 1; i < visibleItemsInCarousel; i++) {
      if (!next) {
        // wrap carousel by using first child
        next = items[0];
      }
      let cloneChild = next.cloneNode(true);
      el.appendChild(cloneChild.children[0]);
      next = next.nextElementSibling;
    }
  });
}
