# Worldwide.vote: Hillary vs Trump
![Hillary vs Trump](/src/assets/images/hillary-vs-trump.png)

In the fall of 2016 a new President of the United States was to be chosen by the American people. The outcome of this election would have a global effect. People from all over the world were watching the U.S. closely during this process of debates, polls and scandals.

In this period of time [Arthur van 't Hoog](http://arthurvanthoog.nl) (illustrator) and [Filidor Wiese](https://galaxy.fili.nl) (developer) created a visually pleasing [voting website](https://worldwide.vote/hillary-vs-trump) so that the entire world could have their voices heard. We did this out of shear fun and because we were genuinely interested to see which candidate is preferred by people from other countries. To reach as many people as possible, we've made the website available in 9 major languages including English, French, Chinese, Arabic, German, Spanish, Japanese, Portuguese and Russian. We launched on the 22nd of September, long story short, it went viral the same day. In the few weeks to follow well over 400K votes were cast and we got a lot of fan and hate mail. Suprisingly, our poll numbers ended up being very close to the actual election result.

For whoever is interested, this repository contains the source code for the project. All artwork has been created by Arthur van 't Hoog and is not free for use (see license information below).

## Prerequisites
* Npm (LTS version or higher)
* Docker
* Docker-compose

## Installing dependencies
```
$ npm install
```

## Configure
```
$ cp config/config.ini.sample config/config.ini
```
For development purposes you can leave the config as is.

## Running dev environment
```
$ docker-compose up
$ npm run serve
```

## License ##

The code and artwork in this repository is licensed under a [Creative Commons Attribution-NonCommercial 4.0 International License](http://creativecommons.org/licenses/by-nc/4.0/).

Meaning you are free to:

* Share — copy and redistribute the material in any medium or format
* Adapt — remix, transform, and build upon the material

Under the following terms:

* Attribution — You must give appropriate credit, provide a link to the license, and indicate if changes were made. You may do so in any reasonable manner, but not in any way that suggests the licensor endorses you or your use.
* NonCommercial — You may not use the material for commercial purposes.
