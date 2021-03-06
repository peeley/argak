const mix = require('laravel-mix');

/*
 |--------------------------------------------------------------------------
 | Mix Asset Management
 |--------------------------------------------------------------------------
 |
 | Mix provides a clean, fluent API for defining some Webpack build steps
 | for your Laravel application. By default, we are compiling the Sass
 | file for the application as well as bundling up all the JS files.
 |
 */

mix.ts('resources/js/canvas/app.ts', 'public/js')
   .sass('resources/sass/app.scss', 'public/css');

mix.ts('resources/js/home/Home.tsx', 'public/js');

mix.js('resources/js/bootstrap.js', 'public/js');
