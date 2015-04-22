## Create the application skeleton

Navigate to the folder that you want to create your project in and execute the following.

```sh
ember new ember-cli-todomvc
cd ember-cli-todomvc
```

This will scaffold out the application structure and give you a starting point to build on. All bash commands going forward are in the application directory. When files are referenced throughout this tutorial, they will be provided with the path assuming that the application directory is the base.

## Install TodoMVC base

The fine folks at [TodoMVC] provide the CSS for the application, so we don't have to build it from scratch.

```sh
ember install:bower todomvc-app-css
ember install:bower todomvc-common
```

All dependencies are added to `Brocfile.js` before `module.exports = app.toTree();`. You can only import assets from the `bower_components` and `vendor` directories.

```javascript
app.import('bower_components/todomvc-common/base.css');
app.import('bower_components/todomvc-app-css/index.css');
```

## Create a static mockup of the app

Before adding any code, create a static mockup of the app to `app/templates/application.hbs`. There is no need to add links to the CSS files, as that will be handled by Ember's built-in dependency management.

```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <title>Ember.js • TodoMVC</title>
  </head>
  <body>
    <section class="todoapp">
      <header class="header">
        <h1>todos</h1>
        <input type="text" class="new-todo" placeholder="What needs to be done?" />
      </header>

      <section class="main">
        <ul class="todo-list">
          <li class="completed">
            <input type="checkbox" class="toggle">
            <label>Learn Ember.js</label><button class="destroy"></button>
          </li>
          <li>
            <input type="checkbox" class="toggle">
            <label>...</label><button class="destroy"></button>
          </li>
          <li>
            <input type="checkbox" class="toggle">
            <label>Profit!</label><button class="destroy"></button>
          </li>
        </ul>

        <input type="checkbox" class="toggle-all">
      </section>

      <footer class="footer">
        <span class="todo-count">
          <strong>2</strong> todos left
        </span>
        <ul class="filters">
          <li>
            <a href="all" class="selected">All</a>
          </li>
          <li>
            <a href="active">Active</a>
          </li>
          <li>
            <a href="completed">Completed</a>
          </li>
        </ul>

        <button class="clear-completed">
          Clear completed (1)
        </button>
      </footer>
    </section>

    <footer class="info">
      <p>Double-click to edit a todo</p>
    </footer>
  </body>
</html>
```

This will be modified throughout the tutorial as features are implemented.

## Adding first route and template

ember-cli utilizes generators similar to Rails. Generators are called using `ember generate` or `ember g` for short. This tutorial will use the short form.

The `route` generator has two options:
* `type` can be either `route` or `resource`
* `path` which specifies a path other than what can be directly inferred using the route name

A `resource` does not change the URI, whereas a `route` does.

Use the route generator to create a resource at the URI root.

```sh
ember g route todos --type=resource --path '/'
```

The generator will create three files:
* `app/routes/todos.js`
* `app/templates/todos.hbs`
* `tests/unit/routes/todos-test.js`

The generator also modifies `app/router.js` to reflect the new route/resource.

Copy all HTML between <body> and </body> to todos.hbs. Replace copied HTML in application.hbs with {{outlet}}.

## Modeling data

```sh
ember generate model todo
```

Modify models/todo.js to the following
```javascript
export default DS.Model.extend({
	title: DS.attr('string'),
	isCompleted: DS.attr('boolean')
});
```

## Create mock for fixture data

```sh
ember g http-mock todos
```

Add the following between the `[]` in server/mocks/todos.js.

```javascript
{
	id: 1,
	title: 'Learn Ember.js',
	isCompleted: true
},
{
	id: 2,
	title: '...',
	isCompleted: false
},
{
	id: 3,
	title: 'Profit!',
	isCompleted: false
}
```

Create a file called `application.js` in the adapters folder and populate with the following code:

```
import DS from 'ember-data';

export default DS.RESTAdapter.extend({
	namespace: 'api'
});
```

## Displaying Model Data

```javascript
model: function() {
	return this.store.find('todo');
}
```

## Displaying a Model's Complete State

tk

## Creating a New Model Instance

Replace the input with an `{{input}}` helper.

```javascript
{{input type="text" class="new-todo" placeholder="What needs to be done?" value=newTitle action="createTodo"}}
```

Generate a controller

```sh
ember g controller todos
```

Change `Ember.Controller.extend` to `Ember.ArrayController.extend`.

Add the following to the extend block
```javascript
tk
```

## Marking a Model as Complete or Incomplete

tk

```sh
ember g controller todo
```

Populate todo.js with following
```javascript
tk
```

## Displaying the Number of Incomplete Todos

tk

## Toggling between Showing and Editing States

tk

## Accepting Edits

```sh
ember g component edit-todo
```

## Deleting a Model

tk

## Adding Child Routes

```sh
ember g route todos/index
```

## Transitioning to Show Only Incomplete Todos

```sh
ember g route todos/active
```

## Transitioning to Show Only Completed Todos

```sh
ember g route todos/completed
```

## Transitioning Back to Show All Todos

tk

## Displaying a Button to Remove All Completed Todos

tk

## Indicating When All Todos Are Complete

tk

## Toggling All Todos Between Complete and Incomplete

tk

## Replacing HTTP-Mock with localStorage

```sh
ember install:bower ember-localstorage-adapter
ember g serializer application
```

Go to Brocfile.js and add the following below the CSS imports

```javascript
app.import('bower_components/ember-localstorage-adapter/localstorage_adapter.js');
```

Open `app/serializers/application.js` and change `RESTSerializer` to `LSSerializer`.

Open `app/adapters/application.js` and change `RESTAdapter` to `LSAdapter`.

[TodoMVC]: http://www.todomvc.com
