export const canvas = document.querySelector('canvas');
// could also do this in css, but it'll load at a different time
// 16 x 9 ratio, default pixels
canvas.width = 1024;
canvas.height = 576;

// the canvas API and all methods/properties
export const c = canvas.getContext('2d');
