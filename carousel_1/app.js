const slides = gsap.utils.toArray(".carousel-slide");
const prev = document.querySelector(".prev");
const next = document.querySelector(".next");
let currentIndex = 0;

// overwrite CSS to prevent native scrolling
gsap.set(".carousel", { "scroll-snap-type": "none" });

// display the prev / next buttons and progress text
gsap.set(".carousel-nav", { display: "block" });

// for each slide, change the styling so they all stack up in the center
// and set the child elements to 0 opacity, unless it's the first slide
slides.forEach((slide, i) => {
  slide.classList.add("carousel-slide-abs");
  gsap.set(slide.children, { opacity: (i === 0 ? 1 : 0) });
});

// prev / next button behavior
next.addEventListener("click", () => changeSlide( 1 ));
prev.addEventListener("click", () => changeSlide( -1 ));

function changeSlide( dir ) {  
  // store a reference to the outgoing slide layers
  const oldLayers = slides[currentIndex].children;
  
  // "dir" will either increment or decrement the currentIndex
  // if the value is below or above the range, wrap() will return a number within the range, creating a loop
  currentIndex = gsap.utils.wrap(0, slides.length, (currentIndex += dir));
  
  // store a reference to the incoming slide layers
  const newLayers = slides[currentIndex].children;
  
  // kill any previous transition animation, to prevent conflicts when changing rapidly
  gsap.killTweensOf([oldLayers, newLayers]);
  
  // transition animation
  gsap.timeline({ defaults:{ ease: "expo" } })
    // update progress text
    .set(".carousel-nav div", { innerText: `${currentIndex + 1}/${slides.length}` })
  
    // old slide outro
    .to(oldLayers[0], {
      duration: 0.3,
      rotateY: (dir<0 ? -75 : 75),
      scale: 0.6,
      ease: "power2.in"
    }, 0)
    .to(oldLayers, {
      duration: 0.3,
      opacity: 0,
      ease: "power2.in"
    }, 0)
    
    // new slide intro
    .to(newLayers, {
      opacity: 1,
      ease: "power1.inOut",
      stagger: 0.2
    }, 0.2)
    .fromTo(newLayers[0], {
      rotateY: (dir<0 ? 90 : -90),
      scale: 0.6
    },{
      rotateY: 0,
      scale: 1
    }, 0.3)
    .fromTo([newLayers[1], newLayers[2]], {
      y: 35
    },{
      duration: 1,
      y: 0,
      stagger: 0.14
    }, 0.4);
}