# Procedural 3D planets generator

A simple procedural 3D planet generator made with three.js and pure JS for [this article](http://pablohuet.ml/blog/3) (in spanish). 

![A procedural planet with a ring](http://huetapi.ml/media/11)

You can test a live version [here](http://pablohuet.ml/public/examples/article2/).

Note that it is not intended to be fast or accurate, use it at your own risk. 

## Requirements

The libraries included in the "lib" folder:

* noise.js from this [repo](https://github.com/josephg), based on Stefan Gustavson work and implemented by Joseph Gentle.
* bridson.js, a poisson disk sampling implementation.

Other libraries, included in the **index.html** using their CDN.

* [three.js](https://threejs.org/), a webgl wrapper.
* [dat.gui](https://github.com/dataarts/dat.gui), a simple gui for js apps.

## How to use

You can simply use it by opening the **index.html** file.

## License

This project is under **MIT license**, you can review it at the *LICENSE* included file in this repo.

## Authors

- **Pablo Huet** - *initial work* - [Github](https://github.com/pabletos/) , [website](http://www.pablohuet.ml/)

