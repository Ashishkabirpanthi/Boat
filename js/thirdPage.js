// images setup
const images = [
    "./images/1.jpeg",
    "./images/2.jpeg",
    "./images/3.jpeg",
    "./images/4.jpeg",
  ];
  
  // content setup
  const texts = [
    ["NIRVANA", "Sound such that you fall in love"],
    ["Boat M6", "Hear the sound you want"],
    ["Bass", "Bass boosted headphone that you like"],
    ["Glowing ", "Glow your future like this"],
  ];
  
  // init plugin
  rgbKineticSlider = new rgbKineticSlider({
    // images and content sources
    slideImages: images, // array of images >demo size : 1920 x 1080
    itemsTitles: texts, // array of titles / subtitles
  
    // displacement images sources
    backgroundDisplacementSprite: "https://i.ibb.co/N246LxD/map-9.jpg", // slide displacement image
    cursorDisplacementSprite: "https://i.ibb.co/KrVr51f/displace-circle.png", // cursor displacement image
  
    // cursor displacement effect
    cursorImgEffect: true, // enable cursor effect
    cursorTextEffect: false, // enable cursor text effect
    cursorScaleIntensity: 0.65, // cursor effect intensity
    cursorMomentum: 0.14, // lower is slower
  
    // swipe
    swipe: true, // enable swipe
    swipeDistance: window.innerWidth * 0.4, // swipe distance - ex : 580
    swipeScaleIntensity: 2, // scale intensity during swipping
  
    // slide transition
    slideTransitionDuration: 1, // transition duration
    transitionScaleIntensity: 30, // scale intensity during transition
    transitionScaleAmplitude: 160, // scale amplitude during transition
  
    // regular navigation
    nav: true, // enable navigation
    navElement: ".main-nav", // set nav class
  
    // image rgb effect
    imagesRgbEffect: true, // enable images rgb effect
    imagesRgbIntensity: 1, // set images rgb intensity
    navImagesRgbIntensity: 50, // set images rgb intensity for regular nav
  
    // texts settings
    textsDisplay: true, // show title
    textsSubTitleDisplay: true, // show subtitles
    textsTiltEffect: true, // enable text tilt
    googleFonts: ["Josefin Sans:700", "Poppins:400"], // select google font to use
    buttonMode: false, // enable button mode for title
    textsRgbEffect: true, // enable text rgb effect
    textsRgbIntensity: 0.03, // set text rgb intensity
    navTextsRgbIntensity: 15, // set text rgb intensity for regular nav
  
    textTitleColor: "#fff", // title color
    textTitleSize: 125, // title size
    mobileTextTitleSize: 125, // title size
    textTitleLetterspacing: 1, // title letterspacing
  
    textSubTitleColor: "white", // subtitle color ex : 0x000000
    textSubTitleSize: 21, // subtitle size
    mobileTextSubTitleSize: 21, // mobile subtitle size
    textSubTitleLetterspacing: 2, // subtitle letter spacing
    textSubTitleOffsetTop: 90, // subtitle offset top
    mobileTextSubTitleOffsetTop: 90, // mobile subtitle offset top
  });
  