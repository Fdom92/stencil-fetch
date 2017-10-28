![Built With Stencil](https://img.shields.io/badge/-Built%20With%20Stencil-16161d.svg?logo=data%3Aimage%2Fsvg%2Bxml%3Bbase64%2CPD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4KPCEtLSBHZW5lcmF0b3I6IEFkb2JlIElsbHVzdHJhdG9yIDE5LjIuMSwgU1ZHIEV4cG9ydCBQbHVnLUluIC4gU1ZHIFZlcnNpb246IDYuMDAgQnVpbGQgMCkgIC0tPgo8c3ZnIHZlcnNpb249IjEuMSIgaWQ9IkxheWVyXzEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHg9IjBweCIgeT0iMHB4IgoJIHZpZXdCb3g9IjAgMCA1MTIgNTEyIiBzdHlsZT0iZW5hYmxlLWJhY2tncm91bmQ6bmV3IDAgMCA1MTIgNTEyOyIgeG1sOnNwYWNlPSJwcmVzZXJ2ZSI%2BCjxzdHlsZSB0eXBlPSJ0ZXh0L2NzcyI%2BCgkuc3Qwe2ZpbGw6I0ZGRkZGRjt9Cjwvc3R5bGU%2BCjxwYXRoIGNsYXNzPSJzdDAiIGQ9Ik00MjQuNywzNzMuOWMwLDM3LjYtNTUuMSw2OC42LTkyLjcsNjguNkgxODAuNGMtMzcuOSwwLTkyLjctMzAuNy05Mi43LTY4LjZ2LTMuNmgzMzYuOVYzNzMuOXoiLz4KPHBhdGggY2xhc3M9InN0MCIgZD0iTTQyNC43LDI5Mi4xSDE4MC40Yy0zNy42LDAtOTIuNy0zMS05Mi43LTY4LjZ2LTMuNkgzMzJjMzcuNiwwLDkyLjcsMzEsOTIuNyw2OC42VjI5Mi4xeiIvPgo8cGF0aCBjbGFzcz0ic3QwIiBkPSJNNDI0LjcsMTQxLjdIODcuN3YtMy42YzAtMzcuNiw1NC44LTY4LjYsOTIuNy02OC42SDMzMmMzNy45LDAsOTIuNywzMC43LDkyLjcsNjguNlYxNDEuN3oiLz4KPC9zdmc%2BCg%3D%3D&colorA=16161d&style=flat-square)

# stencil-fetch

st-voice2text is a web component built with [Stencil](https://stenciljs.com/) that allows you to use the [Fetch API](https://developers.google.com/web/updates/2015/03/introduction-to-fetch).

## Getting Started

To try this component:

```bash
git clone git@github.com:Fdom92/stencil-fetch.git
cd my-app
git remote rm origin
```

and run:

```bash
npm install
npm start
```

## Using this component

### Script tag

- Put `<script src='https://unpkg.com/stencil-fetch@latest/dist/fetch.js'></script>` in the head of your index.html
- Then you can use the component

### Node Modules
- Run `npm install stencil-fetch --save`
- Put a script tag similar to this `<script src='node_modules/stencil-fetch/dist/fetch.js></script>` in the head of your index.html
- Then you can use the component

### In a stencil-starter app
- Run `npm install stencil-fetch --save`
- Add `{ name: 'stencil-fetch' }` to your [collections](https://github.com/ionic-team/stencil-starter/blob/master/stencil.config.js#L5)
- Then you can use the component


## Parameters

Attribute | Default | Description
------------ | ------------- | -------------
headers | {} | Headers for the request
method | 'GET' | The method for the request (GET, POST...)
url | '' | The URL to make the request
buttonLabel | Fetch | The button label

## Events

You can listen for the `resolved` or `error` events like:

> myComponent.addEventListener('resolved', function() {console.log('done')})

### Resolved

This event will be emitted when all goes OK

### Error

This event will be emitted when an error ocurred

## Example

`<st-fetch url="https://jsonplaceholder.typicode.com/posts"></st-fetch>`