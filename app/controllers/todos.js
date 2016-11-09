import Ember from 'ember';

export default Ember.Controller.extend({
    completed: Ember.computed('model.@each.isCompleted', function() {
        return this.get('model').filterBy('isCompleted', true).get('length');
    }),
    remaining: Ember.computed('model.@each.isCompleted', function() {
        return this.get('model').filterBy('isCompleted', false).get('length');
    }),
    inflection: Ember.computed('remaining', function() {
        let remaining = this.get('remaining');
        return remaining === 1 ? 'item' : 'items';
    }),
    allAreDone: function (key, value) {
        if (value === undefined) {
            return !!this.get('length') && this.isEvery('isCompleted');
        } else {
            this.setEach('isCompleted', value);
            this.invoke('save');
            return value;
        }
    }.property('model@each.isCompleted'),
    actions: {
        clearCompleted: function () {
            let completed = this.get('model').filterBy('isCompleted', true);
            completed.invoke('deleteRecord');
            completed.invoke('save');
        },
        createTodo: function () {
            let title = this.get('newTitle');
            if (!title.trim()) {
                return;
            }

            let todo = this.store.createRecord('todo', {
                title: title,
                isCompleted: false
            });

            this.set('newTitle', '');

            todo.save();
        }
    }
});
