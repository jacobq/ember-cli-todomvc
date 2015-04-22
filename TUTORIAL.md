## Create the application skeleton

Navigate to the folder that you want to create your project in and execute the following.

```sh
ember new ember-cli-todomvc
cd ember-cli-todomvc
ember serve
```

This will scaffold out the application structure and give you a starting point to build on. All bash commands going forward are in the application directory. When files are referenced throughout this tutorial, they will be provided with the path assuming that the application directory is the base.

`ember serve` instantates a server that you can access at `localhost:4200` and will watch for changes in the application directory.

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

Copy all HTML between `<body>` and `</body>` to `app/templates/todos.hbs`. Replace copied HTML in `app/templates/application.hbs` with {{outlet}}.

```html
//...
<body>
	{{outlet}}
</body>
//...
```

## Modeling data

Use the model generator to create a new `todo` model.

```sh
ember generate model todo
```

This will create two new files:
* `/app/models/todo.js`
* `tests/unit/models/todo-test.js`

Modify `app/models/todo.js` to the following
```javascript
export default DS.Model.extend({
	title: DS.attr('string'),
	isCompleted: DS.attr('boolean')
});
```

## Create mock for fixture data

Previous versions of Ember used fixtures for mock data. While fixtures are still available, it is now recommended that you use http-mock which creates a simple Express.js server that will run when you use `ember serve`.

http-mock is very simple to setup and use. The generator does most of the work for you.

```sh
ember g http-mock todos
```

Add the mock data in JSON format between the `[]` in `server/mocks/todos.js`.

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

Use the generator to create a new adapter.

```sh
ember g adapter application
```

The adapter will be created at `app/adapters/application.js`. Open this file and modify it to read as follows.

```
import DS from 'ember-data';

export default DS.RESTAdapter.extend({
	namespace: 'api'
});
```

By default, http-mock serves the data from /api/todos, which necessitates the namespace.

## Displaying model data

Now that data is available to the application, the code will be modified to display the dynamic data rather than the static mockup.

To serve the data to the template, we first need to modify `app/routes/todos.js` so it knows what data to pull. Add the following inside the `extend` block.

```javascript
model: function() {
	return this.store.find('todo');
}
```

Now `app/templates/todos.hbs` can be modified to replace the static `<li>` elements with the Handlebars {{each}} helper.

```html
//...
<ul class="todo-list">
	{{#each todo in model}}
		<li>
			<input type="checkbox" class="toggle">
			<label>{{todo.title}}</label><button class="destroy"></button>
		</li>
	{{/each}}
</ul>
//...
```

Because no custom behavior is required from the controller at this point, we can rely on the default controller provided by the framework.

## Displaying a Model's Complete State

TodoMVC uses the `completed` class to apply a strikethrough to completed todos. Modify the `<li>` element in `app/templates/todos.hbs` to apply the class when a todo's `isCompleted` property is true.

```html
<li {{bind-attr class="todo.isCompleted:completed"}}>
```

## Creating a New Model Instance

Now that we can display the data, we can make some changes so we can add items to the todo list.

First, replace the `input` element in `apps/templates/todos.hbs` with an `{{input}}` helper.

```html
<h1>todos</h1>
{{input type="text" class="new-todo" placeholder="What needs to be done?" value=newTitle action="createTodo"}}
//...
```

The helper binds the `newTitle` property of the controller to the `value` attribute of the input.

Next, use the generator to create a `todos` controller to implement custom logic.

```sh
ember g controller todos
```

In the newly generated `app/controllers/todos.js` change `Ember.Controller.extend` to `Ember.ArrayController.extend` so it will handle the array data that we are passing to it.

Add the following to the extend block
```javascript
actions: {
	createTodo: function() {
		var title = this.get('newTitle');
		if (!title.trim()) { return; }

		var todo = this.store.createRecord('todo', {
			title: title,
			isCompleted: false
		});

		this.set('newTitle', '');

		todo.save();
	}
}
```

`createTodo` gets the `newTitle` property and creates a new todo record using the input as the title and setting `isCompleted` to false. It then clears the input and saves the record to the store.

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
