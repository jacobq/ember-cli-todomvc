## Create the application skeleton

Navigate to the folder that you want to create your project in and execute the following.

```sh
ember new ember-cli-todomvc
cd ember-cli-todomvc
```

This will scaffold out the application structure and give you a starting point to build on. All bash commands going forward are in the application directory. When files are referenced throughout this tutorial, they will be provided with the path assuming that the application directory is the base.

## Install TodoMVC base

The fine folks at TodoMVC provide the CSS for the application, so we don't have to build it from scratch.

```sh
ember install:bower todomvc-app-css
ember install:bower todomvc-common
```

All dependencies are added to `Brocfile.js` before `module.exports = app.toTree();`. You can only import assets from the `bower_components` and `vendor` directories.

```javascript
app.import('bower_components/todomvc-common/base.css');
app.import('bower_components/todomvc-app-css/index.css');
```

## Adding first route and template

```sh
ember g route todos --type=resource --path '/'
```

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