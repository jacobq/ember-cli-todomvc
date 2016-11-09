import Ember from 'ember';

export default Ember.Route.extend({
    model() {
        return this.get('store').findAll('todo').then((todos) => {
            let filteredTodos = todos.filter((todo) => {
                console.log("todo:", todo);
                return todo.get('isCompleted') === false;
            });
            console.log(filteredTodos);
            return filteredTodos;
        });
    }
});
