var gulp = require('gulp');
var imageresize = require('gulp-image-resize');
var imagemin = require('gulp-imagemin');
var pngquant = require('imagemin-pngquant');
 
// set the folder name and the relative paths
// in the example the images are in ./assets/images
// and the public directory is ../public
var paths = {
    folder: 'images/',
    src: 'assets/', 
    dest: 'optim/'
}

// create an array of image groups (see comments above)
// specifying the folder name, the ouput dimensions and
// whether or not to crop the images
var images = [
    { folder: 'bg', width: 1200, crop: false },
    { folder: 'categories', width: 500, height: 330, crop: true },
    { folder: 'projects', width: 800, height: 500, crop: true },
   { folder: 'mici', width: 86,  crop: false }
];

// images gulp task
gulp.task('images', function () {
    let stream;
    // loop through image groups		
    images.forEach(function(type){
    	
    	// build the resize object
        var resize_settings = {
            width: type.width,
            crop: type.crop,
            // never increase image dimensions
            upscale : false
        }
        // only specify the height if it exists
        if (type.hasOwnProperty("height")) {
            resize_settings.height = type.height
        }
    	
        stream = gulp
        
        // grab all images from the folder
        .src(paths.src+paths.folder+type.folder+'/**/*')
    
        // resize them according to the width/height settings
        .pipe(imageresize(resize_settings))
        
        // optimize the images
        .pipe(imagemin({
            progressive: true,
            // set this if you are using svg images
            svgoPlugins: [{removeViewBox: false}],
            use: [pngquant()]
        }))
        
        // output each image to the dest path
        // maintaining the folder structure
        .pipe(gulp.dest(paths.dest+paths.folder+type.folder));
    });
    return stream;
});