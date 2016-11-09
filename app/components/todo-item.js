import Ember from 'ember';

export default Ember.Component.extend({
    tagName: 'li',
    classNameBindings: ['isCompleted:completed', 'isEditing:editing'],
    item: null,
    isEditing: false,
    isCompleted: function (key, value) {
        let item = this.get('item');

        if (value === undefined) {
            return item.get('isCompleted');
        } else {
            item.set('isCompleted', value);
            item.save();
            return value;
        }
    }.property('item.isCompleted'),
    actions: {
        editTodo: function () {
            this.set('isEditing', true);
        },
        acceptChanges: function () {
            this.set('isEditing', false);

            if (Ember.isEmpty(this.get('item.title'))) {
                this.send('removeTodo');
            } else {
                this.get('item').save();
            }
        },
        removeTodo: function () {
            this.get('item').destroyRecord();
        }
    }
});
