import Ember from 'ember';

export default Ember.ArrayController.extend({
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
});
