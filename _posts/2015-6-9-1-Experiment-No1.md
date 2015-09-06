---
layout: post
title: Experiment No.1
---

[Emscripten](https://github.com/kripken/emscripten) is a very cool piece of technology developed by [Alon Zakai](https://twitter.com/kripken); a researcher at [Mozilla](https://www.mozilla.org/en-US/mission/). Its purpose is to serve as a backend to the [LLVM compiler](http://llvm.org/), translating LLVM intermediary code to JavaScript. This allows almost any code written for languages capable of targeting LLVM to be ported to JavaScript.

Another very cool feature of Emscripten is that many libraries are supported, including SDL, and OpenGL ES calls - which get mapped to the relevant WebGL calls.

As a preliminary test of this technology, I ported an old [simplex noise](https://en.wikipedia.org/wiki/Simplex_noise) based terrain generator written in C++ and OpenGL to be viewable in-browser. After installing the [Emscripten SDK package](https://kripken.github.io/emscripten-site/docs/getting_started/downloads.html) and reading the documentation on [GLFW](http://www.glfw.org/docs/latest/) to setup a WebGL context, the port was complete within half an hour.

A few things could vastly improve this demo; namely preventing the camera from intersecting the terrain - alas, here is experiment no.1:

<iframe width="100%" height="450" src="https://rawgit.com/xcodedave/xcodedave.github.io/master/experiments/birds/birds.html" frameborder="0"> </iframe>