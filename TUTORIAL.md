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

## Displaying a model's complete state

TodoMVC uses the `completed` class to apply a strikethrough to completed todos. Modify the `<li>` element in `app/templates/todos.hbs` to apply the class when a todo's `isCompleted` property is true.

```html
<li {{bind-attr class="todo.isCompleted:completed"}}>
```

## Creating a new model instance

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

## Marking a model as complete or incomplete

Next up, we will add the ability to mark a todo as complete or incomplete and persist the update.

First, update `app/templates/todos.hbs` by adding an `itemController` to the `{{each}}` helper. Also, convert the static `<input>` element to an `{{input}}` helper.

```html
{{#each todo in model itemController="todo"}}
	<li {{bind-attr class="todo.model.isCompleted:completed"}}>
		{{input type="checkbox" checked=todo.model.isCompleted class="toggle"}}
		<label >{{todo.model.title}}</label><button class="destroy"></button>
	</li>
{{/each}}
```

Notice that `todo.isCompleted` has been changed to `todo.model.isCompleted`. This is a result of the way the new todo controller is structured. Ember recently depricated the `ObjectController` class in favor of the easier to remember `Controller` class, which is part of the reason for this change.

A new controller needs to be created for working with the individual todos. Use the generator to create the controller.

```sh
ember g controller todo
```

In the `extend` block of `app/controllers/todo.js` add this code.

```javascript
isCompleted: function(key, value) {
	var model = this.get('model');

	if (value === undefined) {
		return model.get('isCompleted');
	} else {
		model.set('isCompleted', value);
		model.save();
		return value;
	}
}.property('model.isCompleted')
```

The `isCompleted` property of the controller is a computed property whose value is dependent on the value of the model instance's `isCompleted` property.

When called with a value, because the user clicked the checkbox, the controller will toggle the model instance's `isCompleted` property and persist the change.  When called without a value, such as on the page load, it will simply return the value of the model instance's `isCompleted` property.

## Displaying the number of incomplete todos

Update `app/templates/todos.hbs` as shown below.

```html
<span class="todo-count">
	<strong>{{remaining}}</strong> {{inflection}} left
</span>
```

Implement the `remaining` and `inflection` properties in `app/controllers/todos.js`.

```javascript
actions: {
	// ...
},
remaining: function() {
	return this.filterBy('isCompleted', false).get('length');
}.property('@each.isCompleted'),
inflection: function() {
	var remaining = this.get('remaining');
	return remaining === 1 ? 'item' : 'items';
}.property('remaining')
```

The `remaining` property returns the number of todos whose `isCompleted` property is false. Any time the `isCompleted` property of a todo changes, the `remaining` property will recalculate.

The `inflection` property watches the `remaining` property and will update whenever `remaining` updates. If `remaining` is 1 the singular will be returned, otherwise the plural will be returned.

## Toggling between showing and editing states

tk

## Accepting edits

```sh
ember g component edit-todo
```

## Deleting a model

tk

## Adding child routes

```sh
ember g route todos/index
```

## Transitioning to show only incomplete todos

```sh
ember g route todos/active
```

## Transitioning to show only completed todos

```sh
ember g route todos/completed
```

## Transitioning back to show all todos

tk

## Displaying a button to remove all completed todos

tk

## Indicating when all todos are complete

tk

## Toggling all todos between complete and incomplete

tk

## Replacing HTTP-Mock with localStorage

Adapters are easily swapped without affecting the overall application. Now that the application is complete, we will add a localStorage adapter, so the information can be persisted outside the session without a server.

Install the localStorage adapter and create a serializer to manage stringifying the JSON data for storage.

```sh
ember install:bower ember-localstorage-adapter
ember g serializer application
```

Go to Brocfile.js and add the following below the CSS imports which will include the adapter logic as a dependency.

```javascript
app.import('bower_components/ember-localstorage-adapter/localstorage_adapter.js');
```
Now we need to make the application aware that we are using localStorage rather than REST.

Open `app/serializers/application.js` and change `RESTSerializer` to `LSSerializer`.

Open `app/adapters/application.js` and change `RESTAdapter` to `LSAdapter`.

[TodoMVC]: http://www.todomvc.com
