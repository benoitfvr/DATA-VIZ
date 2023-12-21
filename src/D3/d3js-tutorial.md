# Tutoriel de création d'un TOPn

## Données

Nous travaillons sur les données de production scientifique (au format `CSV` cette fois), disponible ici [scimagojr.csv](https://docs.google.com/spreadsheets/d/e/2PACX-1vShuV7YDfFvbcOcpku7BKY0_sN6i3SaVbva9ebY9wzgOEHNS6rb8mX21eeRNnHGQj5ns64_EY2CpJtc/pub?gid=1902854758&single=true&output=csv).


## Objectif

<p class="codepen" data-height="300" data-default-tab="result" data-slug-hash="OJQogOx" data-user="mt" style="height: 300px; box-sizing: border-box; display: flex; align-items: center; justify-content: center; border: 2px solid; margin: 1em 0; padding: 1em;">
  <span>See the Pen <a href="https://codepen.io/Madjid-TAOUALIT/pen/BabBvjE?editors=1111">EXAMPLE TOPn</a> by MT
  on <a href="https://codepen.io">CodePen</a>.</span>
</p>
<script async src="https://cpwebassets.codepen.io/assets/embed/ei.js"></script>

&nbsp; 

## Pas à pas

### Fichier HTML

On commence par créer le fichier HTML qui va recevoir notre travail, nommé par exemple `d3js--base.html`. Ici, nous mettrons le TOP dans la balise `<div>` nommée `top`. L'autre balise nommée `nuage` vous servira pour réaliser le travail à demander par la suite. Le fichier CSS, nommé `d3js--base.css`, sera vu plus tard. Nous chargeons la dernière version de la librairie [d3js](https://d3js.org) (version 7).

```html
<!DOCTYPE html>
<html>
    <head>
        <meta charset = "UTF-8">
        <script src="https://d3js.org/d3.v7.min.js"></script>
        <link rel="stylesheet" href="d3js--base.css">
    </head>
    <body>
        <div id = "top"></div>
        <div id = "nuage"></div>
        <script src = "d3js--base.js"></script>
    </body>
</html>
```

### Fichier JS

#### Titre de l'onglet

Dans le fichier `d3js--base.js`, nous pouvons déjà tester la librairie pour renommer la page (au niveau de l'onglet du navigateur), en intégrant ce code :

```js
d3.select("head").append("title").html("Base travail d3js");
```

> **A FAIRE** : ajouter un titre ("TOP de l'année choisie" par exemple) de niveau `<h2>` en début de la page

#### Taille du TOP

Nous allons maintenant ajouter un bouton [`radio`](https://developer.mozilla.org/fr/docs/Web/HTML/Element/Input/radio) qui nous permettra de choisir la taille du TOP que l'on veut afficher (ici: 3, 5, 10 ou 20 premiers). Pour cela, on ajoute le code suivant :

```js
var choix_taille = d3.select("#top").append("form").attr("class", "choix")
    .append("fieldset");
choix_taille.append("legend").html("Choisir une taille");
choix_taille
    .selectAll("input")
    .data([3, 5, 10, 20])
    .enter()
    .append("label")
    .text(function(d) {return d;})
    .insert("input")
    .attr("type", "radio")
    .attr("name", "taille")
    .attr("value", function(d) {return d;})
    .property("checked", function(d) {return d == 5;})
    .on("change", function() { console.log(this.value) });
```

Si vous affichez la console du navigateur, lors d'un changement de taille, vous devriez vous écrit la nouvelle taille choisie.

> **A FAIRE** : créer dans un nouveau `fieldset` (stockée dans une variable nommée `champs1_bis`) intitulé "Choisir si vous souhaitez un FLOP" une [`checkbox`](https://developer.mozilla.org/fr/docs/Web/HTML/Element/Input/checkbox) nommée `flop`, décochée par défaut et avec comme label `FLOP`

#### Année du TOP

Nous voulons laisser le choix de l'année à l'utilisateur. Pour cela, un élément [`select`](https://developer.mozilla.org/fr/docs/Web/HTML/Element/select) est approprié. Le code ci-dessous permet de le créer, mais vide. Nous ajouterons les options de choix des années plus tard, lorsque nous aurons chargé les données.

```js
var choix_annee = d3.select("#top").append("form").attr("class", "choix")
    .append("fieldset");
choix_annee.append("legend").html("Choisir une année");
choix_annee.append("select").attr("name", "annee").attr("id", "choix_annee");
```

> **A FAIRE** : créer un nouveau fieldset dans lequel l'utilisateur pour choisir ou non une région spécifique du globe, nommé `choix_region` par exemple (voire plusieurs régions).

#### Structure du tableau représentant le TOP

Il est plus simple de créer la structure du tableau à remplir en amont, comme ci-dessous. La `table` HTML sera donc en deux parties : le nom des variables dans `thead` et les données dans `tbody`

```js
d3.select("#top").append("table")
    .append("thead")
    .append("tr")
    .selectAll("th")
    .data(["Pays", "Rang", "Documents", "Citations"])
    .enter()
    .append("th")
    .html(function(d) {return d;});
d3.select("#top").select("table")
    .append("tbody")
    .attr("id", "table_top");
```

> **A FAIRE** : Ajouter la colonne *Région* (qui est plus ou moins le continent) juste après le pays, et la colonne H-index à la fin.

#### Fonctions utiles

##### Génération d'une cellule

En HTML, une cellule d'un tableau est dans une balise `<td>`. Cette fonction prend donc une valeur en paramètre et renvoie une chaîne de caractère ajoutant `"<td>"`devant et `"</td>"` derrière. Pour avoir un affichage plus agréable, on ajoute `"class='texte'"` pour une valeur chaîne de caractère et `"class='nombre'"` pour une valeur numérique.

```js
var generateCell = function(d) {
    return "<td class='" + (isNaN(parseInt(d)) ? "texte" : "nombre") + "'>" + d + "</td>";
}
```

##### Génération d'une ligne

On utilise la fonction précédente pour créer une ligne à partir d'un élément du jeu de données, en indiquant donc le pays, le rang, le nombre de documents et le nombre de citations.

```js
var generateRow = function(d) {
    return generateCell(d.Country) + generateCell(d.Rank) + generateCell(d.Documents) + generateCell(d.Citations);
}
```

> **A FAIRE** : compléter la fonction `generateRow()` pour ajouter les informations manquantes (la région est dans la variable `Region` et le H-index dans la variable `Hindex`)

#### Récupération des données

La fonction [`d3.csv()`](https://github.com/d3/d3-fetch/blob/v3.0.1/README.md#csv) permet de récupérer des données stockées dans un fichier texte, avec comme séparateur une virgule. Il existe bien évidemment d'autres fonctions pour d'autres types de données textes. Le premier paramètre est l'adresse du fichier stockant les données. Le deuxième paramètre permet de définir une fonction à appliquer à chaque élément, souvent utilisée pour faire des transformations sur les données (ici, conversion en numérique de certaines variables). Sur l'objet créé par `d3.csv()`, on peut appliquer la foncion `.then()` qui, elle, applique la fonction définie en paramètre sur les données une fois celles-ci chargées. Nous verrons les 4 étapes, indiquées par les commentaires, par la suite.

```js
d3.csv(
    "https://docs.google.com/spreadsheets/d/e/2PACX-1vShuV7YDfFvbcOcpku7BKY0_sN6i3SaVbva9ebY9wzgOEHNS6rb8mX21eeRNnHGQj5ns64_EY2CpJtc/pub?gid=1902854758&single=true&output=csv",
    function (d) {
        return {
            Year: parseInt(d.Year),
            Rank: parseInt(d.Rank),
            Country: d.Country,
            Documents: parseInt(d.Documents),
            Citations: parseInt(d.Citations),
            Hindex: parseInt(d["H index"])
        }
    })
    .then(function(data) {
        // Mise à jour du choix des années
    
        // Remplissage du tableau
    
        // Changement de taille
        // Changement d'année
                          
        // Changement de type : TOP ou FLOP
    })
```

> **A FAIRE** : Ajouter les champs `Region` (sans modification) et `Hindex` à chaque élément dans la fonction dédiée, à partir des champs `Region` et `H index` (attention à l'espace - il faut aussi le transformer en entier).

#### Mise à jour du choix des années

Lorsque nous avons les données, nous pouvons déjà mettre à jour la liste des années à mettre dans le `select` nommé `choix_annee`. Le code suivant doit se placer juste après la première ligne de commentaire.

```js
d3.select("#choix_annee").selectAll("option")
    .data(Array.from(new Set(data.map(function(d) {return d.Year;}))))
    .enter()
    .append("option")
    .attr("value", function(d) {return d;})
    .html(function(d) {return d;});
```

> **A FAIRE** : Mettez à jour les régions dans le `select` que vous avez créé, en sélectionnant toutes les régions au départ.
    
#### Remplissage du tableau

Nous pouvons maintenant remplir le tableau avec les données. Nous sélectionnons déjà les données de l'année spécifiée (par défaut, c'est la dernière). toutes les données seront toujours présentes, mais seules les 3, 5, 10 ou 20 premières seront visibles, en fonction du choix de l'utilisateur. C'est avec le `display` que l'on met à `none` si le rang est supérieure à la taille, ou à `table-row` sinon, que l'on peut limiter ce qui est visible par l'utilisateur. Dans la fonction passée en paramètre de `.style()`, le premier paramètre est donc les données et le second sa position dans le tableau des données. Puisque les données sont ordonnées dans le fichier d'origine, l'élément à la position `i` est au rang `i+1`.

```js
var data_annee = d3.filter(data, function(d) {return d.Year == d3.select("#choix_annee").node().value;});
d3.select("#table_top").selectAll("tr")
    .data(data_annee)
    .enter()
    .append("tr")
    .style("display", function(d, i) {
        return (i+1) > parseInt(d3.select('input[name="taille"]:checked').node().value) ? "none" : "table-row";
    })
    .html(function(d) { return generateRow(d); })
```

> **A FAIRE** : Filtrez avec les régions sélectionnées (toutes au départ par défaut).
    
#### Changement de taille

On ajoute un suivi du changement de `choix_annee`, pour *cacher* ou non les lignes inutiles pour nous.

```js
choix_taille.on("change", function() { 
    d3.select("#table_top").selectAll("tr")
        .style("display", function(d, i) { 
            return (i+1) > parseInt(d3.select('input[name="taille"]:checked').node().value) ? "none" : "table-row";
        })
})
```

#### Changement d'année

Ici, lorsqu'on change d'années, on doit récupérer les nouvelles données. Le travail est donc un peu plus conséquent.

```js
choix_annee.on("change", function() {
    data_annee = d3.filter(data, function(d) { return d.Year == d3.select("#choix_annee").node().value});
    d3.select("#table_top").html("")
        .selectAll("tr")
        .data(data_annee)
        .enter()
        .append("tr")
        .style("display", function(d, i) { 
            return (i+1) > parseInt(d3.select('input[name="taille"]:checked').node().value) ? "none" : "table-row";
        })
        .html(function(d) { return generateRow(d); });
});
```

> **A FAIRE** : Gérer le changement de région (dans ce cas, c'est la position dans la liste qu'il faudra regarder et plus le rang), et le changement de type TOP/FLOP (il faudra trier les données, par exemple avec la fonction ...)

### Fichier CSS

On peut améliorer le rendu, en ajoutant ce code dans un fichier `d3js--base.css`. Vous pouvez le modifier si vous le souhaitez.

```css
.choix {
    width: 50%;
    vertical-align: top;
    display: inline-block;
}

#top table {
    margin: 0 auto;
}

#top tr th {
    text-align: center;
    min-width: 100px;
    background-color: steelblue;
    color: white;
}
#top td{
    padding: 0 10px;
}
#top td.texte {
    text-align: left;
}
#top td.nombre {
    text-align: right;
}
#top tbody tr:nth-child(odd) {
    background-color: lightblue;
}
```

