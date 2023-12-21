# Visualisation de données - d3.js

> Data-Driven Documents

[d3.js](http://www.d3js.org) est une librairie `javascript` très complète avec beaucoup d'exemples à disposition, avec une personnalisation totale possible. Elle permet l'accès à des primitives `SVG` permettant toute innovation. Malheureusement, elle est peu accessible directement et assez technique.

L'idée principale est de lier les **données** au **DOM** (*Document Object Model*), et d'appliquer des transformations, basées sur les données, au document.

- [Cours introductif](d3js-lesson.md)
- [Tutoriel pas à pas](d3js-tutorial) de construction d'un **TOPn**

## Travail à réaliser

En repartant des données de production scientifique (au format `CSV` cette fois) disponible ici [scimagojr.csv](https://docs.google.com/spreadsheets/d/e/2PACX-1vShuV7YDfFvbcOcpku7BKY0_sN6i3SaVbva9ebY9wzgOEHNS6rb8mX21eeRNnHGQj5ns64_EY2CpJtc/pub?gid=1902854758&single=true&output=csv), refaire les demandes suivantes :

- Faire toutes les demandes dans le tutoriel pour améliorer le `TOP`
  
- **Nuage de points** : nuage de points entre le nombre de documents produits et le nombre moyen de citations pour la dernière année disponible, pour chaque pays, avec les contraintes suivantes :
  
    - couleur (entre du vert pour le 1er et du rouge pour le dernier) en fonction de son rang
  
    - taille en fonction du *H-index*
  
    - lignes de références au niveau des moyennes de chaque variable
  
    - axes logarithmiques
  
    - nom de chaque pays indiqué lorsque la souris passe dessus


### Rendu

Merci de déposer un fichier `zip` contenant l'ensemble de vos fichiers (`HTML`, `JS` et éventuellement `CSS`), avec votre nom de famille dans le nom de fichier, sur `google Classroom` (`D3.js`)  : https://classroom.google.com/c/NjI3Nzc5ODgxNjQ5?cjc=ew2enjf




