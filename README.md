# Amount2Words

A simple converter of numbers into their word counterparts. Supports `cz`, `en` languages and `czk`, `eur`, `usd`, `gbp` currencies.

## Usage

`atw.amountToWords(amount, lang = "cz", curr = "czk")`

## Examples 

```js
atw.amountToWords(150010) -> jedno sto padesát tisíců deset korun českých
atw.amountToWords(115.2) -> jedno sto patnáct korun českých dvacet haléřů
atw.amountToWords(18) -> osmnáct korun českých
```
